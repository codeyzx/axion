import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { deleteRequest, getRequest, putRequest } from "../../../configs/axios";
import { authToken } from "../../../atoms/authToken";
import { Menu } from "@headlessui/react";

function EditAuction() {
  let { id } = useParams();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);
  const [auction, setAuction] = useState(null);
  // const [userName, setUserName] = useState("");
  const [firstLoading, setFirstLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const token = useRecoilValue(authToken);

  // const [productName, setProductName] = useState("");

  const getAuction = async () => {
    await getRequest("auctions/" + id, token)
      .then((res) => {
        console.log(res);
        setAuction(res.data["data"]);
        // setUserName(res.data["data"]["user"]["name"]);
        // setProductName(res.data["data"]["product"]["name"]);
        // return res.data["data"]["auction"]["product_id"];
        // getProduct(res.data["data"]["auction"]["product_id"]);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          console.error("Auction doesnt exist");
          navigate("/" + user.role.toLowerCase() + "/auctions");
          return;
        }
      });
  };

  // const getProduct = async (id) => {
  //   await getRequest("products/" + id, token)
  //     .then((res) => {
  //       console.log(res);
  //       setProductName(res.data["data"]["name"]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       if (err.response.status === 404) {
  //         console.error("Product doesnt exist");
  //         navigate("/"+user.role.toLowerCase()+"/auctions");
  //         return;
  //       }
  //     });
  // };

  const changeHandler = () => {
    if (isChange === true) return;
    setIsChange(true);
  };

  useEffect(() => {
    setFirstLoading(true);
    try {
      getAuction();
      setFirstLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFirstLoading(false);
    }
  }, []);

  const submitHandler = async (data) => {
    setLoading(true);
    const idToast = toast.loading("Menyimpan Auction...");
    try {
      const json = {
        endAt: data.endAt,
        lastPrice: data.lastPrice,
        name: data.name,
        status: data.status,
        userId: data.userId,
      };

      await putRequest("auctions/" + id, json, token);

      toast.update(idToast, {
        render: "Auction Berhasil Disimpan!",
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
      await deleteRequest("auctions/" + id, token);
      toast.success("Data Berhasil Dihapus");
      navigate("/" + user.role.toLowerCase() + "/auctions");
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
        <title>Edit Auction | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <button
          onClick={() => navigate("/" + user.role.toLowerCase() + "/auctions")}
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </button>

        <div className="contentContainer">
          {!firstLoading && auction ? (
            <>
              <div className="flex flex-row justify-between">
                <h1 className="pageName mb-6">Edit Auction</h1>
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
                  <label htmlFor="name" className="font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="addInput"
                    placeholder="Sunflower Bouquet"
                    {...register("name")}
                    defaultValue={auction?.name}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="font-medium">
                    Status
                  </label>
                  <select
                    id="status"
                    className="addInput"
                    {...register("status")}
                    defaultValue={auction?.status}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="lastPrice" className="font-medium">
                    Last Price (Rupiah)
                  </label>
                  <input
                    type="number"
                    id="lastPrice"
                    className="addInput"
                    placeholder="Price"
                    min={0}
                    {...register("lastPrice")}
                    defaultValue={auction?.last_price}
                  />
                  <p className="text-xs font-medium text-purple-500">
                    perhatian jangan menggunakan titik (.)
                  </p>
                </div>
                <div>
                  <label htmlFor="bidders_count" className="font-medium">
                    Bidders
                  </label>
                  <input
                    type="number"
                    id="bidders_count"
                    className="addInput"
                    placeholder="Price"
                    min={0}
                    {...register("bidders_count")}
                    defaultValue={auction?.bidders_count}
                  />
                </div>

                <div>
                  <label htmlFor="endAt" className="font-medium">
                    End At
                  </label>
                  <input
                    type="datetime-local"
                    id="endAt"
                    className="addInput"
                    placeholder="End At"
                    {...register("endAt")}
                    defaultValue={auction?.end_at}
                  />
                </div>

                <div className="my-1 justify-end flex gap-3 md:">
                  <button
                    type="button"
                    disabled={loading || !isChange}
                    onClick={() =>
                      navigate("/" + user.role.toLowerCase() + "/auctions")
                    }
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

export default EditAuction;
