import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Lottie from "lottie-web";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../../atoms/userAtom";
import Sidebar from "../../components/Sidebar";
import { auth, firestoreDb } from "../../firebase";
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
      console.log("no token");
      localStorage.clear();
      navigate("/login");
      return;
    } else {
      getRequest("check-jwt", token)
        .then(() => {
          setUser(user);
          setToken(token);
        })
        .catch((err) => {
          console.log("errrrr: ", err);
          localStorage.clear();
          navigate("/login");
        });
    }
  };

  useEffect(() => {
    setLoading(true);
    try {
      jwtCheck();
      // check if user is logged in using jwt token
      // console.log(user);
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   localStorage.clear();
      //   navigate("/login");
      //   return;
      // } else {

      //   setUser(JSON.parse(localStorage.getItem("user")));
      //   setToken(token);
      // }

      //

      // onAuthStateChanged(auth, (user) => {
      //   if (!user) {
      //     navigate("/login");
      //     return;
      //   }

      //   fetchAndSetStore(user.uid);

      //   setUser({
      //     uid: user.uid,
      //     displayName: user.displayName,
      //     profileImg: user.photoURL,
      //     verified: user.emailVerified,
      //     email: user.email,
      //   });
      // });
      // setLoading(false)
    } catch (err) {
      console.error(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, []);
  // useEffect(() => {
  //   setLoading(true);
  //   try {
  //     onAuthStateChanged(auth, (user) => {
  //       if (!user) {
  //         navigate("/login");
  //         return;
  //       }

  //       fetchAndSetStore(user.uid);

  //       setUser({
  //         uid: user.uid,
  //         displayName: user.displayName,
  //         profileImg: user.photoURL,
  //         verified: user.emailVerified,
  //         email: user.email,
  //       });
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     navigate('/login')
  //   } finally{
  //     setLoading(false)
  //   }
  // }, []);

  useEffect(() => {
    // console.count("loaded")
    const instance = Lottie.loadAnimation({
      container: document.querySelector("#lottie-container"),
      animationData: lottieJson,
    });
    return () => instance.destroy();
  }, []);

  if (loading || user === "") {
    return (
      <div className="flex justify-center items-center h-[100vh] flex-col">
        {/* <img src={loading} alt="" /> */}
        <img src={logo} alt="" className="h-14" />
        <div id="lottie-container" className="w-28" />
        {/* <div>loading</div> */}
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
