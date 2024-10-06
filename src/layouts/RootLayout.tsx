import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Toaster } from "@/components/ui/sonner"
import lavenderBlurry from "../assets/background_layer/lavender_blurry.png";

const RootLayout = () => {
  return (
    <div 
      className="min-h-screen bg-gradient-to-b no-scrollbar relative"
    >
      {/* Lavender Blurry Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75"
        style={{ backgroundImage: `url(${lavenderBlurry})` }}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        <header>
          <Header />
        </header>
        <main className="no-scrollbar">
          <Outlet />
          <Toaster 
            toastOptions={{
              style: {
                fontSize: "1.5rem",
                backgroundColor: "white",
                color: "#7287fd",
                borderColor: "#7287fd",
              },
            }} 
            position="top-center"
          />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;