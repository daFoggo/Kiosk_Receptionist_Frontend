import { DataTable } from "@/components/ui/data-table";
import { userDataColumns } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { UserData } from "@/types/UserData";
import { ipGetData } from "@/utils/ip";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const navigate = useNavigate();

  // check token to redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để tiếp tục");
      navigate("/admin/login"); 
      return;
    }

    getUserData();
  }, [navigate]);

  const getUserData = async () => {
    try {
      const response = await axios.get(ipGetData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      setUserData(response.data[0]);
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
