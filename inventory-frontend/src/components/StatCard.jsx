import React from "react";

export default function StatCard({ title, value, color = "text-slate-800" }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h2>
    </div>
  );
}
