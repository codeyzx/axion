import { Dialog } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
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

const sidebarItemsOperator = [
  {
    itemName: "Home",
    itemPath: "/operator/home",
    icon: "carbon:home",
  },
  {
    itemName: "Auctions",
    itemPath: "/operator/auctions",
    icon: "carbon:money",
  },
];

const sidebarItemsUser = [
  {
    itemName: "Home",
    itemPath: "/app/home",
    icon: "carbon:home",
  },
  {
    itemName: "Auctions",
    itemPath: "/app/auctions",
    icon: "carbon:money",
  },
  {
    itemName: "Products",
    itemPath: "/app/products",
    icon: "carbon:tag",
  },
  {
    itemName: "Transactions",
    itemPath: "/app/transactions",
    icon: "carbon:shopping-cart",
  },
  {
    itemName: "Settings",
    itemPath: "/app/settings",
    icon: "carbon:settings",
  },
];

function MobileAdminModal({ user }) {
  const [isOpen, setIsOpen] = useRecoilState(navbarAdmin);
  const locationNow = useLocation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50 inline md:hidden"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed top-0 right-0 flex justify-end p-3 ml-auto w-full">
        <Dialog.Panel className="bg-white pt-3 pb-6 px-6 rounded-md w-3/4">
          <Dialog.Title className="flex items-center justify-end text-gray-600">
            <Icon
              icon="heroicons-outline:x"
              width={28}
              onClick={() => setIsOpen(false)}
            />
          </Dialog.Title>
          <div className="w-full my-5 gap-6 flex flex-col">
            {/* Sidebar Item */}
            {user.role.toLowerCase() === "admin"
              ? sidebarItems.map((item, i) => (
                  <div key={i} onClick={() => setIsOpen(false)}>
                    <SidebarItem
                      locationNow={locationNow}
                      itemPath={item.itemPath}
                      itemName={item.itemName}
                      icon={item.icon}
                    />
                  </div>
                ))
              : user.role.toLowerCase() === "operator"
              ? sidebarItemsOperator.map((item, i) => (
                  <div key={i} onClick={() => setIsOpen(false)}>
                    <SidebarItem
                      locationNow={locationNow}
                      itemPath={item.itemPath}
                      itemName={item.itemName}
                      icon={item.icon}
                    />
                  </div>
                ))
              : sidebarItemsUser.map((item, i) => (
                  <div key={i} onClick={() => setIsOpen(false)}>
                    <SidebarItem
                      locationNow={locationNow}
                      itemPath={item.itemPath}
                      itemName={item.itemName}
                      icon={item.icon}
                    />
                  </div>
                ))}
            <button
              onClick={logoutHandler}
              className="sidebarItem bg-red-100 rounded border-[1px] border-red-600 text-red-800 font-semibold"
            >
              <Icon icon="carbon:logout" width="22" />
              <p>Exit</p>
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default MobileAdminModal;
