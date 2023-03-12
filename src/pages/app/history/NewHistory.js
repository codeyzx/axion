import { Icon } from "@iconify/react";
import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { postRequest } from "../../../configs/axios";

function NewHistory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const [store, setStore] = useOutletContext();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const imgRef = useRef("");
  const [selectedImage, setSelectedImage] = useState();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const token = useRecoilValue(authToken);
  // const token = localStorage.getItem("token");

  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const submitHandler = async (data) => {
    setLoading(true);
    const id = toast.loading("Added History...");
    try {
      // const docRef = await addDoc(collection(firestoreDb, "products"), {
      //   storeId: store.id,
      //   active: enabled,
      //   name: data.nama,
      //   desc: data.deskripsi,
      //   price: data.harga,
      //   sold: 0,
      //   createdAt: serverTimestamp(),
      // })
      // const imgUrl = await setFirestoreStorage(selectedImage, docRef.id, "product-images")
      // await updateDoc(doc(firestoreDb, "products", docRef.id), {
      //   image: imgUrl
      // })
      postRequest("history", data, token).catch((err) => console.error(err));
      toast.update(id, {
        render: "History Berhasil Ditambahkan!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/admin/history");
    } catch (err) {
      toast.update(id, {
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
        <title>Create History | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <Link
          to="/admin/history"
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </Link>

        <div className="contentContainer">
          <h1 className="pageName mb-6">New History</h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div>
              <label htmlFor="log" className="font-medium">
                Log<span className="text-red-600">*</span>
              </label>
              <textarea
                // type="text"
                id="log"
                className="addInput"
                placeholder="Product with id 1234 has been updated"
                cols="30"
                {...register("log", { required: true })}
              />
              {errors.log && (
                <span className="text-[13px] ml-1 text-red-500">
                  log harus diisi
                </span>
              )}
            </div>
            <div>
              <div className="my-1 justify-end flex gap-3 md:">
                <button
                  disabled={loading}
                  onClick={() => navigate("/admin/history")}
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
                  Save History
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewHistory;
