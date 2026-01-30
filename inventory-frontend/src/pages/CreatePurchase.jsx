import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreatePurchase() {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get("/suppliers/"),
      api.get("/products/")
    ]).then(([supRes, prodRes]) => {
      setSuppliers(supRes.data);
      setProducts(prodRes.data);
    });
  }, []);

  const addItem = () => {
    setItems([
      ...items,
      { product_id: "", quantity: 1, unit_price: 0 }
    ]);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + i.quantity * i.unit_price,
    0
  );

  const savePurchase = async () => {
    if (!supplierId || items.length === 0) {
      toast.error("Supplier and items are required");
      return;
    }

    try {
      await api.post("/purchases/", {
        supplier_id: supplierId,
        items
      });

      toast.success("Purchase draft created");
      navigate("/purchase");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create purchase");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">New Purchase</h2>

      {/* Supplier */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <label className="block text-sm font-medium mb-2">
          Supplier
        </label>
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="border rounded-lg px-3 py-2 w-64"
        >
          <option value="">Select supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items */}
      <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Items</h3>
          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-3 py-1 rounded-lg"
          >
            + Add Item
          </button>
        </div>

        {items.length === 0 && (
          <p className="text-slate-500 text-sm">
            No items added
          </p>
        )}

        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-3 items-center"
          >
            <select
              value={item.product_id}
              onChange={(e) =>
                updateItem(index, "product_id", e.target.value)
              }
              className="border rounded px-2 py-1"
            >
              <option value="">Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                updateItem(index, "quantity", Number(e.target.value))
              }
              className="border rounded px-2 py-1"
              placeholder="Qty"
            />

            <input
              type="number"
              min="0"
              value={item.unit_price}
              onChange={(e) =>
                updateItem(index, "unit_price", Number(e.target.value))
              }
              className="border rounded px-2 py-1"
              placeholder="Price"
            />

            <p className="text-right font-medium">
              ₹{item.quantity * item.unit_price}
            </p>

            <button
              onClick={() => removeItem(index)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <p className="text-lg font-semibold">
          Total: ₹{totalAmount}
        </p>

        <div className="space-x-3">
          <button
            onClick={() => navigate("/purchase")}
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={savePurchase}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}
