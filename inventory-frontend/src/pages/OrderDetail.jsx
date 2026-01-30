import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSale } from "../api/saleApi";
import { useAuth } from "../context/AuthContext";

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getSale(id, token).then((res) => setOrder(res.data));
  }, []);

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Order #{order.id}</h1>

      <p>Total: ₹{order.total_amount}</p>

      <table className="w-full mt-4 border">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2">Product ID</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.id} className="border-t text-center">
              <td className="p-2">{i.product?.name}</td>
              <td>{i.quantity}</td>
              <td>₹{i.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
