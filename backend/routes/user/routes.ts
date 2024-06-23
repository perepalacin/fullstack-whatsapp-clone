import express, { Request, Response } from "express";
import middleWare from "../../utils/middleware";
import sql from "../../utils/connectToDB";
import {
  OnGoingChatsProps,
  publicUserDetailsProps,
} from "../../../frontend/src/types";
import { getUserSocketId, io } from "../../socket/socket";
import { getRandomInt } from "../../utils/helperFunctions";

const router = express.Router();

//API call to get all users except self
router.get("/", middleWare, async (_req: Request, res: Response) => {
  try {
    const loggedInUser = res.locals.userId;

    if (!loggedInUser) {
      return res.status(400).json({ error: "Unauthorized request" });
    }

    const allUsersExceptSelf = await sql<
      publicUserDetailsProps[]
    >`SELECT id, fullname, username, profile_picture FROM users WHERE id != ${loggedInUser} and username != 'system1234' ORDER BY fullname`;

    return res.status(200).json(allUsersExceptSelf);
  } catch (error) {
    console.log("Error getting users" + error);
    return res
      .status(500)
      .json({ error: "Interval Server Error fetching users" });
  }
});

router.get("/chats", middleWare, async (_req: Request, res: Response) => {
  try {
    const loggedInUser = res.locals.userId;
    // const chats = await sql`SELECT * from chats JOIN chats_to_users ON chats_to_users.user_id = ${loggedInUser} JOIN users ON chats_to_users `;
    // const chats = await sql`SELECT * FROM messages ORDER BY created_at ASC JOIN chats_to_users ON chats_to_users.user_id = ${loggedInUser} GROUP BY chat_id`;
    const data = await sql`
                    SELECT
                c.id AS chat_id,
                c.name AS chat_name,
                c.picture AS chat_picture,
                c.type AS chat_type,
                lm.id AS last_message_id,
                lm.text AS last_message_text,
                lm.created_at AS last_message_timestamp,
                u.id AS sender_id,
                u.username AS sender_username,
                u.fullname AS sender_fullname,
                (
                    SELECT
                        jsonb_agg(
                            jsonb_build_object(
                                'id', u2.id,
                                'username', u2.username,
                                'fullname', u2.fullname,
                                'profile_picture', u2.profile_picture
                            )
                        )
                    FROM
                        chats_to_users ctu
                    JOIN
                        users u2 ON ctu.user_id = u2.id
                    WHERE
                        ctu.chat_id = c.id
                        AND u2.id <> ${loggedInUser}
                ) AS participants
            FROM
                chats c
            LEFT JOIN LATERAL (
                SELECT 
                    m.id,
                    m.text,
                    m.created_at,
                    m.sender_id
                FROM
                    messages m
                WHERE
                    m.chat_id = c.id
                ORDER BY
                    m.created_at DESC
                LIMIT 1
            ) lm ON true
            LEFT JOIN
                users u ON lm.sender_id = u.id
            JOIN
                chats_to_users ctu2 ON c.id = ctu2.chat_id
            WHERE
                ctu2.user_id = ${loggedInUser}
            ORDER BY
                lm.created_at DESC;
            `;

    const chats: OnGoingChatsProps[] = [];
    data.forEach((item) => {
      const newChat: OnGoingChatsProps = {
        chat_id: item.chat_id,
        chat_name:
          item.chat_type === "private"
            ? item.participants[0].fullname
            : item.chat_name,
        chat_picture:
          item.chat_type === "private"
            ? item.participants[0].profile_picture
            : item.chat_picture,
        chat_type: item.chat_type,
        participants: item.participants,
        messages: [
          {
            id: item.last_message_id,
            text: item.last_message_text,
            sender_id: item.sender_id,
            chat_id: item.chat_id,
            created_at: item.last_message_timestamp,
          },
        ],
      };
      chats.push(newChat);
    });

    return res.status(200).json(chats);
  } catch (error) {
    console.log("Error getting users" + error);
    return res
      .status(500)
      .json({ error: "Interval Server Error fetching users" });
  }
});

router.get("/user/:userId", middleWare, async (req: Request, res: Response) => {
  try {
    const loggedInUser = res.locals.userId;
    if (!loggedInUser) {
      return res.status(400).json({ error: "Unauthorized request" });
    }

    const { userId } = req.params;

    if (!userId) {
      return res.status(406).json({ error: "User id improperly formatted" });
    }

    const userDetails = await sql<
      publicUserDetailsProps[]
    >`SELECT id, fullname, username, profile_picture FROM users WHERE id = ${userId} LIMIT 1`;

    return res.status(200).json(userDetails);
  } catch (error) {
    console.log("Error getting users" + error);
    return res
      .status(500)
      .json({ error: "Interval Server Error fetching users" });
  }
});

router.post("/new-group", middleWare, async (req: Request, res: Response) => {
  try {
    //Get the params of the request
    const { name, participants } = req.body;
    
    if (!process.env.SYSTEM_USER_ID) {
      return res.status(500).json({ error: "Admin role id is missing" });
    }

    // We get the sender id from the session
    const senderId = res.locals.userId.toString();

    if (!name || !participants) {
      return res
        .status(400)
        .json({ error: "Request body improperly formatted" });
    }

    if (!senderId ) {
      return res.status(500).json({ error: "Unauthorized request" });
    }

    let externalRequest = true;
    participants.forEach((member: publicUserDetailsProps) => {
      if (member.id === senderId ) {
        externalRequest = false;
      }
    });

    if (externalRequest) {
      return res.status(500).json({ error: "Unauthorized request" });
    }

    const randomSeed = getRandomInt(200);
    const newChat = await sql`INSERT INTO chats (name, picture, type)
        VALUES (${name}, ${'https://picsum.photos/seed/' + randomSeed.toString() + '/200/200'}, 'group') RETURNING id, name`;

    const values = participants.map((user: publicUserDetailsProps) => [user.id, newChat[0].id]);
    await sql`INSERT INTO chats_to_users (user_id, chat_id) VALUES ${sql(
      values
    )}`;

    const systemId = "a9a7eac7-636f-489a-b892-6d65c10381f0";
    const newMessage = await sql`INSERT INTO messages (text, sender_id, chat_id) VALUES 
        (${"@" + participants[0].username + " created the group " + name}, ${systemId}, ${
      newChat[0].id
    }) RETURNING id, text, sender_id, chat_id, created_at`;

    const newChatObject: OnGoingChatsProps = {
     chat_id: newChat[0].id,
     chat_picture: 'https://picsum.photos/seed/' + randomSeed.toString() + '/200/200',
     chat_name: name,
     chat_type: 'group',
    //  messages: "@" + creator + " created the group " + name
    participants: participants,
    messages: [{
      id: newMessage[0].id,
      text: newMessage[0].text,
      sender_id: newMessage[0].sender_id,
      created_at: newMessage[0].created_at,
      chat_id: newMessage[0].chat_id,
    }]
    }

    for (let i = 0; i < newChatObject.participants.length; i++) {
      //Get the socket id of the receiver
      const receiverSocketId = getUserSocketId(newChatObject.participants[i].id);
      //If the receiver is online, create an event for this especific client!
      if (receiverSocketId && newChatObject.participants[i].id !== senderId) {
        io.to(receiverSocketId).emit("newChat", newChatObject);
      }
    }

    return res.status(200).json(newChatObject);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
