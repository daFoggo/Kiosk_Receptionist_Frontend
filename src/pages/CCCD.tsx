import { FaAddressCard } from "react-icons/fa";
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react";
import { ipWebsocket } from "@/utils/ip";

const CCCD = () => {
  return (
    <div className="p-6 font-sans w-full gap-6">
      <div className="bg-base rounded-3xl p-4 gap-5">
        <h1 className="text-3xl font-bold text-heading  flex items-center gap-2">
          <FaAddressCard className="inline-block text-4xl text-primary" />
          Hướng dẫn cách scan Căn cước công dân ( CCCD )
        </h1>
        <div className="font-semibold text-2xl text-primary">
          <p>
            - Quý khách vui lòng đưa CCCD vào trong khe của máy đọc CCCD ở bên
            cạnh{" "}
          </p>
          <p>
            - Sau khi có tiếng thông báo đã quét từ máy đọc, các thông tin sẽ
            được hiện ra, quý khách sẽ kiểm tra và xác nhận thông tin.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Input disabled>{}</Input>
      </div>
    </div>
  );
};

export default CCCD;
