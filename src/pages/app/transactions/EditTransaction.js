import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { deleteRequest, getRequest, putRequest } from "../../../configs/axios";

function EditTransaction() {
  let { id } = useParams();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [userName, setUserName] = useState("");
  const [firstLoading, setFirstLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const token = useRecoilValue(authToken);

  const getTransaction = async () => {
    await getRequest("auction-histories/" + id, token)
      .then((res) => {
        setTransaction(res.data["data"]);
        setUserName(res.data["data"]["user"]["name"]);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          console.error("Transaction doesnt exist");
          navigate("/admin/transactions");
          return;
        }
      });
  };

  const changeHandler = () => {
    if (isChange === true) return;
    setIsChange(true);
  };

  useEffect(() => {
    setFirstLoading(true);
    try {
      getTransaction();
      setFirstLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFirstLoading(false);
    }
  }, []);

  const submitHandler = async (data) => {
    setLoading(true);
    const idToast = toast.loading("Menyimpan Transaction...");
    try {
      const json = {
        price: data.price,
      };

      await putRequest("auction-histories/" + id, json, token);

      toast.update(idToast, {
        render: "Transaction Berhasil Disimpan!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (err) {
      toast.update(idToast, {
        render: "Terjadi Kesalahan",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err);
    } finally {
      setIsChange(false);
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await deleteRequest("auction-histories/" + id, token);
      toast.success("Data Berhasil Dihapus");
      navigate("/admin/transactions");
    } catch (err) {
      console.error(err);
      toast.error("Terjadi Kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Edit Transaction | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <button
          onClick={() => navigate("/admin/transactions")}
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </button>

        <div className="contentContainer">
          {!firstLoading && transaction ? (
            <>
              <div className="flex flex-row justify-between">
                <h1 className="pageName mb-6">Edit Transaction</h1>
                <Menu className="relative" as="div">
                  <Menu.Button className="flex hover:scale-105 transition-all ease-out duration-100 p-[2px] items-center gap-2 cursor-pointer w-full">
                    <Icon
                      icon="material-symbols:more-vert"
                      width="30"
                      height="30"
                    />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 flex flex-col py-2 rounded bg-white gap-[2px] mt-1 w-40 shadowProfile text-sm font-medium z-10">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={` px-3 py-[6px] flex gap-2  ${
                            active && "bg-gray-100 text-red-500"
                          }`}
                          onClick={deleteHandler}
                        >
                          <Icon icon="mdi:trash-can-outline" width="18" />
                          <p className="font-medium">Delete</p>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(submitHandler)}
                onChange={changeHandler}
              >
                <div>
                  <label htmlFor="Auction" className="font-medium">
                    Auction
                  </label>
                  <input
                    type="text"
                    id="Auction"
                    className="addInput"
                    placeholder="Sunflower Bouquet"
                    {...register("name")}
                    disabled={true}
                    defaultValue={transaction?.["auction"]["name"]}
                  />
                </div>
                <div>
                  <label htmlFor="username" className="font-medium">
                    User
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="addInput"
                    placeholder="Ahmad Joni"
                    {...register("name")}
                    disabled={true}
                    defaultValue={userName}
                  />
                </div>
                <div>
                  <label htmlFor="price" className="font-medium">
                    Price (Rupiah)
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="addInput"
                    placeholder="Price"
                    min={0}
                    {...register("price")}
                    defaultValue={transaction?.price}
                  />
                  <p className="text-xs font-medium text-purple-500">
                    don't use dots (.)
                  </p>
                </div>
                <div className="my-1 justify-end flex gap-3 md:">
                  <button
                    type="button"
                    disabled={loading || !isChange}
                    onClick={() => navigate("/admin/transactions")}
                    className={`batalkanBtn ${
                      (loading || !isChange) && "opacity-75 hover:bg-white"
                    } `}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isChange}
                    className={`simpanBtn ${
                      (loading || !isChange) && "opacity-75 hover:bg-purple-600"
                    }`}
                  >
                    Save Product
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

export default EditTransaction;
