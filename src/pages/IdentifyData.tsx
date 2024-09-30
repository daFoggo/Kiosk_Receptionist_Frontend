import { DataTable } from "@/components/ui/data-table";
import { identifyDataColumns } from "@/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import type { IdentifyData } from "@/types/IdentifyData";
import { ipIdentifyData } from "@/utils/ip";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const IdentifyData = () => {
  const [identifyData, setIdentifyData] = useState<IdentifyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    setIsLoading(true);
    try {
      const response = await axios.get(ipIdentifyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });
      setIdentifyData(response.data[0]);
      toast.success("Lấy dữ liệu thành công");
    } catch (error) {
      toast.error("Lấy dữ liệu thất bại");
      console.error("Error getting user data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h1 className="font-bold font-sans text-2xl">Thông tin nhận diện</h1>
        <DataTable columns={identifyDataColumns} data={identifyData} />
      </div>
    </div>
  );
};

export default IdentifyData;