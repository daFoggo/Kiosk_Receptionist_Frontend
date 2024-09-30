import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Toaster } from "@/components/ui/sonner"
const RootLayout = () => {
  return (
    <div className="no-scrollbar">
      <header>
        <Header />
      </header>
      <main className="no-scrollbar">
        <Outlet />
        <Toaster toastOptions={{
          style: {
            fontSize: "1.5rem",
            backgroundColor: "white",
            color: "#7287fd",
            borderColor: "#7287fd",
          },
        }} position="top-center"/>
      </main>
    </div>
  );
};

export default RootLayout;
