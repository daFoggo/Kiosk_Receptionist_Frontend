import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner from "../components/EventBanner";
import sampleBanner from "../assets/event_banner/sample_banner.jpg";
import Weather from "../components/Weather";
import AIModel from "../components/AIModel";
import AIChat from "../components/AIChat";
import SelectOption from "../components/SelectOption";

const Home = () => {
  return (
    <div className="flex flex-col gap-8 p-8 h-screen">
      {/* banner */}
      {/* <div className="h-auto">
        <EventBanner img={sampleBanner} />
      </div> */}

      {/* calendar and weather */}
      <div className="flex flex-row gap-8">
        <div className="w-3/4">
          <LunarCalendar />
        </div>
        <div>
          <Weather />
        </div>
      </div>

      {/* main section */}
      <div className="flex flex-row gap-8 h-1/2 mt-8">
        {/* AI model */}
        <div className="w-1/2 flex flex-col items-center aspect-video gap-6">
          <AIModel />
          <AIChat message="Chào mừng quý khách đến với Viện khoa Học kĩ thuật Bưu điện "></AIChat>
        </div>

        {/* camera */}
        <div className="w-1/2 flex flex-col items-center gap-6">
          <Camera />
          <SelectOption />
        </div>
      </div>
    </div>
  );
};

export default Home;
