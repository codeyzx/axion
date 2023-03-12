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

function NewUser() {
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
    const id = toast.loading("Added User...");
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
      await postRequest("register", data, token);
      toast.update(id, {
        render: "User Berhasil Ditambahkan!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/admin/users");
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
        <title>Create User | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <Link
          to="/admin/users"
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </Link>

        <div className="contentContainer">
          <h1 className="pageName mb-6">New User</h1>
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
                placeholder="John Doe"
                {...register("name", { required: true })}
              />
              {errors.name && (
                <span className="text-[13px] ml-1 text-red-500">
                  name harus diisi
                </span>
              )}
            </div>
            <div>
              <label htmlFor="email" className="font-medium">
                Email
                <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="email"
                className="addInput"
                placeholder="johndoe@gmail.com"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="password" className="font-medium">
                Password
                <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="password"
                className="addInput"
                placeholder="* * * * * *"
                {...register("password", { required: true })}
              />
            </div>
            <div>
              <label htmlFor="phone" className="font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="addInput"
                placeholder="+62"
                {...register("phone", { required: false })}
              />
            </div>
            <div>
              <label htmlFor="address" className="font-medium">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="addInput"
                placeholder="Kota Bandung, Jawa Barat"
                {...register("address", { required: false })}
              />
            </div>
            <div>
              <label htmlFor="role" className="font-medium">
                Role
                <span className="text-red-600">*</span>
              </label>
              <select
                id="role"
                className="addInput"
                {...register("role", { required: true })}
              >
                <option value="Users">Users</option>
                <option value="Operator">Operator</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <div className="my-1 justify-end flex gap-3 md:">
                <button
                  disabled={loading}
                  onClick={() => navigate("/admin/users")}
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
                  Save User
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default NewUser;
