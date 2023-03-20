import { Icon } from "@iconify/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import logo from "../assets/axionLogo.svg";
import { navbarAdmin } from "../atoms/navbarAdmin";
import SidebarItem from "./SidebarItem";

const sidebarItems = [
  {
    itemName: "Home",
    itemPath: "/admin/home",
    icon: "carbon:home",
  },
  {
    itemName: "Auctions",
    itemPath: "/admin/auctions",
    icon: "carbon:money",
  },
  {
    itemName: "Transactions",
    itemPath: "/admin/transactions",
    icon: "carbon:shopping-cart",
  },
  {
    itemName: "Products",
    itemPath: "/admin/products",
    icon: "carbon:tag",
  },
  {
    itemName: "History",
    itemPath: "/admin/history",
    icon: "carbon:watch",
  },
  {
    itemName: "Users",
    itemPath: "/admin/users",
    icon: "bi:people",
  },
];

function Sidebar() {
  const locationNow = useLocation();
  const setIsOpen = useSetRecoilState(navbarAdmin);

  return (
    <>
      {/* Sidebar For Dekstop */}
      <nav className="pl-6 pr-2 py-7 justify-center h-screen border-r-[1px] w-full sidebarSticky border-r-gray-300 hidden md:flex">
        <div className="flex flex-col items-start w-full">
          {/* Profile */}
          <div className="flex items-center gap-2 w-full rounded">
            <p className="font-medium text-left lg:text-[15px]">
              {/* {store.storeName} */}
              Admin
            </p>
          </div>

          {/* Sidebar Items Container */}
          <div className="w-full my-5 gap-3 flex flex-col">
            {/* Sidebar Item */}
            {sidebarItems.map((item, i) => (
              <SidebarItem
                key={i}
                locationNow={locationNow}
                itemPath={item.itemPath}
                itemName={item.itemName}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Navbar For Mobile */}
      <nav className="flex md:hidden z-50 bg-white p-5 border-b-[1px] border-gray-300 items-center justify-between shadow fixed top-0 w-screen overflow-hidden">
        <Link to="/admin/home">
          <img src={logo} alt="" />
        </Link>
        <div className="flex items-center gap-8">
          {/* <Notification /> */}
          <Icon
            icon="charm:menu-hamburger"
            width="32"
            className="opacity-80"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
