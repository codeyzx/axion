import Lottie from "lottie-web";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import Sidebar from "../../components/Sidebar";
import lottieJson from "../../assets/97110-purple-spinner.json";
import logo from "../../assets/axionIcon.svg";
import MobileAdminModal from "../../components/MobileAdminModal";
import { authToken } from "../../atoms/authToken";
import { getRequest } from "../../configs/axios";

function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useRecoilState(authToken);
  const [loading, setLoading] = useState(true);

  const jwtCheck = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user.role !== "Admin") {
      navigate("/login");
      return;
    } else {
      getRequest("check-jwt", token)
        .then(() => {
          setUser(user);
          setToken(token);
        })
        .catch((err) => {
          console.log(err);
          localStorage.clear();
          navigate("/login");
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      jwtCheck();
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const instance = Lottie.loadAnimation({
      container: document.querySelector("#lottie-container"),
      animationData: lottieJson,
    });
    return () => instance.destroy();
  }, []);

  if (loading || user === "" || token === "") {
    return (
      <div className="flex justify-center items-center h-[100vh] flex-col">
        <img src={logo} alt="" className="h-14" />
        <div id="lottie-container" className="w-28" />
      </div>
    );
  } else {
    return (
      <>
        <MobileAdminModal />
        <div className="flex flex-col  md:grid md:grid-cols-11 bg-[#F4F4F5]">
          <nav className="md:col-span-2 bg-white">
            <Sidebar />
          </nav>
          <main className="md:col-span-9 mt-24 md:mt-0">
            <Outlet />
          </main>
        </div>
      </>
    );
  }
}

export default AdminLayout;
