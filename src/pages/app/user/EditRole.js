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

function EditRole() {
  let { id } = useParams();
  const userz = useRecoilValue(userState);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [loading, setLoading] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const token = useRecoilValue(authToken);
  const backPath = "/admin/users/" + id;

  const getUser = async () => {
    await getRequest("users/" + id, token)
      .then((res) => {
        console.log(res);
        setUsers(res.data["data"]);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          console.error("User doesnt exist");
          navigate(backPath);
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
    console.log("woyyy");
    console.log("data : ", data);
    console.log("token : ", token);
    setLoading(true);
    try {
      await putRequest("users/" + id + "/update-role", data, token);
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
        <title>Edit Role | Axion</title>
      </Helmet>
      <NavbarAdmin user={userz} />

      <div className="layoutContainer min-h-screen">
        <Link
          to={backPath}
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </Link>

        <div className="contentContainer">
          {!firstLoading && users ? (
            <>
              <div className="flex flex-row justify-between">
                <h1 className="pageName mb-6">Edit Role</h1>
              </div>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(submitHandler)}
                onChange={changeHandler}
              >
                <div>
                  <label htmlFor="role" className="font-medium">
                    Role
                  </label>
                  <select
                    id="role"
                    className="addInput"
                    {...register("role", { required: true })}
                    defaultValue={users?.role}
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
                    onClick={() => navigate(backPath)}
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

export default EditRole;
