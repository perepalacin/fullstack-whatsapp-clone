import useFetchChats from '../../../hooks/useFetchChats';

const ConversationsBar = () => {
	const { isLoading, chats } = useFetchChats();
  return (
    <div>
        {chats.map((item: {chat_id: string}) => {
            return (
                <p>{item.chat_id}</p>
            )
        })}
    </div>
)
}

export default ConversationsBar