import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../atoms/userAtom";
import NavbarAdmin from "../../components/NavbarAdmin";
import { toast } from "react-toastify";

function Manage() {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // if check kalo dia di path "/app" doang bukan di  "app/home"
    if (!location.pathname.includes("/home")) navigate("/admin/home");
  }, []);

  return (
    <>
      <Helmet>
        <title>Home | Axion</title>
      </Helmet>

      <NavbarAdmin user={user} />

      <div className="layoutContainer">
        {/* {!user.verified && <VerificationReminder />} */}

        <h1 className="pageName">Home</h1>

        {/* Akses Cepat */}
        <div className="bg-white my-3 rounded-md p-4 shadow">
          <div className="flex items-start justify-between">
            {/* Bagian Kiri Atas */}
            <div className="md:flex-row flex flex-col items-start md:items-center gap-3">
              {/* <img
                src={store.profileImg}
                alt=""
                className="w-16 h-16 rounded-full p-[2px] border-2 border-purple-600 object-cover"
              /> */}
              {/* image dummy image */}
              {/* <img
                src="https://images.unsplash.com/photo-1626121498151-8e2b2b2b2b1c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                alt=""
                className="w-16 h-16 rounded-full p-[2px] border-2 border-purple-600 object-cover"
              /> */}
              <div>
                <h5 className="font-semibold text-xl">
                  {/* {store.storeName} Store */}
                  Operator Dashboard
                </h5>
                <CopyToClipboard
                  // text={`https://axions.vercel.app/${store.storeName}`}
                  text={`https://axions.vercel.app/WellStore`}
                  className="cursor-pointer"
                  onCopy={() => toast.success("Copied!")}
                >
                  <span>
                    <p className="opacity-75 flex gap-2 items-center">
                      {/* axions.vercel.app/{store.storeName} */}
                      axions.vercel.app/WellStore
                      <Icon
                        icon="fluent:copy-24-regular"
                        width="20"
                        className="text-purple-600 hover:scale-110 transition-all duration-75 ease-out cursor-pointer"
                      />
                    </p>
                  </span>
                </CopyToClipboard>
              </div>
            </div>

            {/* Bagian Kanan Atas */}
            <div className="flex items-start gap-4">
              <button
                // onClick={() => navigate(`/${store.storeName}`)}
                className="font-medium items-center text-sm  hover:bg-gray-200 flex gap-2 py-2 px-4 bg-gray-100 rounded-md"
              >
                <Icon icon="clarity:eye-line" width="22" />
                <p className="hidden sm:inline">Kunjungi Toko</p>
              </button>
              {/* <button className="text-sm font-medium hover:bg-gray-200 py-2 px-4 bg-gray-100 rounded-md">Edit Profile</button> */}
              <Link
                to="/app/settings"
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                <Icon icon="carbon:settings" width="22" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Manage;
