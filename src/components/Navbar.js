import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/axionLogo.svg";
import { useSetRecoilState } from "recoil";
import { navbarUser } from "../atoms/navbarUser";
import { getRequest } from "../configs/axios";

function Navbar() {
  const [userAvailable, setUserAvailable] = useState(false);
  const setIsOpen = useSetRecoilState(navbarUser);
  const users = JSON.parse(localStorage.getItem("user"));

  const jwtCheck = async () => {
    const token = localStorage.getItem("token");
    // const user = JSON.parse(localStorage.getItem("user"));

    // if (!token || user.role !== "Admin") {
    if (!token) {
      console.log("no token");
      // localStorage.clear();
      return;
    } else {
      await getRequest("check-jwt", token)
        .then(() => {
          setUserAvailable(true);
        })
        .catch((err) => {
          console.log("errrrr: ", err);
          localStorage.clear();
        });
    }
  };

  useEffect(() => {
    jwtCheck();
  }, []);

  return (
    <nav className="flex items-center justify-between bg-white z-[49] py-5 px-6 lg:px-16 border-b-[1px] border-b-gray-200">
      <Link to="/">
        <img src={logo} alt="axion logo" />
      </Link>

      <div className="items-center justify-between gap-10 hidden md:flex">
        <NavLink
          to="/faq"
          className={({ isActive }) =>
            isActive
              ? "font-semibold text-purple-600"
              : "font-semibold hover:text-purple-600"
          }
        >
          FAQ
        </NavLink>
        {userAvailable ? (
          <Link
            // to="/admin/home"
            to={"/" + users["role"].toLowerCase() + "/home"}
            className="hidden md:flex py-3 hover:bg-purple-700 hover:px-9 cursor-pointer transition-all duration-200 ease-out font-semibold items-center gap-3 text-white tracking-wider px-6 bg-purple-600 rounded-full"
          >
            <Icon icon="ri:pie-chart-2-fill" width={22} />
            <p>Dashboard</p>
          </Link>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <Link to="/login" className="btnSecondary">
              Masuk
            </Link>
            <Link to="/signup" className="btnPrimary">
              Daftar Sekarang
            </Link>
          </div>
        )}
      </div>

      <div className="md:hidden flex items-center gap-5">
        {userAvailable && (
          <Link
            // to="/admin/home"
            to={"/" + users["role"].toLowerCase() + "/home"}
            className="py-2 hover:bg-purple-700 text-[15px] cursor-pointer transition-all duration-200 ease-out font-semibold items-center gap-3 text-white tracking-wider px-5 bg-purple-600 rounded-full"
          >
            <p>Dashboard</p>
          </Link>
        )}
        <button onClick={() => setIsOpen(true)}>
          <Icon icon="charm:menu-hamburger" width="32" className="opacity-80" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
