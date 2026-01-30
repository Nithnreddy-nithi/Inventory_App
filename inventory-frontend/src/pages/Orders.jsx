import React, { useEffect, useState } from "react";
import { getSales, deleteSale } from "../api/saleApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const load = () => {
    getSales(token).then((res) => setOrders(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    await deleteSale(id, token);
    load();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={() => navigate("/orders/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Order
        </button>
      </div>

      <table className="w-full border">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-2">ID</th>
            <th>Total</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t text-center">
              <td className="p-2">{o.id}</td>
              <td>₹{o.total_amount}</td>
              <td>{new Date(o.date).toLocaleString()}</td>
              <td className="space-x-2">
                <button
                  onClick={() => navigate(`/orders/${o.id}`)}
                  className="text-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => remove(o.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
