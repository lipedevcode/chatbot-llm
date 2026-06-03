import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams();

  console.log(chatId);
  if (!chatId) {
    return (
      <div>
        <h1>Como posso ajudar ? </h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Id do chat: {chatId}</h1>
    </div>
  );
};

export default ChatPage;
