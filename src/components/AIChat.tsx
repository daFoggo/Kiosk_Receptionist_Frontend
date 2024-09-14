const AIChat = ({ message }: { message: string }) => {
  return (
    <div className="bg-theme-lavender w-full px-4 py-8 rounded-3xl shadow-md">
      <p className="font-semibold text-xl text-white text-justify text-wrap">{message}</p>
    </div>
  );
};

export default AIChat;
