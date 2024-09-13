import LunarCalendar from "../components/LunarCalendar";
import Camera from "../components/Camera";
import EventBanner from "../components/EventBanner";
import sampleBanner from "../assets/event_banner/sample_banner.jpg";

const Home = () => {
  return (
    <div className="flex flex-col gap-6 p-8 h-screen">
      {/* banner */}
      <div className="h-auto">
        <EventBanner img={sampleBanner} />
      </div>
      
      {/* calendar and weather */}
      <div className="flex flex-row gap-6">
        <div className="w-3/4">
          <LunarCalendar />
        </div>
        <div className="w-1/4">
          <div className="bg-gray-200 h-full rounded-3xl flex items-center justify-center text-center">
            <p className="text-gray-600 text-xl">Weather Component</p>
          </div>
        </div>
      </div>

      {/* camera */}
      <div className="h-auto">
        <Camera />
      </div>
    </div>
  );
};

export default Home;