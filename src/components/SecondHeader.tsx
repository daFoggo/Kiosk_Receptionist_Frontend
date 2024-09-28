import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChevronRight, Menu } from "lucide-react";
import logoPtit from "../assets/logo/logo-ptit.png";
import logoRipt from "../assets/logo/logo-ript.png";
import { motion } from "framer-motion";

const MenuItems = () => (
  <>
    <NavigationMenuItem className="flex items-center gap-2 py-2 px-3 rounded-md justify-between hover:bg-accent hover:text-accent-foreground">
      <NavigationMenuLink
        href="/admin/identify-data"
        className="font-semibold rounded-md"
      >
        Dữ liệu nhận diện
      </NavigationMenuLink>
      <ChevronRight className="md:hidden"/>
    </NavigationMenuItem>
    <NavigationMenuItem className="flex items-center gap-2 py-2 px-3 rounded-md justify-between hover:bg-accent hover:text-accent-foreground">
      <NavigationMenuLink
        href="/admin/week-calendar-manage"
        className="font-semibold rounded-md"
      >
        Quản lý lịch tuần
      </NavigationMenuLink>
      <ChevronRight className="md:hidden"/>
    </NavigationMenuItem>
    <NavigationMenuItem className="flex items-center gap-2 py-2 px-3 rounded-md justify-between hover:bg-accent hover:text-accent-foreground">
      <NavigationMenuLink
        href="/admin/event-manage"
        className="font-semibold rounded-md"
      >
        Quản lý sự kiện
      </NavigationMenuLink>
      <ChevronRight className="md:hidden"/>
    </NavigationMenuItem>
  </>
);

export default function SecondHeader() {
  return (
    <header className="w-full">
      <motion.div className="px-6 py-3"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      >
        <NavigationMenu className="w-full">
          <NavigationMenuList className="w-full flex items-center justify-between">
            <NavigationMenuItem className="flex-1">
              <div className="flex items-center gap-3">
                <img src={logoPtit} alt="PTIT Logo" className="h-6 w-auto" />
                <img src={logoRipt} alt="RIPT Logo" className="h-6 w-auto" />
                <div className="hidden md:flex flex-col justify-center text-center ">
                  <h1 className="text-[#c94a46] text-sm font-bold">
                    Học viện Công nghệ Bưu chính Viễn thông
                  </h1>
                  <h2 className="text-sm font-bold tracking-wider">
                    Viện Khoa học Kỹ thuật Bưu điện
                  </h2>
                </div>
              </div>
            </NavigationMenuItem>
            <div className="hidden md:flex">
              <MenuItems />
            </div>
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <h1 className="font-semibold text-xl">Danh mục</h1>
                  <nav className="flex flex-col space-y-4 list-none mt-4">
                    <MenuItems />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </NavigationMenuList>
        </NavigationMenu>
      </motion.div>
    </header>
  );
}