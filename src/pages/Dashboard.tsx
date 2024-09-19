import { DataTable } from "@/components/ui/data-table";
import { userDataColumns } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserData } from "@/types/UserData";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    const response = await axios.get("");
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="font-bold font-sans text-2xl">Thông tin người dùng</h1>
        <DataTable columns={userDataColumns} data={userData} />
      </div>
    </div>
  );
};

export default Dashboard;
