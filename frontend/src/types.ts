
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