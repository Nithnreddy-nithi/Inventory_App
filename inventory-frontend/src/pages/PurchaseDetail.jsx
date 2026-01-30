import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function PurchaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPurchase = async () => {
    try {
      const res = await api.get(`/purchases/${id}`);
      setPurchase(res.data);
    } catch {
      toast.error("Failed to load purchase");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchase();
  }, []);

  const receivePurchase = async () => {
    try {
      await api.put(`/purchases/${id}/receive`);
      toast.success("Purchase received");
      navigate("/inventory");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to receive");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!purchase) return null;

  const isDraft = purchase.status === "draft";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          Purchase #{purchase.id}
        </h2>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isDraft
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {purchase.status.toUpperCase()}
        </span>
      </div>

      {/* Supplier */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <p className="font-medium">Supplier</p>
        <p className="text-slate-600">
          {purchase.supplier?.name}
        </p>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-right">Qty</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchase.items.map((item) => (
              <tr key={item.product_id} className="border-t">
                <td className="px-4 py-2">
                  {item.product?.name}
                </td>
                <td className="px-4 py-2 text-right">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 text-right">
                  ₹{item.unit_price}
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  ₹{item.quantity * item.unit_price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <p className="text-lg font-semibold">
          Total: ₹{purchase.total_amount}
        </p>

        <div className="space-x-3">
          <button
            onClick={() => navigate("/purchase")}
            className="border px-4 py-2 rounded-lg"
          >
            Back
          </button>

          {isDraft ? (
            <button
              onClick={receivePurchase}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Receive Purchase
            </button>
          ) : (
            <span className="text-slate-500 text-sm">
              Purchase locked
            </span>
          )}
        </div>
      </div>
    </div>
  );
}