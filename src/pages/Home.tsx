import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner from "../components/EventBanner";
import sampleBanner from "../assets/event_banner/sample_banner.jpg";

const Home = () => {
  return (
    <div className="flex flex-col gap-4 p-2">
      <EventBanner img={sampleBanner} />
      <div className="flex flex-row gap-2">
        <div className="w-[70%]">
          <LunarCalendar />
        </div>
        <div className="w-[30%]">
          <div className="bg-gray-200 h-full rounded-lg flex items-center justify-center text-center">
            <p className="text-gray-600 text-sm">Weather Component</p>
          </div>
        </div>
      </div>
      <Camera />
    </div>
  );
};

export default Home;