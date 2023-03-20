import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import logo from "../assets/axionLogo.svg";
import { authToken } from "../atoms/authToken";
import { userState } from "../atoms/userAtom";
import { getRequest } from "../configs/axios";
import CustomerProfile from "./CustomerProfile";

function NavbarLayout() {
  const [userAvailable, setUserAvailable] = useState(false);
  const [, setUser] = useRecoilState(userState);
  const [, setToken] = useRecoilState(authToken);
  const user = JSON.parse(localStorage.getItem("user"));

  const jwtCheck = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token) {
      console.log("no token");
      localStorage.clear();
      setToken(null);
      setUser(null);
      return;
    } else {
      await getRequest("check-jwt", token)
        .then(() => {
          setUser(user);
          setToken(token);
          setUserAvailable(true);
        })
        .catch((err) => {
          console.log("errrrr: ", err);
          localStorage.clear();
        });
    }
  };

  useEffect(() => {
    try {
      jwtCheck();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <nav className="flex 2xl:max-w-7xl 2xl:mx-auto 2xl:px-0 items-center justify-between bg-white z-[49] py-3 px-3 md:px-6 lg:px-16 border-b-gray-200 sticky top-0 border-b-[1px]">
      <Link to="/">
        <img src={logo} alt="axion logo" className="w-11/12 md:w-auto" />
      </Link>
      <div className="flex items-center justify-between gap-8 md:gap-10">
        <CustomerProfile user={userAvailable ? user : null} color="purple" />
      </div>
    </nav>
  );
}

export default NavbarLayout;
