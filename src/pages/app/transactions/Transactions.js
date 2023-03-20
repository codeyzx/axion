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
import rupiahConverter from "../../../helpers/rupiahConverter";

function Transactions() {
  const user = useRecoilValue(userState);
  const [filterInput, setFilterInput] = useState("");
  const [transactions, setTransactions] = useState(false);
  const token = useRecoilValue(authToken);

  const downloadPDF = async () => {
    const response = await downloadRequest(
      "auction-histories-export-pdf",
      token
    );
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = async () => {
    const response = await downloadRequest(
      "auction-histories-export-excel",
      token
    );
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transaction-report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTransactions = async () => {
    if (user.role.toLowerCase() === "admin") {
      await getRequest("auction-histories", token)
        .then((res) => {
          setTransactions(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await getRequest(`auction-histories/user/${user.id}`, token)
        .then((res) => {
          setTransactions(res.data["data"]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    () =>
      user.role.toLowerCase() === "users"
        ? [
            {
              Header: "ID",
              accessor: "id",
            },
            {
              Header: "Auction",
              accessor: "auction.name",
              Cell: ({ cell: { value } }) => (
                <p className={`max-w-[160px]`}>{value}</p>
              ),
            },
            {
              Header: "Price",
              accessor: "price",
              Cell: ({ cell: { value } }) => (
                <p className={`text-[13px]`}>{rupiahConverter(value)}</p>
              ),
            },
            {
              Header: "Time",
              accessor: "created_at",
              Cell: ({ cell: { value } }) => (
                <p>{dayjs(value).format("DD MMMM YYYY HH:MM")}</p>
              ),
            },
          ]
        : [
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
              Header: "User",
              accessor: "user_name",
              Cell: ({ cell: { value } }) => (
                <p className={`max-w-[160px]`}>{value}</p>
              ),
            },
            {
              Header: "Price",
              accessor: "price",
              Cell: ({ cell: { value } }) => (
                <p className={`text-[13px]`}>{rupiahConverter(value)}</p>
              ),
            },
            {
              Header: "Time",
              accessor: "created_at",
              Cell: ({ cell: { value } }) => (
                <p>{dayjs(value).format("DD MMMM YYYY HH:MM")}</p>
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
          {user.role.toLowerCase() !== "users" && (
            <Link to="/admin/transactions/new" className="addButton">
              <Icon icon="akar-icons:plus" width="18" />
              New Transaction
            </Link>
          )}
        </div>
        <div className="contentContainer">
          <div className="flex flex-row justify-between">
            <h5 className="font-semibold">
              Total Transaction: {transactions?.length}
            </h5>
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
              placeholder="Search Transaction"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out  rounded p-2"
            />
          </div>

          {/* Kalo Loading */}
          {transactions === false && <div>Loading...</div>}

          {/* Table */}
          {!transactions === false && (
            <>
              {dataMemo?.length > 0 ? (
                <>
                  {user.role.toLowerCase() === "users" ? (
                    <Table
                      columns={columns}
                      data={dataMemo}
                      filterInput={filterInput}
                      filterColumn="auction.name"
                    />
                  ) : (
                    <Table
                      columns={columns}
                      data={dataMemo}
                      filterInput={filterInput}
                      filterColumn="auction_name"
                    />
                  )}
                </>
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
