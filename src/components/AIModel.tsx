import sampleModel from "../assets/ai_model/sample_model.mp4";

const AIModel = () => {
  return (
    <div className="bg-card_bg rounded-2xl relative overflow-hidden aspect-[9/16] h-[80%] w-full font-sans shadow-md">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover bg-center"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={sampleModel} type="video/mp4" />
        Trình duyệt không hỗ trợ autoplay.
      </video>

    </div>
  );
};

export default AIModel;
