interface UserMessageProps {
  text: string;
}

const UserMessage = ({ text }: UserMessageProps) => {
  return (
    <div className="flex justify-end">
      <p className="max-w-[70%] px-4 py-3 rounded-2xl rounded-br-sm bg-primary text-foreground text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
};

export default UserMessage;
