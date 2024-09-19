import { Outlet } from "react-router-dom";
import SecondHeader from "@/components/SecondHeader";

const AdminLayout = () => {
  return (
    <div className="bg-base min-h-screen flex flex-col">
      <header>
        <SecondHeader />
      </header>
      <main className="mb-2 mx-4 bg-white rounded-2xl flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
