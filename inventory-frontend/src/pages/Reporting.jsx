import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Reporting() {
  const { token } = useAuth();

  const [sales, setSales] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const fetchSales = async () => {
    const res = await axios.get(
      `http://127.0.0.1:9000/reports/sales?start_date=${start}&end_date=${end}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSales(res.data);
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:9000/reports/product-sales", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProductSales(res.data));

    axios.get("http://127.0.0.1:9000/reports/low-stock", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLowStock(res.data));
  }, []);

  return (
    <div className="space-y-8">

      {/* Sales by Date */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Sales Report</h2>

        <div className="flex gap-4 mb-4">
          <input type="date" value={start} onChange={e => setStart(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} className="border p-2 rounded" />
          <button onClick={fetchSales} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Fetch
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Date</th>
              <th>Orders</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s, i) => (
              <tr key={i} className="border-b">
                <td>{s.date}</td>
                <td>{s.orders}</td>
                <td>₹{s.total_sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Sales */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Product-wise Sales</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Product</th>
              <th>Qty Sold</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {productSales.map((p, i) => (
              <tr key={i} className="border-b">
                <td>{p.product}</td>
                <td>{p.total_qty}</td>
                <td>₹{p.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Low Stock Items</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Product</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((p, i) => (
              <tr key={i} className="border-b">
                <td>{p.name}</td>
                <td className="text-red-600 font-semibold">{p.stock_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
