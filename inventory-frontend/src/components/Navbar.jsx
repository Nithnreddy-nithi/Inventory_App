import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between relative">
      {/* Left */}
      <h2 className="text-lg font-semibold text-slate-700">
        Welcome {user?.username}!
      </h2>

      {/* Right */}
      <div className="flex items-center gap-3 relative">
        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none"
        />

        {/* Profile Avatar */}
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center font-semibold text-sm"
        >
          {user?.username?.[0]?.toUpperCase()}
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg z-50">
            <div className="px-4 py-3 border-b">
              <p className="font-semibold">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>

            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
