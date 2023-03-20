import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { deleteRequest, getRequest, putRequest } from "../../../configs/axios";

function EditUser() {
  let { id } = useParams();
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const token = useRecoilValue(authToken);
  const emailNavigate = "/admin/users-email/" + id;
  const roleNavigate = "/admin/users-role/" + id;

  const getUser = async () => {
    await getRequest("users/" + id, token)
      .then((res) => {
        setUsers(res.data["data"]);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          console.error("User doesnt exist");
          navigate("/admin/users");
          return;
        }
      });
  };

  useEffect(() => {
    setFirstLoading(true);
    try {
      getUser();
      setFirstLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const changeHandler = () => {
    if (isChange === true) return;
    setIsChange(true);
  };

  const submitHandler = async (data) => {
    setLoading(true);
    try {
      await putRequest("users/" + id, data, token);
      toast.success("Data Berhasil Disimpan");
    } catch (err) {
      console.error(err);
      toast.error("Terjadi Kesalahan");
    } finally {
      setIsChange(false);
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await deleteRequest("users/" + id, token);
      toast.success("Data Berhasil Dihapus");
      navigate("/admin/users");
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
        <title>Edit User | Axion</title>
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
          {!firstLoading && users ? (
            <>
              <div className="flex flex-row justify-between">
                <h1 className="pageName mb-6">Edit User</h1>
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
                          onClick={() => navigate(roleNavigate)}
                        >
                          <Icon icon="eos-icons:role-binding" width="18" />
                          <p className="font-medium">Update Role</p>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={` px-3 py-[6px] flex gap-2  ${
                            active && "bg-gray-100 text-red-500"
                          }`}
                          onClick={() => navigate(emailNavigate)}
                        >
                          <Icon icon="ic:round-email" width="18" />
                          <p className="font-medium">Update Email</p>
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={` px-3 py-[6px] flex gap-2  ${
                            active && "bg-gray-100 text-red-500"
                          }`}
                          onClick={deleteHandler}
                        >
                          <Icon icon="mdi:trash-can-outline" width="18" />
                          <p className="font-medium">Delete User</p>
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
                    Name<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="addInput"
                    placeholder="John Doe"
                    {...register("name", { required: true })}
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
                    {...register("email", { required: false })}
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
                    {...register("phone", { required: false })}
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
                    {...register("address", { required: false })}
                    defaultValue={users?.address}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="font-medium">
                    Role
                  </label>
                  <select
                    id="role"
                    className="addInput"
                    {...register("role", { required: false })}
                    defaultValue={users?.role}
                    disabled={true}
                  >
                    <option value="Users">Users</option>
                    <option value="Operator">Operator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div className="my-1 justify-end flex gap-3 md:">
                  <button
                    type="button"
                    className={`batalkanBtn ${
                      (loading || !isChange) && "opacity-75"
                    }`}
                    onClick={() => navigate("/admin/users")}
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
                    Save User
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

export default EditUser;
