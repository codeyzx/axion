import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import imgPlaceholder from "../../../assets/imgPlaceholder.svg";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { getRequest, postRequest } from "../../../configs/axios";

function NewAuction() {
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
  const [users, setUsers] = useState(null);
  const [selectedImage, setSelectedImage] = useState();

  const path = () => {
    var entity = "";
    if (user.role.toLowerCase() === "users") {
      entity = "app";
    } else {
      entity = user.role.toLowerCase();
    }
    return "/" + entity + "/auctions";
  };

  const imgRef = useRef("");

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const getUsers = async () => {
    await getRequest("users", token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setFirstLoading(true);
    try {
      if (user.role.toLowerCase() !== "users") {
        getUsers();
      }
      setFirstLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFirstLoading(false);
    }
  }, []);

  const submitHandler = async (data) => {
    setLoading(true);
    const idToast = toast.loading("Menambahkan Auctions...");
    try {
      var image = "";
      if (selectedImage) {
        image = selectedImage;
      }

      var userId = "";
      var lastPrice = 0;
      var bidCount = 0;
      if (user.role.toLowerCase() === "users") {
        userId = user.id;
      } else {
        userId = data.userId;
        lastPrice = data.lastPrice;
        bidCount = data.biddersCount;
      }

      const json = {
        biddersCount: bidCount,
        description: data.product_desc,
        endAt: data.endAt,
        image: image,
        lastPrice: lastPrice,
        name: data.name,
        price: data.product_price,
        productName: data.product_name,
        status: data.status,
        userId: userId,
        bidderId: null,
      };

      await postRequest("auctions", json, token);

      toast.update(idToast, {
        render: "Auctions Successfully Added!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate(path());
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
        <title>Create Auction | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <Link
          to={path()}
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </Link>

        <div className="contentContainer">
          {user.role.toLowerCase() === "users" ? (
            <>
              {!firstLoading ? (
                <>
                  <h1 className="pageName mb-6">New Auction</h1>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <div>
                      <label htmlFor="name" className="font-medium">
                        Title
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="addInput"
                        placeholder="Sunflower Bouquet"
                        {...register("name", { required: true })}
                      />
                    </div>
                    <label htmlFor="userId" className="font-medium">
                      Product
                    </label>
                    <div className="product-child">
                      <div>
                        <label htmlFor="name" className="font-medium">
                          Name<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="addInput"
                          placeholder="Sunflower Bouquet"
                          {...register("product_name", { required: true })}
                        />
                        {errors.name && (
                          <span className="text-[13px] ml-1 text-red-500">
                            name harus diisi
                          </span>
                        )}
                      </div>
                      <div>
                        <label htmlFor="description" className="font-medium">
                          Description
                        </label>
                        <textarea
                          // type="text"
                          id="description"
                          className="addInput"
                          placeholder="Description"
                          cols="30"
                          {...register("product_desc", { required: false })}
                        />
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
                          {...register("product_price", { required: true })}
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
                      <div>
                        <label htmlFor="image" className="font-medium">
                          Image
                        </label>
                        <div
                          className="border-gray-300 border-[1px] w-fit hover:border-purple-600 p-4 items-center my-2 rounded flex flex-col gap-4 cursor-pointer"
                          onClick={() => imgRef.current.click()}
                        >
                          {selectedImage ? (
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              className="w-56 h-56 object-cover"
                              alt="Thumb"
                            />
                          ) : (
                            <>
                              <img
                                src={imgPlaceholder}
                                alt="img placeholder"
                                className="w-32"
                              />
                              <h5 className="text-sm font-medium">Add Image</h5>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="opacity-0"
                          ref={imgRef}
                          onChange={imageChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="status" className="font-medium">
                        Status
                      </label>
                      <select
                        id="status"
                        className="addInput"
                        {...register("status")}
                        defaultValue="Open"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="endAt" className="font-medium">
                        End At
                      </label>
                      <span className="text-red-600">*</span>
                      <input
                        type="datetime-local"
                        id="endAt"
                        className="addInput"
                        placeholder="End At"
                        {...register("endAt", { required: true })}
                      />
                    </div>

                    {/* <div>
                      <label htmlFor="userId" className="font-medium">
                        Users
                        <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="userId"
                        className="addInput"
                        {...register("userId")}
                        defaultValue={users[0].id}
                      >
                        {users.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                     */}

                    <div className="my-1 justify-end flex gap-3 md:">
                      <button
                        disabled={loading}
                        onClick={() => navigate(path())}
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
                        Save Auctions
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div>Harap Tunggu...</div>
              )}
            </>
          ) : (
            <>
              {!firstLoading && users ? (
                <>
                  <h1 className="pageName mb-6">New Auction</h1>
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(submitHandler)}
                  >
                    <div>
                      <label htmlFor="name" className="font-medium">
                        Title
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="addInput"
                        placeholder="Sunflower Bouquet"
                        {...register("name", { required: true })}
                      />
                    </div>
                    <label htmlFor="userId" className="font-medium">
                      Product
                    </label>
                    <div className="product-child">
                      <div>
                        <label htmlFor="name" className="font-medium">
                          Name<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="addInput"
                          placeholder="Sunflower Bouquet"
                          {...register("product_name", { required: true })}
                        />
                        {errors.name && (
                          <span className="text-[13px] ml-1 text-red-500">
                            name harus diisi
                          </span>
                        )}
                      </div>
                      <div>
                        <label htmlFor="description" className="font-medium">
                          Description
                        </label>
                        <textarea
                          // type="text"
                          id="description"
                          className="addInput"
                          placeholder="Description"
                          cols="30"
                          {...register("product_desc", { required: false })}
                        />
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
                          {...register("product_price", { required: true })}
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
                      <div>
                        <label htmlFor="image" className="font-medium">
                          Image
                        </label>
                        <div
                          className="border-gray-300 border-[1px] w-fit hover:border-purple-600 p-4 items-center my-2 rounded flex flex-col gap-4 cursor-pointer"
                          onClick={() => imgRef.current.click()}
                        >
                          {selectedImage ? (
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              className="w-56 h-56 object-cover"
                              alt="Thumb"
                            />
                          ) : (
                            <>
                              <img
                                src={imgPlaceholder}
                                alt="img placeholder"
                                className="w-32"
                              />
                              <h5 className="text-sm font-medium">Add Image</h5>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="opacity-0"
                          ref={imgRef}
                          onChange={imageChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="status" className="font-medium">
                        Status
                      </label>
                      <select
                        id="status"
                        className="addInput"
                        {...register("status")}
                        defaultValue="Open"
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="price" className="font-medium">
                        Last Price (Rupiah)
                      </label>
                      <input
                        type="number"
                        id="price"
                        className="addInput"
                        placeholder="25000"
                        min={0}
                        {...register("lastPrice")}
                      />
                    </div>
                    <div>
                      <label htmlFor="biddersCount" className="font-medium">
                        Bidders
                      </label>
                      <input
                        type="number"
                        id="biddersCount"
                        className="addInput"
                        placeholder="12"
                        min={0}
                        {...register("biddersCount")}
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
                      />
                    </div>
                    <div>
                      <label htmlFor="userId" className="font-medium">
                        Users
                        <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="userId"
                        className="addInput"
                        {...register("userId")}
                        defaultValue={users[0].id}
                      >
                        {users.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="my-1 justify-end flex gap-3 md:">
                      <button
                        disabled={loading}
                        onClick={() => navigate(path())}
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
                        Save Auctions
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div>Harap Tunggu...</div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default NewAuction;
