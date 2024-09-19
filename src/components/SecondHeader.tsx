import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import logoPtit from "../assets/logo/logo-ptit.png";
import logoRipt from "../assets/logo/logo-ript.png";

const SecondHeader = () => {
  return (
    <div className="w-full">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="text-sm">
            <div className="px-6 py-3 flex items-center gap-6 font-sans font-bold text-heading">
              <img src={logoPtit} alt="PTIT Logo" className="h-6 w-auto" />
              <img src={logoRipt} alt="RIPT Logo" className="h-6 w-auto" />
              <div className="flex flex-col justify-center text-center items-center">
                <h1 className="text-[#c94a46]">
                  Học viện Công nghệ Bưu chính Viễn thông
                </h1>
                <h1 className="tracking-wider">
                  Viện Khoa học Kỹ thuật Bưu điện
                </h1>
              </div>
            </div>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default SecondHeader;
