
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

export interface OnGoingChatsProps {
    chat_id: String;
    chat_name: String;
    chat_picture: String;
    chat_type: String;
    last_message_text: String;
    last_message_timestamp: String;
    sender_fullname: String;
    participants: publicUserDetailsProps[];
}

export interface ChatsContextStateProps {
    chat_id: String;
    chat_name: String;
    chat_picture: String;
    chat_type: String;
    participants: publicUserDetailsProps;
}   