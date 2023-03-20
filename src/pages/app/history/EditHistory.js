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

function EditHistory() {
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
  const [history, setHistory] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const token = useRecoilValue(authToken);
  // const token = localStorage.getItem("token");

  const getHistory = async () => {
    await getRequest("history/" + id, token)
      .then((res) => {
        setHistory(res.data["data"]);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          console.error("History doesnt exist");
          navigate("/admin/history");
          return;
        }
      });
  };

  useEffect(() => {
    setFirstLoading(true);
    try {
      getHistory();
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
      await putRequest("history/" + id, data, token);
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
      await deleteRequest("history/" + id, token);
      toast.success("Data Berhasil Dihapus");
      navigate("/admin/history");
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
        <title>Edit History | Axion</title>
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
          {!firstLoading && history ? (
            <>
              <div className="flex flex-row justify-between">
                <h1 className="pageName mb-6">Edit History</h1>
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
                          <p className="font-medium">Delete History</p>
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
                  <label htmlFor="log" className="font-medium">
                    Log<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="log"
                    className="addInput"
                    placeholder="John Doe"
                    {...register("log", { required: true })}
                    defaultValue={history?.log}
                  />
                  {errors.status && (
                    <span className="text-[13px] ml-1 text-red-500">
                      status harus diisi
                    </span>
                  )}
                </div>

                <div className="my-1 justify-end flex gap-3 md:">
                  <button
                    type="button"
                    className={`batalkanBtn ${
                      (loading || !isChange) && "opacity-75"
                    }`}
                    onClick={() => navigate("/admin/history")}
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
                    Save Kustomer
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

export default EditHistory;
