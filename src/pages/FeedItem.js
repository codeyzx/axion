import { Icon } from "@iconify/react";
import Lottie from "lottie-web";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import lottieJson from "../assets/97110-purple-spinner.json";
import logo from "../assets/axionIcon.svg";
import { authToken } from "../atoms/authToken";
import { cartState } from "../atoms/cartAtom";
import { getRequest } from "../configs/axios";
import rupiahConverter from "../helpers/rupiahConverter";
import NotFound from "./NotFound";

function FeedItem() {
  const [cart, setCart] = useRecoilState(cartState);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const token = useRecoilValue(authToken);
  const [auction, setAuction] = useState(null);
  // const [product, setProduct] = useState(null);
  // const [store, setStore] = useOutletContext();
  // const [quantity, setQuantity] = useState(1);

  // const addCartToast = () => (
  //   <div>
  //     Produk ditambahkan ke{" "}
  //     <div
  //       onClick={() => navigate("/cart")}
  //       className={`${
  //         store.colorTheme + "Nav"
  //       } font-medium hover:font-semibold underline`}
  //     >
  //       Keranjang
  //     </div>
  //   </div>
  // );

  useEffect(() => {
    const instance = Lottie.loadAnimation({
      container: document.querySelector("#lottie-container"),
      animationData: lottieJson,
    });
    return () => instance.destroy();
  }, []);

  // const getProduct = async () => {
  //   const docSnap = await getDoc(doc(firestoreDb, "products", productId));
  //   if (!docSnap.exists()) {
  //     setStatus("not found");
  //     return;
  //   }
  //   setProduct(docSnap.data());
  //   setStatus("finished");
  // };

  const getAuctions = async () => {
    await getRequest("auctions/" + productId, token)
      .then((res) => {
        setAuction(res.data["data"]);
        setStatus("finished");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    try {
      // getProduct();
      getAuctions();
    } catch (err) {
      console.error(err);
    }
  }, []);

  // const addToCartHandler = () => {
  //   const newCart = addToCart(cart, { ...product, id: productId }, quantity);
  //   setCart(newCart);
  //   setQuantity(1);
  //   toast.info(addCartToast);
  // };

  if (status === "loading" || auction === null) {
    return (
      <div className="flex justify-center items-center h-[100vh] flex-col">
        {/* <img src={loading} alt="" /> */}
        <img src={logo} alt="" className="h-14" />
        <div id="lottie-container" className="w-28" />
        {/* <div>loading</div> */}
      </div>
    );
  } else if (status === "not found") {
    return <NotFound />;
  } else
    return (
      <>
        <Helmet>
          <title>
            {/* {auction.name} - {store.storeName} - Axion */}
            Well Store - Axion
          </title>
        </Helmet>
        <div className="poppins">
          <button
            className={`md:hidden flex gap-1 items-center font-medium cursor-pointer mb-3  ${
              // store.colorTheme + "Nav"
              "purpleNav"
            } `}
            // onClick={() => navigate(`/${store.storeName}`)}
          >
            <Icon icon="charm:chevron-left" width={20} />
            Back Ke Toko
          </button>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 my-6 gap-2 md:gap-6">
            {/* <div className={`col-span-1 ${store.colorTheme + "-pg"}`}> */}
            <div className={`col-span-1 purple-pg`}>
              <img
                // src={product.image}

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
                className={`hidden md:flex gap-1 items-center font-medium cursor-pointer mb-3  ${
                  // store.colorTheme + "Nav"
                  "purpleNav"
                } `}
                // onClick={() => navigate(`/${store.storeName}`)}
              >
                <Icon icon="charm:chevron-left" width={20} />
                Back Ke Toko
              </button>
              <h5 className="text-3xl font-semibold">{auction.name}</h5>
              <p className="text-sm">Bidders {auction.bidders_count}</p>
              <h6 className="text-xl font-semibold">
                {rupiahConverter(auction.last_price)}
              </h6>
              <p className="text-gray-600 leading-relaxed text-[15px] line-clamp-6">
                {auction.product.description}
              </p>
              <div className="w-full flex flex-col gap-[10px] mt-4">
                {auction.active && (
                  <div className="flex cursor-default items-center justify-between py-[6px] px-5 border-[1.5px] border-gray-200 rounded-full">
                    <button
                      // className={`p-2 ${
                      //   quantity - 1 > 0
                      //     ? store.colorTheme + "Nav"
                      //     : "text-gray-400"
                      // }`}
                      className={"p-2 text-gray-400"}
                      // disabled={!(quantity - 1 > 0)}
                      // onClick={() => setQuantity((prev) => prev - 1)}
                    >
                      <Icon icon="fa-solid:minus" />
                    </button>
                    <h6 className="flex-grow text-center font-semibold text-lg">
                      {/* {quantity} */}1
                    </h6>
                    <button
                      // className={`p-2 ${store.colorTheme + "Nav"}`}
                      className={`p-2 purpleNav`}
                      // onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      <Icon icon="fa-solid:plus" />
                    </button>
                  </div>
                )}
                <button
                  // className={`p-[10px] rounded-full font-semibold text-lg text-white ${
                  //   store.colorTheme + "-btn"
                  // }
                  className={
                    "p-[10px] rounded-full font-semibold text-lg text-white purple-btn"
                  }
                  // onClick={() => addToCartHandler()}
                  // disabled={!auction.active}
                >
                  {/* {auction.active ? "Add Ke Keranjang" : "Sold Out"} */}
                  Add Ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
}

export default FeedItem;
