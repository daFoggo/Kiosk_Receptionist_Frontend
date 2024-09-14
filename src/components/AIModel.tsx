const AIModel = () => {
  return (
    <div className="bg-card_bg rounded-2xl relative overflow-hidden aspect-[9/16] h-full font-sans shadow-md">
      {/* Overlay gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#6359e7]/70 to-transparent z-10"></div>
      
      {/* AI Name */}
      <div className="absolute top-0 left-0 right-0 h-24 flex items-center justify-center  z-20">
        <p className="text-white text-3xl font-bold">RIPT AI</p>
      </div>
      
      {/* Main content */}
      <div className="flex items-center justify-center h-full">
        <p className="text-second text-3xl">AI model component</p>
      </div>
    </div>
  );
};

export default AIModel;