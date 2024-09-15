import ptitLogo from "../assets/logo/logo-ptit.png";
import riptLogo from "../assets/logo/logo-ript.png";

const Header = () => {
  return (
    <div className="px-8 py-6 flex items-center gap-6">
      <img src={ptitLogo} alt="PTIT Logo" className="h-16 w-auto" />
      <img src={riptLogo} alt="RIPT Logo" className="h-16 w-auto" />
      <div className="flex flex-col justify-center text-center items-center">
        <h1 className="font-bold text-3xl text-heading font-clash">
          Học viện Công nghệ Bưu chính Viễn thông
        </h1>
        <h1 className="font-bold text-3xl text-heading font-clash tracking-wider">
          Viện Khoa học Kĩ thuật Bưu điện
        </h1>
      </div>
    </div>
  );
};

export default Header;
