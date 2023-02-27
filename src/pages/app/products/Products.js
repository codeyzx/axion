import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../../../atoms/userAtom";
import EmptyTable from "../../../components/EmptyTable";
import NavbarAdmin from "../../../components/NavbarAdmin";
import Table from "../../../components/Table";
import { getRequest } from "../../../configs/axios";
import rupiahConverter from "../../../helpers/rupiahConverter";

function Products() {
  const user = useRecoilValue(userState);
  const [filterInput, setFilterInput] = useState("");
  const [products, setProducts] = useState(false);

  const getProducts = async () => {
    await getRequest("products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log("err::::: ", err);
      });
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
        Header: "Gambar",
        accessor: "image",
        Cell: ({ cell: { value } }) => (
          <img
            src={"http://127.0.0.1:8080/" + value}
            alt="productImg"
            className="h-16 w-16 object-cover"
          />
        ),
      },
      {
        Header: "Nama",
        accessor: "name",
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
      {
        Header: "Deskripsi",
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
          <Link to="/admin/products/new" className="addButton">
            <Icon icon="akar-icons:plus" width="18" />
            Produk Baru
          </Link>
        </div>
        <div className="contentContainer">
          <h5 className="font-semibold">Total Produk: {products?.length}</h5>
          {/* Search Bar & Filter Nanti */}
          <div className="flex w-full my-2">
            <input
              type="text"
              placeholder="Cari Produk"
              onChange={handleFilterChange}
              value={filterInput}
              className="w-full focus:border-purple-600 text-sm outline-none border-[1px] border-gray-300 transition-all duration-300 ease-out  rounded p-2"
            />
            {/* <button>
              Cari
            </button> */}
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
