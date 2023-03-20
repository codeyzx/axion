import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import defaultImage from "../../../assets/image-not-found.png";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";

import EmptyTable from "../../../components/EmptyTable";
import NavbarAdmin from "../../../components/NavbarAdmin";
import Table from "../../../components/Table";
import { downloadRequest, getRequest } from "../../../configs/axios";
import rupiahConverter from "../../../helpers/rupiahConverter";

function Products() {
  const user = useRecoilValue(userState);
  const token = useRecoilValue(authToken);
  const [filterInput, setFilterInput] = useState("");
  const [products, setProducts] = useState(false);

  const path = () => {
    var entity = "";
    if (user.role.toLowerCase() === "users") {
      entity = "app";
    } else {
      entity = user.role.toLowerCase();
    }
    return "/" + entity + "/products/new";
  };

  const downloadPDF = async () => {
    const response = await downloadRequest("products-export-pdf", token);
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products-report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = async () => {
    const response = await downloadRequest("products-export-excel", token);
    const blob = new Blob([response.data]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products-report.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProducts = async () => {
    if (user.role.toLowerCase() === "admin") {
      await getRequest("products")
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          console.log("err::::: ", err);
        });
    } else {
      await getRequest("products-by-users/" + user.id)
        .then((res) => {
          if (res.data === null) {
            setProducts([]);
          } else {
            setProducts(res.data);
          }
        })
        .catch((err) => {
          console.log("err::::: ", err);
        });
    }
  };

  useEffect(() => {
    try {
      getProducts();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const dataMemo = useMemo(() => products, [products]);

  const columns = useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ cell: { value } }) =>
          value !== "" ? (
            <img
              src={"http://127.0.0.1:8080/" + value}
              alt="productImg"
              className="h-16 w-16 object-cover"
            />
          ) : (
            <img
              src={defaultImage}
              alt="productImg"
              className="h-16 w-16 object-cover"
            />
          ),
      },
      {
        Header: "Name",
        accessor: "name",
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
        Header: "Description",
        accessor: "description",
        Cell: ({ cell: { value } }) => (
          <p
            className={`lg:max-w-[300px] truncate md:max-w-[160px] max-w-[90px]`}
          >
            {value}
          </p>
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
        <title>Products | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />
      <div className="layoutContainer min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="pageName">Products</h1>
          {/* <Link to="/admin/products/new" className="addButton"> */}
          {user.role.toLowerCase() !== "users" && (
            <Link to={path()} className="addButton">
              <Icon icon="akar-icons:plus" width="18" />
              New Product
            </Link>
          )}
        </div>
        <div className="contentContainer">
          <div className="flex flex-row justify-between">
            <h5 className="font-semibold">Total Product: {products?.length}</h5>
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
              placeholder="Search Product"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out  rounded p-2"
            />
          </div>

          {/* Kalo Loading */}
          {products === false && <div>Loading...</div>}

          {/* Table */}
          {!products === false && (
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

export default Products;
