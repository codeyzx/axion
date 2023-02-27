import { Icon } from "@iconify/react";
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
import rupiahConverter from "../../../helpers/rupiahConverter";

function Transactions() {
  const user = useRecoilValue(userState);
  const [filterInput, setFilterInput] = useState("");
  const [transactions, setTransactions] = useState(false);
  const token = useRecoilValue(authToken);

  const getTransactions = async () => {
    await getRequest("auction-histories", token)
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.log("err::::: ", err);
      });
  };

  useEffect(() => {
    try {
      getTransactions();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const dataMemo = useMemo(() => transactions, [transactions]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Auction",
        accessor: "auction_name",
        Cell: ({ cell: { value } }) => (
          <p className={`max-w-[160px]`}>{value}</p>
        ),
      },
      {
        Header: "User Name",
        accessor: "user_name",
        Cell: ({ cell: { value } }) => (
          <p className={`max-w-[160px]`}>{value}</p>
        ),
      },
      {
        Header: "Harga",
        accessor: "price",
        Cell: ({ cell: { value } }) => (
          <p className={`text-[13px]`}>{rupiahConverter(value)}</p>
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
        <title>Transactions | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />
      <div className="layoutContainer min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="pageName">Transactions</h1>
          <Link to="/admin/transactions/new" className="addButton">
            <Icon icon="akar-icons:plus" width="18" />
            New Transaction
          </Link>
        </div>
        <div className="contentContainer">
          <h5 className="font-semibold">
            Total Transaction: {transactions?.length}
          </h5>
          {/* Search Bar & Filter Nanti */}
          <div className="flex w-full my-2">
            <input
              type="text"
              placeholder="Cari Transaction"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out  rounded p-2"
            />
            {/* <button>
              Cari
            </button> */}
          </div>

          {/* Kalo Loading */}
          {transactions === false && <div>Loading...</div>}

          {/* Table */}
          {!transactions === false && (
            <>
              {dataMemo?.length > 0 ? (
                <Table
                  columns={columns}
                  data={dataMemo}
                  filterInput={filterInput}
                  filterColumn="auction_name"
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

export default Transactions;
