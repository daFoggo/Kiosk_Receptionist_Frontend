import React from 'react';
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
    <NavigationMenuItem className="flex items-center gap-2 py-2 px-3 rounded-md justify-between hover:bg-crust/50 transition-all">
      <NavigationMenuLink
        href="/admin/identify-data"
        className="font-semibold rounded-md"
      >
        Dữ liệu nhận diện
      </NavigationMenuLink>
      <ChevronRight className="md:hidden" />
    </NavigationMenuItem>
    <NavigationMenuItem className="flex items-center gap-2 py-2 px-3 rounded-md justify-between hover:bg-crust/50 transition-all">
      <NavigationMenuLink
        href="/admin/weekly-calendar-manage"
        className="font-semibold rounded-md"
      >
        Quản lý lịch tuần
      </NavigationMenuLink>
      <ChevronRight className="md:hidden" />
    </NavigationMenuItem>
    <NavigationMenuItem className="flex items-center gap-2 py-2 px-3 rounded-md justify-between hover:bg-crust/50 transition-all">
      <NavigationMenuLink
        href="/admin/event-manage"
        className="font-semibold rounded-md"
      >
        Quản lý sự kiện
      </NavigationMenuLink>
      <ChevronRight className="md:hidden" />
    </NavigationMenuItem>
  </>
);

const SecondHeader = () => {
  return (
    <motion.div
      className="px-6 py-3 w-full"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ ease: "easeInOut", duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {/* Left column: Logo and text */}
        <div className="flex items-center gap-3">
          <div className="flex gap-3">
            <img src={logoPtit} alt="PTIT Logo" className="h-6 w-auto" />
            <img src={logoRipt} alt="RIPT Logo" className="h-6 w-auto" />
          </div>
          <div className="hidden md:block">
            <h1 className="text-[#c94a46] text-sm font-bold">
              Học viện Công nghệ Bưu chính Viễn thông
            </h1>
            <h2 className="text-sm font-bold tracking-wider">
              Viện Khoa học Kỹ thuật Bưu điện
            </h2>
          </div>
        </div>

        {/* Middle column: Empty space */}
        <div className="flex-grow"></div>

        {/* Right column: Navigation menu */}
        <NavigationMenu>
          <NavigationMenuList className="hidden md:flex gap-4">
            <MenuItems />
          </NavigationMenuList>
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
        </NavigationMenu>
      </div>
    </motion.div>
  );
};

export default SecondHeader;