import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import Lottie from "lottie-web";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import lottieJson from "../assets/97110-purple-spinner.json";
import logo from "../assets/axionIcon.svg";
import { authToken } from "../atoms/authToken";
import { userState } from "../atoms/userAtom";
import EmptyTable from "../components/EmptyTable";
import NavbarLayout from "../components/NavbarLayout";
import Table from "../components/Table";
import { getRequest, postRequest } from "../configs/axios";
import rupiahConverter from "../helpers/rupiahConverter";
import NotFound from "./NotFound";

function FeedItem() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [auction, setAuction] = useState(false);
  const [users, setUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useRecoilValue(authToken);
  const user = useRecoilValue(userState);
  const bidRef = useRef(0);

  const getAuctions = async () => {
    await getRequest("auctions/" + productId)
      .then((res) => {
        const data = res.data["data"];
        const transaction = data["auction_history"];
        const users = [];
        for (const key in transaction) {
          const user = transaction[key]["user"];
          user.price = transaction[key]["price"];
          users.push(user);
        }
        users.sort((a, b) => b.price - a.price);
        setAuction(data);
        setUsers(users);
        setStatus("finished");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const bidHandler = async () => {
    setLoading(true);
    const idToast = toast.loading("Add Bidds...");
    try {
      var currentPrice = 0;
      var lastPrice = 0;

      if (user) {
        await getRequest("auctions/" + productId)
          .then((res) => {
            lastPrice = res.data["data"]["last_price"];
          })
          .catch((err) => {
            console.log(err);
          });

        if (bidRef.current.value !== "" && bidRef.current.value !== 0) {
          currentPrice = bidRef.current.value;
        }

        if (currentPrice > lastPrice) {
          const json = {
            auctionId: productId,
            price: currentPrice,
            userId: user.id,
          };

          console.log("data ", json);
          await postRequest("auction-histories", json, token);

          toast.update(idToast, {
            render: "Success Bid!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(idToast, {
            render: "Bid's too low!",
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } else {
        toast.update(idToast, {
          render: "Please login to continue bid",
          type: "error",
          isLoading: false,
          autoClose: 3000,
          onClick: () => navigate("/login"),
        });
      }
    } catch (err) {
      toast.update(idToast, {
        render: "Terjadi Kesalahan",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dataMemo = useMemo(() => users, [users]);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ cell: { value } }) => (
          <p className="truncate max-w-[80px] md:max-w-none">{value}</p>
        ),
      },
      {
        Header: "Bids",
        accessor: "price",
        Cell: ({ cell: { value } }) => (
          <p className={`text-[13px]`}>{rupiahConverter(value)}</p>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const instance = Lottie.loadAnimation({
      container: document.querySelector("#lottie-container"),
      animationData: lottieJson,
    });
    return () => instance.destroy();
  }, []);

  useEffect(() => {
    try {
      getAuctions();
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (status === "loading" || auction === null) {
    return (
      <div className="flex justify-center items-center h-[100vh] flex-col">
        <img src={logo} alt="" className="h-14" />
        <div id="lottie-container" className="w-28" />
      </div>
    );
  } else if (status === "not found") {
    return <NotFound />;
  } else
    return (
      <>
        <Helmet>
          <title>Axion</title>
        </Helmet>
        <NavbarLayout />

        <div className="poppins">
          <button
            className={`md:hidden flex gap-1 items-center font-medium cursor-pointer mb-3  ${"purpleNav"} `}
            onClick={() => navigate("/feed")}
          >
            <Icon icon="charm:chevron-left" width={20} />
            Back
          </button>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 my-6 gap-2 md:gap-6">
            <div className={`col-span-1 purple-pg`}>
              <img
                src={
                  auction.product.image
                    ? "http://127.0.0.1:8080/" + auction.product.image
                    : "https://via.placeholder.com/350x150"
                }
                className="w-[400px] mx-auto h-[460px] object-cover"
                alt=""
              />
            </div>
            <div className="col-span-1 p-5 flex flex-col gap-2">
              <button
                className={`hidden md:flex gap-1 items-center font-medium cursor-pointer mb-3  ${"purpleNav"} `}
                onClick={() => navigate("/feed")}
              >
                <Icon icon="charm:chevron-left" width={20} />
                Back
              </button>
              <h5 className="text-3xl font-semibold">{auction.name}</h5>
              <div className="flex flex-row justify-between my-1">
                <p className="text-sm">Bidders Total {auction.bidders_count}</p>
                <p className="text-sm">
                  End at: {dayjs(auction.end_at).format("DD MMMM YYYY hh:mm")}
                </p>
              </div>
              <h6 className="text-xl font-semibold">
                {" "}
                {rupiahConverter(auction.last_price)} (start:{" "}
                {rupiahConverter(auction.product.price)})
              </h6>
              <p className="text-gray-600 leading-relaxed text-[15px] line-clamp-6">
                {auction.product.description}
              </p>
              <div className="w-full flex flex-col gap-[10px] mt-4">
                <div className="flex cursor-default items-center justify-between py-[6px] px-5 border-[1.5px] border-gray-200 rounded-full">
                  <button
                    onClick={() => {
                      if (bidRef.current.value === "") {
                        bidRef.current.value = 0;
                      }
                      if (bidRef.current.value - 10000 >= 0) {
                        bidRef.current.value = bidRef.current.value - 10000;
                      }
                    }}
                    className={"p-2 text-gray-400"}
                  >
                    <Icon icon="fa-solid:minus" />
                  </button>
                  <input
                    type="text"
                    className="text-center font-semibold text-lg"
                    placeholder="0"
                    ref={bidRef}
                    required
                  />

                  <button
                    className={`p-2 purpleNav`}
                    onClick={() => {
                      if (bidRef.current.value === "") {
                        bidRef.current.value = 0;
                      }
                      bidRef.current.value =
                        parseInt(bidRef.current.value) + 10000;
                    }}
                  >
                    <Icon icon="fa-solid:plus" />
                  </button>
                </div>

                <button
                  className={`p-[10px] rounded-full font-semibold text-xl text-white ${
                    dayjs(auction.end_at).isAfter(dayjs()) &&
                    auction.status.toLowerCase() === "open"
                      ? "purple"
                      : "gray"
                  }-btn`}
                  onClick={() => bidHandler()}
                  disabled={
                    loading ||
                    dayjs(auction.end_at).isBefore(dayjs()) ||
                    auction.status.toLowerCase() !== "open"
                      ? true
                      : false
                  }
                >
                  Bid
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-1 my-10 gap-2 text-center contentContainer">
            <h2 className="font-bold text-xl">Bidders History</h2>

            {/* Kalo Loading */}
            {users === false && <div>Loading...</div>}

            {/* Table */}
            {!users === false && (
              <>
                {dataMemo?.length > 0 ? (
                  <Table
                    isNavigate={true}
                    columns={columns}
                    data={dataMemo}
                    filterColumn="name"
                  />
                ) : (
                  <EmptyTable columns={columns} />
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
}

export default FeedItem;
