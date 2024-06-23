import { ArrowLeft, LoaderCircle, SendHorizonal, XIcon } from "lucide-react";
import useFetchContacts from "../../hooks/useFetchContacts";
import { useEffect, useState } from "react";
import { publicUserDetailsProps } from "../../types";
import useCreateNewGroup from "../../hooks/useCreateNewGroup";
import { ToastContainer } from "react-toastify";
import { useAuthContext } from "../../context/AuthContext";
import { notifyError } from "../Toasts";

interface CreateChatDialogProps {
  CloseDialog: () => void;
}

const CreateChatDialog = (props: CreateChatDialogProps) => {
  const { contacts } = useFetchContacts();
  const {authUser} = useAuthContext();

  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchInput, setSearchInput] = useState("");

  const [groupName, setGroupName] = useState("");

  const [selectedContacts, setSelectedContacts] = useState<
    publicUserDetailsProps[]
  >([]);

  const { createNewGroup, isSending } = useCreateNewGroup();

    const handleSelectContact = (user: publicUserDetailsProps) => {
        if (selectedContacts.includes(user)) {
            return null;
        }
        const selectedContactsArray = [...selectedContacts];
        selectedContactsArray.push(user);
        setSelectedContacts(selectedContactsArray);
        setSearchInput("");
    }

    const handleRemoveContact = (user: publicUserDetailsProps) => {
        if (!selectedContacts.includes(user)) {
            return null;
        }
        const selectedContactsArray = [];
        for (let i = 0; i < selectedContacts.length; i++) {
            if (selectedContacts[i].id !== user.id) {
                selectedContactsArray.push(selectedContacts[i]);
            }
        }
        setSelectedContacts(selectedContactsArray);
    }

    const handleSubmit = async () => {
      const participantsArray = [...selectedContacts];
      if (!authUser) {
        notifyError("Unauthorized request");
        return null;
      }
      participantsArray.unshift(authUser);
      await createNewGroup(groupName, participantsArray);
      props.CloseDialog();
    }


  //USE EFFECT THAT HANDLES THE UPDATE OF THE SEARCH INPUT
  useEffect(() => {
    if (searchInput === "") {
      setFilteredContacts(contacts);
    } else {
      const filteredItems = contacts.filter(
        (user) =>
          user.fullname
            .toLocaleLowerCase()
            .includes(searchInput.toLocaleLowerCase()) ||
          user.username
            .toLocaleLowerCase()
            .includes(searchInput.toLocaleLowerCase())
      );
      setFilteredContacts(filteredItems);
    }
  }, [searchInput, contacts]);

  return (
    <div className="create-group-dialog">
      <section className="flex-col">
        {/* HEADER SECTION */}
        <header className="create-dialog-header">
      <ToastContainer/>
          <ArrowLeft
            size={28}
            onClick={props.CloseDialog}
            style={{ paddingLeft: "1rem", paddingTop: "1rem" }}
          />
          <h1 className="w-full">Create a new group</h1>
        </header>

        {/* GROUP NAME INPUT */}
        <label>Group name:</label>
        <input
          disabled = {isSending}
          value={groupName}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
          placeholder="Group name"
          maxLength={70}
        />

        {/* LIST OF SELECTED CONTACTS */}
        <label>Add group members:</label>
        {selectedContacts.length > 0 ? 
        <ul
        className="w-full flex-row"
        style={{ padding: "0rem 2rem", gap: '1rem', flexWrap: 'wrap' }}
      >
        {selectedContacts.map((user) => {
          return (
            <li key={user.id}>
              <article
                className="flex-row"
                style={{ alignItems: "center", gap: "0.25rem"}}
              >
                <img
                  className="small-profile-picture-bubble"
                  src={
                    user.profile_picture ||
                    "https://www.shutterstock.com/image-vector/gray-avatar-icon-design-photo-600nw-1274338147.jpg"
                  }
                  alt="User's Picture"
                />
                  <p className="username-label">{"@" + user.username}</p>
                  <button disabled = {isSending} className ="icon-button" onClick={() => {handleRemoveContact(user)}}>
                    <XIcon size={12}/>
                  </button>
              </article>
            </li>
          );
        })}
      </ul>
        : <></>}

        {/* CREATE GROUP BUTTON */}
        {groupName.length > 0 && selectedContacts.length > 0 ? 
        <div className="flex-row w-full submit-container">
            <button 
            className="flex-row"
            style={{gap: '0.5rem'}}
              disabled = {isSending}
              onClick={handleSubmit}
            >
              <p>Create group</p>
              {isSending ? <LoaderCircle size={18} className="spin"/>: <SendHorizonal size={18}/>}
            </button> 
        </div>
        
        : <></>}
        

        {/* FILTER CONTACT LIST INPUT */}
        <input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          placeholder="Search for your contact's name"
        />

        {/* CONTACT LIST */}
        <ul
          className="chats-list w-full h-full"
          style={{ padding: "0rem 2rem" }}
        >
          {filteredContacts.length === 0 ? (
            <p className="w-full no-results">
              No search results for: {searchInput}
            </p>
          ) : (
            <></>
          )}
          {filteredContacts.map((user) => {
            if (selectedContacts.includes(user) || isSending) {
                return null;
            }
            return (
              <li key={user.id} onClick={() => {handleSelectContact(user)}}>
                <article
                  className="flex-row"
                  style={{ alignItems: "center", gap: "0.5rem" }}
                >
                  <img
                    className="profile-picture-bubble "
                    src={
                      user.profile_picture ||
                      "https://www.shutterstock.com/image-vector/gray-avatar-icon-design-photo-600nw-1274338147.jpg"
                    }
                    alt="User's Picture"
                  />
                  <section className="flex-col" style={{ gap: "0.5rem" }}>
                    <p className="user-name">{user.fullname}</p>
                    <p className="message-preview">{"@" + user.username}</p>
                  </section>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default CreateChatDialog;
