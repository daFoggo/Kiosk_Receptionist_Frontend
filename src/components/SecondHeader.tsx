import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import logoPtit from "../assets/logo/logo-ptit.png";
import logoRipt from "../assets/logo/logo-ript.png";

export default function SecondHeader() {
  return (
    <header className="w-full">
      <div className="px-6 py-3">
        <NavigationMenu>
          <NavigationMenuList className="w-full flex items-center gap-4">
            <NavigationMenuItem className="flex-1">
              <div className="flex items-center gap-3">
                <img src={logoPtit} alt="PTIT Logo" className="h-6 w-auto" />
                <img src={logoRipt} alt="RIPT Logo" className="h-6 w-auto" />
                <div className="flex flex-col justify-center text-center">
                  <h1 className="text-[#c94a46] text-sm font-bold">
                    Học viện Công nghệ Bưu chính Viễn thông
                  </h1>
                  <h2 className="text-sm font-bold tracking-wider">
                    Viện Khoa học Kỹ thuật Bưu điện
                  </h2>
                </div>
              </div>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/admin/dashboard"
                className="inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-white py-2 px-4"
              >
                Quản lý thông tin
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/admin/upload"
                className="inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none hover:bg-white py-2 px-4"
              >
                Cập nhật lịch tuần
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
