import React, { useEffect, useState } from "react";
import SalesChart from "../components/SalesChart";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

// Simple Inline Icons for Premium Look
const IconBox = ({ path, colorBg, colorText }) => (
  <div className={`p-3 rounded-xl ${colorBg} ${colorText}`}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {path}
    </svg>
  </div>
);

const StatCard = ({ title, value, iconPath, colorBg, colorText, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <IconBox path={iconPath} colorBg={colorBg} colorText={colorText} />
    </div>
    {trend && (
      <div className="mt-4 flex items-center text-xs">
        <span className="text-emerald-500 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">+{trend}%</span>
        <span className="text-slate-400 ml-2">from last month</span>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    axios.get(`${API_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSummary(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard load failed", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex h-full items-center justify-center p-10">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 animate-pulse">Loading dashboard insights...</p>
      </div>
    </div>
  );

  if (!summary) return <div className="p-8 text-center text-red-500">Failed to load data. Please check connection.</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
          <p className="text-slate-500">Welcome back, {user?.username} 👋</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition">Export Report</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">View Details</button>
        </div>
      </div>

      {/* 🔹 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={summary.total_products}
          colorBg="bg-blue-50" colorText="text-blue-600"
          iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />}
          trend="12"
        />
        <StatCard
          title="Total Stock"
          value={summary.total_stock}
          colorBg="bg-emerald-50" colorText="text-emerald-600"
          iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />}
          trend="8"
        />
        <StatCard
          title="Active Orders"
          value={summary.total_orders}
          colorBg="bg-violet-50" colorText="text-violet-600"
          iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
          trend="24"
        />
        <StatCard
          title="Total Revenue"
          value={`$${summary.total_revenue.toLocaleString()}`}
          colorBg="bg-amber-50" colorText="text-amber-600"
          iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
          trend="15"
        />
        <StatCard
          title="Low Stock Items"
          value={summary.low_stock}
          colorBg="bg-red-50" colorText="text-red-500"
          iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />}
        />
        <StatCard
          title="Out of Stock"
          value={summary.out_of_stock}
          colorBg="bg-gray-100" colorText="text-gray-600"
          iconPath={<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />}
        />
      </div>

      {/* 🔹 CHARTS & DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Sales Overview</h2>
            <select className="bg-slate-50 border-none text-sm text-slate-500 rounded-lg p-2 focus:ring-2 focus:ring-indigo-100">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <SalesChart />
          </div>
        </div>

        {/* Top Products / Coming Soon */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Pro Features</h3>
            <p className="text-indigo-100 mb-6 text-sm">Unlock advanced analytics, AI forecasting, and multi-warehouse support.</p>
            <button className="bg-white text-indigo-600 px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-opacity-90 transition">Upgrade to Pro</button>
          </div>
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-purple-500 opacity-20 rounded-full blur-2xl"></div>
        </div>
      </div>

    </div>
  );
}
