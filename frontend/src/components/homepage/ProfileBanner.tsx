import { MessageSquarePlus, UsersRound } from "lucide-react";
import useFetchUserDetails from "../../hooks/useFetchUserDetails"
import HoverBox from "../extras/HoverBox";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import { useState } from "react";
import CreateChatDialog from "./CreateChatDialog";

interface ProfileBannerProps {
    handleTabChange: () => void;
}

const ProfileBanner = (props: ProfileBannerProps) => {

    const navigate = useNavigate();

    const {authUser} = useAuthContext();

    const [ createGroupDialog, setCreateGroupDialog ] = useState(false);

    const handleCloseDialog = () => {
        setCreateGroupDialog(false);
    }

    if (!authUser){
        navigate("/login");
        return null;
    }
    const  { userDetails } = useFetchUserDetails(authUser.id);
    
    return (
    <section className="profile-banner w-full flex-row">
        <img className="profile-picture-bubble " src={userDetails?.profile_picture || "https://www.shutterstock.com/image-vector/gray-avatar-icon-design-photo-600nw-1274338147.jpg"} alt="User's Picture" />
        <div className="flex-row">
            <button className ="icon-button" onClick={props.handleTabChange}> 
                <MessageSquarePlus />
                <HoverBox prompt={"Contacts"} />
             </button>
            {/* TODO: Open dialog to create new group */}
            <button className ="icon-button" onClick={() => {setCreateGroupDialog(true)}}>
                <UsersRound />
                <HoverBox prompt={"Create group"} />
            </button>
            <LogoutButton />
        </div>
        {/* CREATE NEW GROUP DIALOG */}
        {createGroupDialog ?
            <CreateChatDialog CloseDialog={handleCloseDialog}/>
        :
        <></>
        }
    </section> 
    )
}

export default ProfileBanner