import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authToken } from "../../../atoms/authToken";
import { userState } from "../../../atoms/userAtom";
import NavbarAdmin from "../../../components/NavbarAdmin";
import { getRequest } from "../../../configs/axios";

function ViewTransaction() {
  let { id } = useParams();

  const { register } = useForm();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const [transaction, setTransaction] = useState(null);
  const [firstLoading, setFirstLoading] = useState(true);
  const token = useRecoilValue(authToken);

  const getTransaction = async () => {
    await getRequest("auction-histories/" + id, token)
      .then((res) => {
        var data = res.data["data"];
        var date = new Date(data["created_at"]);
        data["created_at"] = date.toISOString().slice(0, 16).replace("T", " ");
        setTransaction(data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          console.error("Transaction doesnt exist");
          navigate("/app/transactions");
          return;
        }
      });
  };

  useEffect(() => {
    setFirstLoading(true);
    try {
      getTransaction();
      setFirstLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setFirstLoading(false);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Detail Transaction | Axion</title>
      </Helmet>
      <NavbarAdmin user={user} />

      <div className="layoutContainer min-h-screen">
        <button
          onClick={() => navigate("/app/transactions")}
          className="py-1 px-3 text-sm my-3 bg-white border-[1px] border-gray-300 hover:bg-gray-50 rounded font-medium flex items-center w-fit gap-1"
        >
          <Icon icon="akar-icons:chevron-left" className="inline" />
          Back
        </button>

        <div className="contentContainer">
          {!firstLoading && transaction ? (
            <>
              <h1 className="pageName mb-6">Detail Transaction</h1>
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="auction" className="font-medium">
                    Name
                  </label>
                  <input
                    disabled={true}
                    type="text"
                    id="auction"
                    className="addInput"
                    placeholder="Sunflower Bouquet"
                    {...register("name")}
                    defaultValue={transaction?.auction.name}
                  />
                </div>
                <div>
                  <label htmlFor="price" className="font-medium">
                    Price (Rupiah)
                  </label>
                  <input
                    disabled={true}
                    type="number"
                    id="price"
                    className="addInput"
                    placeholder="Price"
                    min={0}
                    {...register("price")}
                    defaultValue={transaction?.price}
                  />
                </div>
                <div>
                  <label htmlFor="product" className="font-medium">
                    Product
                  </label>
                  <input
                    disabled={true}
                    type="text"
                    id="product"
                    className="addInput"
                    placeholder="Sunflower Bouquet"
                    {...register("name")}
                    defaultValue={transaction?.auction.product.name}
                  />
                </div>
                <div>
                  <label htmlFor="image" className="font-medium">
                    Image
                  </label>
                  <div className="border-gray-300 border-[1px] w-fit hover:border-purple-600 p-4 items-center my-2 rounded flex flex-col gap-4 cursor-pointer">
                    <img
                      src={
                        "http://127.0.0.1:8080/" +
                        transaction?.auction.product.image
                      }
                      alt="img placeholder"
                      className="w-32"
                    />
                  </div>
                  <input
                    disabled={true}
                    type="file"
                    name="image"
                    accept="image/*"
                    className="opacity-0"
                  />
                </div>

                <div>
                  <label htmlFor="created_at" className="font-medium">
                    Times
                  </label>
                  <input
                    type="datetime-local"
                    id="created_at"
                    className="addInput"
                    placeholder="Time"
                    {...register("created_at")}
                    defaultValue={transaction?.created_at}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>Harap Tunggu...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ViewTransaction;
