import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import imgPlaceholder from "../../../assets/imgPlaceholder.svg";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { postRequest } from "../../../configs/axios";

function NewProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const imgRef = useRef("");
  const [selectedImage, setSelectedImage] = useState();
  const [loading, setLoading] = useState(false);
  const token = useRecoilValue(authToken);

  const path = () => {
    var entity = "";
    if (user.role.toLowerCase() === "users") {
      entity = "app";
    } else {
      entity = user.role.toLowerCase();
    }
    return "/" + entity + "/products";
  };

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const submitHandler = async (data) => {
    setLoading(true);
    const idToast = toast.loading("Menambahkan Products...");
    try {
      var image = "";
      if (selectedImage) {
        image = selectedImage;
      }

      const json = {
        name: data.name,
        description: data.description,
        price: data.price,
        image: image,
      };

      await postRequest("products", json, token);

      toast.update(idToast, {
        render: "Products Successfully Added!",
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
        <title>Create Product | Axion</title>
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
          <h1 className="pageName mb-6">New Product</h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div>
              <label htmlFor="name" className="font-medium">
                Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="addInput"
                placeholder="Sunflower Bouquet"
                {...register("name", { required: true })}
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
                {...register("description", { required: false })}
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
                Save Products
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewProduct;
