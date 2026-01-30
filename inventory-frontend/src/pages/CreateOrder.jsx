            import React, { useEffect, useState } from "react";
            import axios from "axios";
            import { useNavigate } from "react-router-dom";
            import { useAuth } from "../context/AuthContext";

            export default function CreateOrder() {
            const [products, setProducts] = useState([]);
            const [customer, setCustomer] = useState("");
            const [items, setItems] = useState([]);
            const navigate = useNavigate();
            const { token } = useAuth();

            useEffect(() => {
                axios
                .get("http://127.0.0.1:9000/products/", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => setProducts(res.data));
            }, []);

            const addItem = () => {
                setItems([...items, { product_id: "", quantity: 1 }]);
            };

            const updateItem = (index, field, value) => {
                const copy = [...items];
                copy[index][field] = value;
                setItems(copy);
            };

                        const createOrder = async () => {
                        const payload = {
                            user_id: null,
                            items: items.map((item) => ({
                            product_id: Number(item.product_id),
                            quantity: Number(item.quantity),
                            price: Number(
                                products.find((p) => p.id == item.product_id)?.price || 0
                            ),
                            })),
                        };

                        await axios.post("http://127.0.0.1:9000/sales/", payload, {
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        navigate("/orders");
                        };


            return (
                <div className="p-6 max-w-3xl">
                <h1 className="text-2xl font-bold mb-4">Create Order</h1>

                <input
                    type="text"
                    placeholder="Customer Name"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="border p-2 w-full mb-4 rounded"
                />

                {items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 mb-3">
                    <select
                        value={item.product_id}
                        onChange={(e) => updateItem(idx, "product_id", e.target.value)}
                        className="border p-2 flex-1 rounded"
                    >
                        <option value="">Select Product</option>
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
                        onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                        className="border p-2 w-24 rounded"
                    />
                    </div>
                ))}

                <button
                    onClick={addItem}
                    className="bg-slate-200 px-3 py-1 rounded mb-4"
                >
                    + Add Item
                </button>

                <div>
                    <button
                    onClick={createOrder}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                    Save Order
                    </button>
                </div>
                </div>
            );
            }
