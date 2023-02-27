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
import { getRequest } from "../../../configs/axios";

function User() {
  const user = useRecoilValue(userState);
  const token = useRecoilValue(authToken);

  const [filterInput, setFilterInput] = useState("");
  const [users, setUsers] = useState(false);

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
          <h5 className="font-semibold">User Total: {users?.length}</h5>
          {/* Search Bar & Filter Nanti */}
          <div className="flex w-full my-2">
            <input
              type="text"
              placeholder="Cari User"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out  rounded p-2"
            />
            {/* <button>
              Cari
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
