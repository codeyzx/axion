import { Icon } from "@iconify/react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>Axion - Make your Auction easy and fast</title>
      </Helmet>
      <Navbar />
      <div className="flex-grow flex items-center mt-20 flex-col mb-20">
        <div className="flex items-center flex-col">
          <h1 className="lg:text-6xl md:text-5xl text-4xl font-bold text-center max-w-4xl leading-[1.15]">
            <span className="text-purple-600">Create your own auction </span>
            <br />
            easy and fast.
          </h1>
          <p className="mt-3 lg:text-lg text-center">
            Easily increase sales, analyze performance, and more.{" "}
          </p>
          <div className="flex items-center border-2 border-purple-600 rounded-full pr-3 pl-5 py-2 mt-7 md:mt-14">
            <p className="lg:text-xl font-medium">axions.com/</p>
            <form className="flex">
              <input
                type="text"
                className="lg:text-xl outline-none lg:w-36 w-24"
                placeholder="yourauction"
                name="name"
              />
              <button
                type="submit"
                onClick={() => navigate("/signup")}
                className="lg:text-lg font-medium hover:bg-purple-700 py-3 px-6 bg-purple-600 text-white rounded-full"
              >
                Create Now
              </button>
            </form>
          </div>
          <p className="mt-4 ">
            <span className="opacity-80">
              What are you waiting for, Start now - Free{" "}
            </span>
            🤩🤩🤩!
          </p>
        </div>

        <div className="mt-28 text-center w-full px-16">
          <h2 className="font-semibold text-2xl lg:text-4xl">
            One app for your auction needs{" "}
          </h2>
          <p className="mt-3 lg:text-lg">
            Manage orders, analyze sales, record customer data, everything is
            easy.{" "}
          </p>
          <div className="grid lg:grid-cols-3 items-center justify-between gap-x-3 w-full mt-10">
            <div className="col-span-1 bg-white text-left p-4 rounded-md shadow-md">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Icon icon="ic:outline-query-stats" width="24" />
                Analyze Your Store{" "}
              </div>
              <p className="opacity-80 leading-snug text-left mt-2">
                Know your sales easily, and you can also know how often your
                store is visited.
              </p>
            </div>

            <div className="col-span-1 bg-white text-left p-4  rounded-md shadow-md">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Icon icon="icon-park:ad-product" width="24" />
                Organize Products and Orders{" "}
              </div>
              <p className="opacity-80 leading-snug text-left mt-2">
                Easily organize your products and keep track of incoming orders.{" "}
                <br></br>‎
              </p>
            </div>

            <div className="col-span-1 bg-white text-left p-4 rounded-md shadow-md">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Icon icon="fluent:paint-brush-16-regular" width="24" />
                Customize Your Store{" "}
              </div>
              <p className="opacity-80 leading-snug text-left mt-2">
                Axion provides various customization features for your store, so
                you can feel more comfortable and free to customize it as you
                wish.
              </p>
            </div>
          </div>
          <Link
            to="/signup"
            className="mt-12 p-5 inline-block bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium text-lg lg:text-xl"
          >
            Try It Now !!
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
