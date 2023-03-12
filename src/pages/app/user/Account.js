import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { getRequest, putRequest } from "../../../configs/axios";

function Account() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [, setUsers] = useRecoilState(userState);
  const [isChange, setIsChange] = useState(false);
  const token = useRecoilValue(authToken);
  const users = useRecoilValue(userState);

  const changeHandler = () => {
    if (isChange === true) return;
    setIsChange(true);
  };

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      await putRequest("users/" + users.id, data, token);
      await getRequest("users/" + users.id, token)
        .then((res) => {
          console.log(res);
          setUsers(res.data["data"]);
          localStorage.setItem("user", JSON.stringify(res.data["data"]));
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 404) {
            console.error("User doesnt exist");
            navigate("/admin/users");
            return;
          }
        });
      toast.success("Data Berhasil Disimpan");
    } catch (err) {
      console.error(err);
      toast.error("Terjadi Kesalahan");
    } finally {
      setIsChange(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Account | Axion</title>
      </Helmet>
      <NavbarAdmin user={users} />

      <div className="layoutContainer min-h-screen">
        <div className="contentContainer">
          {!loading ? (
            <>
              <div className="flex flex-row">
                <h1 className="pageName mb-6">Your Account</h1>
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
                    placeholder="John Doe"
                    {...register("name")}
                    defaultValue={users?.name}
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
                  </label>
                  <input
                    type="text"
                    id="email"
                    className="addInput"
                    placeholder="johndoe@gmail.com"
                    {...register("email")}
                    defaultValue={users?.email}
                    disabled={true}
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
                    {...register("phone")}
                    defaultValue={users?.phone}
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
                    {...register("address")}
                    defaultValue={users?.address}
                  />
                </div>

                <div className="my-1 justify-end flex gap-3 md:">
                  <button
                    type="button"
                    className={`batalkanBtn ${
                      (loading || !isChange) && "opacity-75"
                    }`}
                    onClick={() => navigate("/app/settings")}
                    disabled={loading || !isChange}
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
                    Save
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div>Please wait...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Account;
