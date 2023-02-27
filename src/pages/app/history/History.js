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

function History() {
  const user = useRecoilValue(userState);
  const token = useRecoilValue(authToken);

  const [filterInput, setFilterInput] = useState("");
  const [history, setHistory] = useState(false);

  const getHistory = () => {
    console.log("token: ", token);
    console.log("user: ", user);
    getRequest("history", token)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log("err::::: ", err);
      });
  };

  useEffect(() => {
    try {
      getHistory();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const dataMemo = useMemo(() => history, [history]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Log",
        accessor: "log",
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <p>{dayjs(value).format("DD MMMM YYYY (HH:MM:s)")}</p>
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
        <title>History | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />
      <div className="layoutContainer min-h-screen">
        {/* {!user.verified && <VerificationReminder />} */}
        <div className="flex justify-between items-center">
          <h1 className="pageName">History</h1>
          <Link to="/admin/history/new" className="addButton">
            <Icon icon="akar-icons:plus" width="18" />
            New History
          </Link>
        </div>
        <div className="contentContainer">
          <h5 className="font-semibold">History Total: {history?.length}</h5>
          {/* Search Bar & Filter Nanti */}
          <div className="flex w-full my-2">
            <input
              type="text"
              placeholder="Cari History"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out  rounded p-2"
            />
            {/* <button>
              Cari
            </button> */}
          </div>

          {/* Kalo Loading */}
          {history === false && <div>Loading...</div>}

          {/* Table */}
          {!history === false && (
            <>
              {dataMemo?.length > 0 ? (
                <Table
                  columns={columns}
                  data={dataMemo}
                  filterInput={filterInput}
                  filterColumn="log"
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

export default History;
