import { Icon } from "@iconify/react";
import Lottie from "lottie-web";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import lottieJson from "../assets/97110-purple-spinner.json";
import logo from "../assets/axionIcon.svg";
import sadFace from "../assets/sadFace.svg";
import CustomerProfile from "../components/CustomerProfile";
import ShopItem from "../components/ShopItem";
import { getRequest } from "../configs/axios";
import rupiahConverter from "../helpers/rupiahConverter";
import NotFound from "./NotFound";

function FeedFront() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [userAvailable, setUserAvailable] = useState(false);
  const [auctions, setAuctions] = useState(null);
  const [filterInput, setFilterInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleFilterChange = (e) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  const getAuctions = async () => {
    await getRequest("auctions")
      .then((res) => {
        setAuctions(res.data);
        setStatus("finished");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const jwtCheck = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token");
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
    try {
      jwtCheck();
      getAuctions();
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
  } else {
    return (
      <>
        <Helmet>
          <title>Axion</title>
        </Helmet>

        <nav className="flex 2xl:max-w-7xl 2xl:mx-auto 2xl:px-0 items-center justify-between bg-white z-[49] py-3 px-3 md:px-6 lg:px-16 border-b-gray-200 sticky top-0 border-b-[1px]">
          <Link to="/">
            <img src={logo} alt="axion logo" className="w-11/12 md:w-auto" />
          </Link>
          <div className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out rounded p-2 rounded-xl flex w-8/12 my-2">
            <Icon icon="clarity:search-line" width={17} className="mr-3" />
            <input
              type="text"
              placeholder="Search Auction"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-between gap-8 md:gap-10">
            <CustomerProfile
              user={userAvailable ? user : null}
              color="purple"
            />
          </div>
        </nav>

        <div className="poppins">
          <div className="flex-grow flex items-center mt-7 flex-col">
            <div className="relative mb-2 justify-end flex items-center justify-between gap-4">
              <p className="font-semibold">Sort:</p>
              <select
                className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onClick={(value) => {
                  switch (value.target.value) {
                    case "2":
                      auctions.sort((a, b) => b.last_price - a.last_price);
                      setAuctions([...auctions]);
                      break;
                    case "3":
                      auctions.sort((a, b) => b.id - a.id);
                      setAuctions(null);
                      setAuctions([...auctions]);
                      break;
                    default:
                      break;
                  }
                }}
              >
                <option value={1}>Best Fit</option>
                <option value={2}>Highest Price</option>
                <option value={3}>Newest</option>
              </select>
            </div>
            <div className="-translate-y-100 max-w-7xl 2xl:mx-auto 2xl:grid-cols-4 mt-50 md:mt-10 mx-2 lg:mx-20 xl:mx-36 px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-x-8 md:gap-y-6">
              {/* Shop Item */}
              {auctions ? (
                <>
                  {auctions
                    .filter(
                      (auction) =>
                        auction.name
                          .toLowerCase()
                          .includes(filterInput.toLowerCase()) &&
                        auction.status.toLowerCase() === "open"
                    )
                    .map((auction) => (
                      <ShopItem
                        key={auction.id}
                        slug={auction.id.toString()}
                        name={auction.name}
                        date={auction.end_at}
                        price={rupiahConverter(auction.last_price.toString())}
                        img={
                          auction.product.image
                            ? "http://127.0.0.1:8080/" + auction.product.image
                            : "https://via.placeholder.com/350x150"
                        }
                        desc={auction.product.name}
                        active={true}
                        color="purple"
                      />
                    ))}
                </>
              ) : (
                <div className="flex flex-col items-center text-center gap-2 col-span-3 2xl:col-span-4 justify-center">
                  <img src={sadFace} alt="no data img" className="w-24" />
                  <div>
                    <h6 className="font-medium">Belum Ada Produk</h6>
                    <p className="text-sm text-gray-600">
                      Pemilik toko belum menambahkan produk, mohon kembali
                      nanti.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center flex items-center justify-center text-sm mt-35">
              <p>
                Powered by <br />{" "}
                <span
                  className="text-2xl font-semibold cursor-pointer text-purple-600"
                  onClick={() => navigate("/")}
                >
                  Axion
                </span>
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default FeedFront;
