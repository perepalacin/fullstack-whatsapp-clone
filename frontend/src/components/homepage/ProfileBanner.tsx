import { MessageSquarePlus, UsersRound } from "lucide-react";
import useFetchUserDetails from "../../hooks/useFetchUserDetails"
import HoverBox from "../extras/HoverBox";

const ProfileBanner = () => {

    const  {userDetails, isLoading} = useFetchUserDetails();
    return (
    <section className="profile-banner w-full flex-row">
        <img className="profile-picture-bubble " src={userDetails?.profile_picture || "https://xsgames.co/randomusers/assets/avatars/male/36.jpg"} alt="User's Picture" />
        <div className="flex-row">
            <button className ="icon-button" onClick={() => {}}> 
                <MessageSquarePlus />
                <HoverBox prompt={"Contacts"} />
             </button>
            {/* TODO: Open dialog to create new group */}
            <button className ="icon-button" onClick={() => {}}>
                <UsersRound />
                <HoverBox prompt={"Create group"} />
            </button>

        </div>
    </section> 
    )
}

export default ProfileBanner