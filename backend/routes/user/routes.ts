// import express, { Request, Response } from "express";
// import middleWare from "../../utils/middleware";
// import User from "../../models/userModel";

// const router = express.Router();

// router.get("/", middleWare, async (req: Request, res: Response) => {
//     try {
//         console.log(req);
//         const loggedInUser = res.locals.userId;

//         const allUsersExceptSelf = await User.find({_id: {$ne: loggedInUser}}).select("-password");
        
//         return res.status(200).json(allUsersExceptSelf);

//     } catch (error) {
//         console.log("Error getting users" + error);
//         return res.status(500).json({error: "Interval Server Error fetching users"});
//     }
// })

// export default router;