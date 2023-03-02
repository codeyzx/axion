import React from "react";
import { Helmet } from "react-helmet-async";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { cartCount, cartState, cartTotal } from "../atoms/cartAtom";
import { storeColor } from "../atoms/storeColor";
import CartItem from "../components/CartItem";
import NavbarStore from "../components/NavbarStore";
import { deleteFromCart } from "../helpers/helperCart";
import rupiahConverter from "../helpers/rupiahConverter";
import noCart from "../assets/noCart.svg";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { checkoutModal } from "../atoms/checkoutModalAtom";
import { Icon } from "@iconify/react";

function Cart() {
  const [cart, setCart] = useRecoilState(cartState);
  const setIsOpen = useSetRecoilState(checkoutModal);
  const color = useRecoilValue(storeColor);
  const total = useRecoilValue(cartTotal);
  const count = useRecoilValue(cartCount);
  const navigate = useNavigate();

  const deleteHandler = (id) => {
    const newCart = deleteFromCart(cart, id);
    setCart(newCart);
  };

  const checkoutHandler = () => {
    const user = auth.currentUser;
    if (!user) {
      setIsOpen(true);
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <Helmet>
        <title>Keranjang Belanja - Axion</title>
      </Helmet>
      <NavbarStore />
      <div className="max-w-5xl px-4 mx-auto  my-8 poppins">
        {cart.length > 0 && (
          <button
            className={`flex items-center font-medium cursor-pointer mb-4  ${
              color + "Nav"
            } `}
            onClick={() => navigate(-1)}
          >
            <Icon icon="charm:chevron-left" width={20} />
            Back Ke Toko
          </button>
        )}
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-6 my-2">
            <div className="col-span-3">
              <h5 className="text-xl font-semibold">Belanjaan</h5>
              <div className="border-[1.2px] border-gray-200 mt-[10px] px-3 py-4 rounded-md flex flex-col gap-4">
                {cart.map((c) => (
                  <CartItem
                    image={c.product.image}
                    name={c.product.name}
                    price={c.product.price}
                    quantity={c.quantity}
                    id={c.id}
                    key={c.id}
                    deleteHandler={deleteHandler}
                    color={color}
                  />
                ))}
              </div>
            </div>

            <div className=" col-span-2">
              <h5 className="text-xl font-semibold">Pembayaran</h5>
              <div className="border-[1.2px] mt-[10px] flex flex-col gap-2 border-gray-200 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 font-medium">Total</p>
                  <p className={`font-semibold ${color + "-txt"} `}>
                    {rupiahConverter(total)}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 font-medium">
                    Jumlah Item Dibeli
                  </p>
                  <p className={`font-semibold ${color + "-txt"} `}>{count}</p>
                </div>
                <button
                  className={`font-semibold mt-3 rounded text-white p-3 ${
                    color + "-btn"
                  } `}
                  onClick={checkoutHandler}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-5 flex flex-col items-center text-center">
            <img src={noCart} className="w-[360px]" alt="noCartImg" />
            <h5 className="font-semibold text-2xl">
              Keranjang Kamu Masih Kosong
            </h5>
            <p className="text-gray-600 mt-1">
              Silahkan kembali setelah memilih produk
            </p>
            <button
              className="font-medium text-lg py-2 px-16 hover:bg-purple-700 rounded mt-4 bg-purple-600 text-white"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
