import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import logo from "../assets/axionLogo.svg";
import { cartCount } from "../atoms/cartAtom";
import { storeColor } from "../atoms/storeColor";
// import { userState } from "../../../atoms/userAtom";
import { getRequest } from "../configs/axios";
import CustomerProfile from "./CustomerProfile";

function NavbarLayout() {
  const count = useRecoilValue(cartCount);
  const navigate = useNavigate();
  const color = useRecoilValue(storeColor);
  const [userAvailable, setUserAvailable] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

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

  // const [user, setUser] = useRecoilState(userCustomer);

  // useEffect(() => {
  // onAuthStateChanged(auth, (user) => {
  //   let userNow = null;
  //   if (user) {
  //     userNow = {
  //       uid: user.uid,
  //       email: user.email,
  //       nomor: user.phoneNumber ? user.phoneNumber : "",
  //       image: user.photoURL ? user.photoURL : null,
  //     };
  //   }
  //   setUser(userNow);
  // });
  // }, []);

  return (
    <nav className="flex 2xl:max-w-7xl 2xl:mx-auto 2xl:px-0 items-center justify-between bg-white z-[49] py-3 px-3 md:px-6 lg:px-16 border-b-gray-200 sticky top-0 border-b-[1px]">
      <Link to="/">
        <img src={logo} alt="axion logo" className="w-11/12 md:w-auto" />
      </Link>
      <div className="flex items-center justify-between gap-8 md:gap-10">
        <div
          className="relative cursor-pointer"
          // onClick={() => navigate("/cart")}
        >
          <div
            className={` ${
              color ? color + "-btn" : "purple-btn"
            } w-5 h-5 rounded-full absolute -right-[10px] -top-2 text-xs p-2 text-white flex items-center justify-center`}
          >
            {count}
          </div>
          <Icon icon="clarity:shopping-bag-line" width={28} />
        </div>

        <CustomerProfile user={!userAvailable ? user : null} color={color} />
      </div>
    </nav>
  );
}

export default NavbarLayout;
