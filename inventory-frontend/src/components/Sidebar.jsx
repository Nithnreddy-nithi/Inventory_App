import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/" },
  { name: "Inventory", path: "/inventory" },
  { name: "Orders", path: "/orders" },
  { name: "Purchase", path: "/purchase" },
  { name: "Reporting", path: "/reporting" },
  { name: "About Us", path: "/about" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col h-screen sticky top-0">

      {/* User */}
      <div className="p-6 border-b border-slate-700">
        <p className="font-semibold">{user?.username} </p>
        <p className="text-xs text-slate-400">({user?.role})</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-2 py-2 rounded-lg transition ${isActive
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:bg-slate-700"
              }`
            }
          >
            {item.name}
          </NavLink>

        ))}

        {user?.role === "admin" && (
          <NavLink className={({ isActive }) =>
            `block px-2 py-2 rounded-lg transition ${isActive
              ? "bg-slate-700 text-white"
              : "text-slate-300 hover:bg-slate-700"
            }`
          } to="/admin/users">User Management</NavLink>
        )}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-slate-700">
        <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded-lg hover:bg-slate-700">
          Logout
        </button>
      </div>
    </aside>
  );
}
