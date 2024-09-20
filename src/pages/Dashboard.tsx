import { DataTable } from "@/components/ui/data-table";
import { userDataColumns } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserData } from "@/types/UserData";
import { ipGetData } from "@/utils/ip";
import { toast } from "sonner";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const response = await axios.get(ipGetData);
      setUserData(response.data);
      toast.success("Lấy dữ liệu thành công");
    } catch (error) {
      toast.error("Lấy dữ liệu thất bại");
      console.error("Error getting user data:", error);
    }
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
