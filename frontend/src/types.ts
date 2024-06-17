
// Define the user details type
export interface publicUserDetailsProps {
    id: string;
    fullname: string;
    username: string;
    profile_picture: string;
}

export interface privateUserDetailsProps extends publicUserDetailsProps {
    password: string;
}

//Type that defines the interface of the chats the user has ongoing with different users
//Its the type that holds all the information of the chats, as well as its msgs.
export interface OnGoingChatsProps {
    chat_id: String;
    chat_name: String;
    chat_picture: String;
    // chat_type: String;
    // last_message_text: String;
    // last_message_timestamp: String;
    // sender_fullname: String;
    participants: publicUserDetailsProps[];
    messages: ChatMessages[];
}

export interface ChatMessages {
    id: String;
    text: String;
    sender_id: String;
    chat_id: String;
    created_at: String;
}