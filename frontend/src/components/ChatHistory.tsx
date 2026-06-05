import { useParams } from "react-router-dom"

const ChatHistory = () => {
    const { chatId } = useParams();

  return (
    <div>ChatHistory : {chatId}</div>
  )
}

export default ChatHistory