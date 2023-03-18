import Lottie from "lottie-web";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import lottieJson from "../assets/97110-purple-spinner.json";
import logo from "../assets/axionIcon.svg";
import NotFound from "./NotFound";

function FeedLayout() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    try {
      setStatus("finished");
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const instance = Lottie.loadAnimation({
      container: document.querySelector("#lottie-container"),
      animationData: lottieJson,
    });
    return () => instance.destroy();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-[100vh] flex-col">
        <img src={logo} alt="" className="h-14" />
        <div id="lottie-container" className="w-28" />
      </div>
    );
  } else if (status === "not found") {
    return <NotFound />;
  } else if (status === "not verified") {
    return <NotFound />;
  } else if (status === "finished") {
    return (
      <>
        <div>
          <Outlet />
        </div>
      </>
    );
  }
}

export default FeedLayout;
