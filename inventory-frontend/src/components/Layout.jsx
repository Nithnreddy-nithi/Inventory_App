import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto bg-slate-100">
          <Outlet />   {/* 🔥 THIS IS WHAT RENDERS CONTENT */}
        </main>
      </div>
    </div>
  );
}

