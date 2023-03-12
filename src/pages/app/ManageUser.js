import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { authToken } from "../../atoms/authToken";
import { userState } from "../../atoms/userAtom";
import NavbarAdmin from "../../components/NavbarAdmin";
import { options, optionsChart } from "../../components/SalesChart";
import StatistikAngka from "../../components/StatistikAngka";
import TopProduct from "../../components/TopProduct";
import { getRequest } from "../../configs/axios";

function ManageUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const token = useRecoilValue(authToken);

  const [auction, setAuction] = useState(false);
  const [auctions, setAuctions] = useState(false);
  const [labels, setLabels] = useState(false);
  const [statusLabels, setStatusLabels] = useState(false);
  const [bidders, setBidders] = useState(false);
  const [transactions, setTransactions] = useState(false);

  const pieChart = {
    labels: ["Open", "Closed"],
    datasets: [
      {
        data: statusLabels,
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const dataChart = {
    labels,
    datasets: [
      {
        data: bidders,
        label: "New Auction",
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.4)",
      },
    ],
  };

  const getAuction = async () => {
    await getRequest("auctions", token)
      .then((res) => {
        const sortedData = res.data.filter(
          (auction) => auction.user.id === user.id
        );

        const filteredData = sortedData.sort((a, b) => {
          var res = b.bidders_count - a.bidders_count;
          return res;
        });

        setAuctions(filteredData);

        const convertedData = filteredData.map((auction) => {
          return {
            name: auction.name,
            sold: auction.bidders_count,
          };
        });

        const data = convertedData.slice(0, 5);
        setAuction(data);

        const sorted = filteredData.sort((a, b) => {
          return new Date(a.created_at) - new Date(b.created_at);
        });

        const dataTime = sorted.map((auction) => {
          return {
            created_at: auction.created_at,
          };
        });

        let result = [];

        dataTime.forEach((item) => {
          let date = new Date(item.created_at);
          let dateStr = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()}`;

          if (result.length > 0 && result[result.length - 1].date === dateStr) {
            result[result.length - 1].count += 1;
          } else {
            result.push({ date: dateStr, count: 1 });
          }
        });

        const counts = result.map((obj) => obj.count);

        setBidders(counts);

        const labels = result.map((item) => {
          const dateParts = item.date.split("/");
          const day = dateParts[0];
          const month = dateParts[1];
          return `${day} ${getMonthName(month)}`;
        });

        function getMonthName(monthNum) {
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return monthNames[Number(monthNum) - 1];
        }

        setLabels(labels);

        const status = filteredData.map((auction) => auction.status);
        const open = status.filter(
          (item) => item.toLowerCase() === "open"
        ).length;
        const closed = status.filter(
          (item) => item.toLowerCase() === "closed"
        ).length;
        setStatusLabels([open, closed]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTransactions = async () => {
    await getRequest(`auction-histories/user/${user.id}`, token)
      .then((res) => {
        setTransactions(res.data["data"]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!location.pathname.includes("/home")) navigate("/app/home");
    try {
      getAuction();
      getTransactions();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | Merchain</title>
      </Helmet>

      <NavbarAdmin user={user} />

      <div className="layoutContainer">
        <h1 className="pageName">Home</h1>
        {/* Akses Cepat */}
        <div className="bg-white my-3 rounded-md p-4 shadow">
          <div className="flex items-start justify-between">
            {/* Bagian Kiri Atas */}
            <div className="md:flex-row flex flex-col items-start md:items-center gap-3">
              <img
                // src={store.profileImg}
                src="https://picsum.photos/200/300.jpg"
                alt=""
                className="w-16 h-16 rounded-full p-[2px] border-2 border-purple-600 object-cover"
              />
              <div>
                <h5 className="font-semibold text-xl">WELL Store</h5>
                <CopyToClipboard
                  text={`https://merchains.vercel.app/wellstore`}
                  className="cursor-pointer"
                  onCopy={() => toast.success("Copied!")}
                >
                  <span>
                    <p className="opacity-75 flex gap-2 items-center">
                      merchains.vercel.app/wellstore
                      <Icon
                        icon="fluent:copy-24-regular"
                        width="20"
                        className="text-purple-600 hover:scale-110 transition-all duration-75 ease-out cursor-pointer"
                      />
                    </p>
                  </span>
                </CopyToClipboard>
              </div>
            </div>

            {/* Bagian Kanan Atas */}
            <div className="flex items-start gap-4">
              <button
                // onClick={() => navigate(`/${store.storeName}`)}
                className="font-medium items-center text-sm  hover:bg-gray-200 flex gap-2 py-2 px-4 bg-gray-100 rounded-md"
              >
                <Icon icon="clarity:eye-line" width="22" />
                <p className="hidden sm:inline">Kunjungi Toko</p>
              </button>
              {/* <button className="text-sm font-medium hover:bg-gray-200 py-2 px-4 bg-gray-100 rounded-md">Edit Profile</button> */}
              <Link
                to="/app/settings"
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                <Icon icon="carbon:settings" width="22" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bio & Jam */}
        <div className="items-center bg-white p-4 rounded-md shadow">
          <h5 className="md:text-xl text-lg font-semibold">Tentang Toko 📢</h5>
          <p className="mt-2  rounded w-fit text-sm font-medium">
            Jam Buka: 09.00 - 17.00
            {/* Jam Buka:{" "} */}
            {/* {store.storeTime?.length === 2 ? (
              <>
                {store.storeTime[0]} - {store.storeTime[1]}
              </>
            ) : (
              "Belum Ada Data"
            )} */}
          </p>
          <p className="text-sm leading-tight opacity-75 my-1">
            "Belum ada Bio"
            {/* {store.storeBio ? store.storeBio : "Belum Ada Bio"} */}
          </p>
        </div>

        {/* Statistik Angka */}
        <div className="grid grid-cols-2 my-4 gap-5">
          <StatistikAngka
            title="Your Transaction"
            value={
              transactions.length === 0
                ? "No Transaction"
                : transactions.length + " Transaction"
            }
            emoji={"emojiCart"}
          />
          <StatistikAngka
            title="Total Auction"
            value={
              auctions.length === 0
                ? "No Auction"
                : auctions.length + " Auction"
            }
            emoji={"emojiProduk"}
          />
        </div>

        {/* Sales Container */}
        <div className="md:grid flex flex-col md:grid-cols-6 gap-5">
          <div className="bg-white rounded shadow md:col-span-4">
            <h5 className="mx-4 pt-3 font-semibold text-xl">
              Status Auction 📈
            </h5>
            <div className="w-full lg:h-80 md:h-72 sm:h-56  rounded-md px-4 py-3 bg-white">
              <div className="w-full h-full">
                {statusLabels === false ? (
                  <div>Loading...</div>
                ) : statusLabels[0] === 0 && statusLabels[1] === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-xl font-semibold">No Auction</p>
                  </div>
                ) : (
                  <Pie
                    data={pieChart}
                    options={optionsChart}
                    className="text-pur"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Terlaris container */}
          <div className="md:col-span-2 bg-white flex justify-between flex-col rounded shadow p-4">
            <div>
              <h5 className="font-semibold">Top Auction 💰</h5>
              {auctions === false || auction === false ? (
                <div>Loading...</div>
              ) : (
                <div className="flex md:flex-col overflow-scroll scrollProduct gap-5 flex-auto my-4">
                  {auction.map((p, i) => (
                    <TopProduct
                      name={p.name}
                      sold={p.sold}
                      key={i}
                      index={i + 1}
                    />
                  ))}
                </div>
              )}{" "}
            </div>
            <Link
              to={"/app/auctions"}
              className="batalkanBtn border-[1.6px] text-center"
            >
              See All
            </Link>
          </div>
        </div>

        {/* Sales Container */}
        <div className="items-center bg-white p-4 rounded-md shadow my-4">
          <div className="bg-white rounded shadow md:col-span-4">
            <h5 className="mx-4 pt-3 font-semibold text-xl">
              Your Auction Created 📈
            </h5>
            {auctions === false || auction === false ? (
              <div>Loading...</div>
            ) : (
              <div className="w-full lg:h-80 md:h-72 sm:h-56  rounded-md px-4 py-3 bg-white">
                <div className="w-full h-full">
                  <Line
                    options={options}
                    data={dataChart}
                    className="text-pur"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageUser;
