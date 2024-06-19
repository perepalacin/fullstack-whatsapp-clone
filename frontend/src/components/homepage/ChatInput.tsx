import { FormEvent, useState } from "react";
import { SendHorizonal, Smile } from "lucide-react";
import useSendMsg from "../../hooks/useSendMsg";

const ChatInput = () => {

    const [message, setMessage] = useState("");
    const {sendMSg, isSending} = useSendMsg();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!message) {
            return null;
        }
        await sendMSg(message);
        setMessage("");
    }

return (
    <form className='message-bar w-full flex-row' onSubmit={handleSubmit}>
        <div>
            <p>Project made by <a href="https://github.com/perepalacin" target="_blank">Pere Palacín</a></p>
        </div>
    <Smile size={30} />
      <input maxLength={250} value={message} onChange={(event) => {setMessage(event.target.value)}} placeholder='Type a message' className='w-full' style={{padding: "0.75rem 0.75rem"}}/>
      {message.length !== 0 ? 
      <button className="icon-button" type="submit" disabled = {isSending || message.length === 0} style={{backgroundColor: 'rgba(0,0,0,0)'}}>
          <SendHorizonal size={30} />
      </button>
      :
        <SendHorizonal size={30} style={{color: '#8696A0'}} />
    }
  </form>
);

}

export default ChatInput;