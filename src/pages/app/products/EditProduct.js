import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
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

function EditProduct() {
  let { id } = useParams();

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const imgRef = useRef("");
  const [selectedImage, setSelectedImage] = useState();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [firstLoading, setFirstLoading] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const token = useRecoilValue(authToken);

  const getProduct = async () => {
    await getRequest("products/" + id, token)
      .then((res) => {
        console.log(res);
        setProduct(res.data["data"]);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          console.error("Product doesnt exist");
          navigate("/admin/products");
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
      getProduct();
      setFirstLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFirstLoading(false);
    }
  }, []);

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const submitHandler = async (data) => {
    setLoading(true);
    const idToast = toast.loading("Menyimpan Product...");
    try {
      var image = "";
      if (selectedImage) {
        image = selectedImage;
      }
      // const formData = new FormData();
      // formData.append("name", data.name);
      // formData.append("description", data.description);
      // formData.append("price", data.price);
      // formData.append("image", image);

      const json = {
        name: data.name,
        description: data.description,
        price: data.price,
        image: image,
      };

      await putRequest("products/" + id, json, token);

      toast.update(idToast, {
        render: "Product Berhasil Disimpan!",
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
      await deleteRequest("products/" + id, token);
      toast.success("Data Berhasil Dihapus");
      navigate("/admin/products");
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
        <title>Edit Product | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <button
          onClick={() => navigate("/admin/products")}
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Kembali
        </button>

        <div className="contentContainer">
          {!firstLoading && product ? (
            <>
              <div className="flex flex-row justify-between">
                <h1 className="pageName mb-6">Edit Product</h1>
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
                          <p className="font-medium">Delete Product</p>
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
                  <label htmlFor="produk" className="font-medium">
                    Name Product
                  </label>
                  <input
                    type="text"
                    id="produk"
                    className="addInput"
                    placeholder="Sunflower Bouquet"
                    {...register("name")}
                    defaultValue={product?.name}
                  />
                </div>
                <div>
                  <label htmlFor="description" className="font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="addInput"
                    placeholder="Description"
                    cols="30"
                    {...register("description")}
                    defaultValue={product?.description}
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
                    defaultValue={product?.price}
                  />
                  <p className="text-xs font-medium text-purple-500">
                    perhatian jangan menggunakan titik (.)
                  </p>
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
                          src={"http://127.0.0.1:8080/" + product?.image}
                          alt="img placeholder"
                          className="w-32"
                        />
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
                  <div className="my-1 justify-end flex gap-3 md:">
                    <button
                      type="button"
                      disabled={loading || !isChange}
                      onClick={() => navigate("/admin/products")}
                      className={`batalkanBtn ${
                        (loading || !isChange) && "opacity-75 hover:bg-white"
                      } `}
                    >
                      Batalkan
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !isChange}
                      className={`simpanBtn ${
                        (loading || !isChange) &&
                        "opacity-75 hover:bg-purple-600"
                      }`}
                    >
                      Simpan Product
                    </button>
                  </div>
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

export default EditProduct;
