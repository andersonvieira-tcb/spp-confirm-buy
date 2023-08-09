"use client";
import { products } from "@/db";
import { ImCoinDollar } from "react-icons/im";
import { MdProductionQuantityLimits } from "react-icons/md";
import ReactLoading from "react-loading";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import "./styles.css";
import { post } from "@/actions";
import { toast } from "react-toastify";
const ConfirmBuy = () => {
  const [event_type, setEventType] = useState("PURCHASE_CONFIRMED");
  const [customer_email, setCustomerEmail] = useState("");
  const [customer_first_name, setCustomerFirstName] = useState("");
  const [customer_last_name, setCustomerLastName] = useState("");
  const searchParams = useSearchParams();
  const utm_content = searchParams.get("utm_content");
  const product_id = searchParams.get("product_id");

  const [loading, setLoading] = useState(false);
  const [bought, setBought] = useState(false);
  const product = products.find((e) => e.product_id === product_id);

  if (!utm_content || !product_id || !product) {
    redirect("/");
  }

  const onSubmitFunc = async (e) => {
    e.preventDefault();
    const data = {
      ...product,
      customer_email,
      customer_first_name,
      customer_last_name,
      event_type,
      utm_content,
    };
    setLoading(true);

    const res = await post(data);

    if (res.status === "success") {
      toast.success("Webhook enviado");
      setBought(true);
    }
    setLoading(false);
  };

  return (
    <main>
      <div className="mainContainer">
        {" "}
        <div className="userInfos">
          <MdProductionQuantityLimits />
          <div className="userInfoName">
            {" "}
            <p className="infoTag">Produto</p>
            <p>{product.product_name}</p>
          </div>
        </div>
        <div className="userInfos">
          <ImCoinDollar />
          <div className="userInfoName">
            {" "}
            <p className="infoTag">Valor</p>
            <p>{product.order_amount}</p>
          </div>
        </div>
        <div className="userInfos">
          <div className="userInfoName">
            {" "}
            <p className="infoTag">Event type</p>
            <select
              name="select"
              className="select-products"
              value={event_type}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="PURCHASE_CONFIRMED">
                Compra Realizada (PURCHASE_CONFIRMED)
              </option>
              <option value="PURCHASE_REFUNDED">
                Reembolso (PURCHASE_REFUNDED)
              </option>
              <option value="PURCHASE_CHARGED_BACKED">
                Estorno (PURCHASE_CHARGED_BACKED)
              </option>
            </select>
          </div>
        </div>
        {bought ? (
          <button
            className="buttonBought"
            type="button"
            onClick={() => window.location.reload()}
          >
            Comprar novamente
          </button>
        ) : (
          <form onSubmit={onSubmitFunc}>
            <label htmlFor="customer_email">Email do comprador</label>
            <input
              onChange={(e) => setCustomerEmail(e.target.value)}
              type={"email"}
              name="customer_email"
              required
            />
            <label htmlFor="customer_first_name">Nome do comprador</label>
            <input
              onChange={(e) => setCustomerFirstName(e.target.value)}
              type={"text"}
              name="customer_first_name"
              required
            />
            <label htmlFor="customer_last_name">Sobrenome do comprador</label>
            <input
              onChange={(e) => setCustomerLastName(e.target.value)}
              type={"text"}
              name="customer_last_name"
              required
            />
            {loading ? (
              <div className="flex justify-center py-2">
                <ReactLoading
                  type={"spin"}
                  color={"#03dac5"}
                  height={"50px"}
                  width={"50px"}
                />
              </div>
            ) : (
              <button type="submit">Confirmar compra</button>
            )}
          </form>
        )}
      </div>
    </main>
  );
};

export default ConfirmBuy;
