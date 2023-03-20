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
    itemPath: "/app/home",
    icon: "carbon:home",
  },
  {
    itemName: "Orders",
    itemPath: "/app/orders",
    icon: "carbon:shopping-cart",
  },
  {
    itemName: "Products",
    itemPath: "/app/products",
    icon: "carbon:tag",
  },
  {
    itemName: "Customers",
    itemPath: "/app/customers",
    icon: "bi:people",
  },
  {
    itemName: "Settings",
    itemPath: "/app/settings",
    icon: "carbon:settings",
  },
];

function MobileAdminModal() {
  const [isOpen, setIsOpen] = useRecoilState(navbarAdmin);
  const locationNow = useLocation();
  const nav = useNavigate();
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
            {sidebarItems.map((item, i) => (
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
              onClick={() => nav(`/nyoba`)}
              className="sidebarItem bg-purple-100 rounded border-[1px] border-purple-600 text-purple-800 font-semibold"
            >
              <Icon icon="akar-icons:eye" width={22} />
              <p>Kunjungi Toko</p>
            </button>
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
