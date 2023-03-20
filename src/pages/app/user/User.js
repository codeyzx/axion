import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import EmptyTable from "../../../components/EmptyTable";
import NavbarAdmin from "../../../components/NavbarAdmin";
import Table from "../../../components/Table";
import { downloadRequest, getRequest } from "../../../configs/axios";

function User() {
  const user = useRecoilValue(userState);
  const token = useRecoilValue(authToken);

  const [filterInput, setFilterInput] = useState("");
  const [users, setUsers] = useState(false);

  const downloadPDF = async () => {
    const response = await downloadRequest("users-export-pdf", token);
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = async () => {
    const response = await downloadRequest("users-export-excel", token);
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users-report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getUser = async () => {
    getRequest("users", token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("err::::: ", err);
      });
  };

  useEffect(() => {
    try {
      getUser();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const dataMemo = useMemo(() => users, [users]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ cell: { value } }) => (
          <p className="truncate max-w-[80px] md:max-w-none">{value}</p>
        ),
      },
      {
        Header: "Phone",
        accessor: "phone",
        Cell: ({ cell: { value } }) => (
          <p className="truncate max-w-[80px] md:max-w-none">{value}</p>
        ),
      },
      {
        Header: "Address",
        accessor: "address",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <p>{dayjs(value).format("DD MMMM YYYY")}</p>
        ),
      },
    ],
    []
  );

  const handleFilterChange = (e) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  return (
    <>
      <Helmet>
        <title>User | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />
      <div className="layoutContainer min-h-screen">
        {/* {!user.verified && <VerificationReminder />} */}
        <div className="flex justify-between items-center">
          <h1 className="pageName">User</h1>
          <Link to="/admin/users/new" className="addButton">
            <Icon icon="akar-icons:plus" width="18" />
            New User
          </Link>
        </div>
        <div className="contentContainer">
          <div className="flex flex-row justify-between">
            <h5 className="font-semibold">Total User: {users?.length}</h5>
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
                        active && "bg-gray-100 text-green-500"
                      }`}
                      onClick={downloadPDF}
                    >
                      <Icon icon="eos-icons:role-binding" width="18" />
                      <p className="font-medium">Export to PDF</p>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={` px-3 py-[6px] flex gap-2  ${
                        active && "bg-gray-100 text-green-500"
                      }`}
                      onClick={downloadExcel}
                    >
                      <Icon icon="eos-icons:role-binding" width="18" />
                      <p className="font-medium">Export to Excel</p>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
          <div className="flex w-full my-2">
            <input
              type="text"
              placeholder="Search User"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out  rounded p-2"
            />
            {/* <button>
              Search
            </button> */}
          </div>

          {/* Kalo Loading */}
          {users === false && <div>Loading...</div>}

          {/* Table */}
          {!users === false && (
            <>
              {dataMemo?.length > 0 ? (
                <Table
                  columns={columns}
                  data={dataMemo}
                  filterInput={filterInput}
                  filterColumn="name"
                />
              ) : (
                <EmptyTable columns={columns} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default User;
