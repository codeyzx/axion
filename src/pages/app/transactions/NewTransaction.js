import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { getRequest, postRequest } from "../../../configs/axios";

function NewTransaction() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const token = useRecoilValue(authToken);
  const [firstLoading, setFirstLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [auction, setAuction] = useState(null);
  const [users, setUsers] = useState(null);

  const getAuctions = async () => {
    await getRequest("auctions", token)
      .then((res) => {
        console.log("auctions:", res.data);
        setAuction(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getUsers = async () => {
    await getRequest("users", token)
      .then((res) => {
        console.log("users:", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setFirstLoading(true);
    try {
      getAuctions();
      getUsers();
      setFirstLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFirstLoading(false);
    }
  }, []);

  const submitHandler = async (data) => {
    setLoading(true);
    const idToast = toast.loading("Menambahkan Transactions...");
    try {
      var json = {
        auctionId: data.auctionId,
        userId: data.usersId,
        price: data.price,
      };

      console.log("data ", json);
      await postRequest("auction-histories", json, token);

      toast.update(idToast, {
        render: "Transactions Successfully Added!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/admin/transactions");
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

  return (
    <>
      <Helmet>
        <title>Create Transaction | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <Link
          to="/admin/transactions"
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </Link>

        <div className="contentContainer">
          {!firstLoading && auction && users ? (
            <>
              <h1 className="pageName mb-6">New Transaction</h1>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(submitHandler)}
              >
                <div>
                  <label htmlFor="auction" className="font-medium">
                    Auction
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="auction"
                    className="addInput"
                    {...register("auctionId", { required: true })}
                    defaultValue={auction[0].id}
                  >
                    {auction.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="users" className="font-medium">
                    Users
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="users"
                    className="addInput"
                    {...register("usersId")}
                    defaultValue={users[0].id}
                  >
                    {users.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="font-medium">
                    Price (Rupiah)<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="addInput"
                    placeholder="Price"
                    min={0}
                    {...register("price", { required: true })}
                  />
                  {errors.price ? (
                    <span className="text-[13px] ml-1 text-red-500">
                      price must be filled
                    </span>
                  ) : (
                    <p className="text-xs font-medium text-purple-500">
                      don't use dots (.)
                    </p>
                  )}
                </div>
                <div className="my-1 justify-end flex gap-3 md:">
                  <button
                    disabled={loading}
                    onClick={() => navigate("/admin/transactions")}
                    className={`batalkanBtn ${
                      loading && "opacity-75 hover:bg-white"
                    } `}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`simpanBtn ${
                      loading && "opacity-75 hover:bg-purple-600"
                    }`}
                  >
                    Save Transactions
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div>Harap Tunggu...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default NewTransaction;
