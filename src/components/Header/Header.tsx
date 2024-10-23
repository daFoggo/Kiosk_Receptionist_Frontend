"use client"
// Assets
import ptitLogo from "@/assets/logo/logo-ptit.png";
import riptLogo from "@/assets/logo/logo-ript.png";

const Header = () => {
  return (
    <div className="px-6 py-3 flex items-center gap-6 font-sans font-bold text-3xl text-indigo-950">
      <img src={ptitLogo} alt="PTIT Logo" className="h-16 w-auto" />
      <img src={riptLogo} alt="RIPT Logo" className="h-16 w-auto" />
      <div className="flex flex-col justify-center text-center items-center">
        <h1 className="text-[#c94a46]">
          Học viện Công nghệ Bưu chính Viễn thông
        </h1>
        <h1 className="tracking-wider text-indigo-950">
          Viện Khoa học Kỹ thuật Bưu điện
        </h1>
      </div>
    </div>
  );
};

export default Header;
