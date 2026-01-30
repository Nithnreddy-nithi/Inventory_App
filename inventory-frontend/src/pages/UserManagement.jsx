import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUsers, updateUserRole, deleteUser } from "../services/adminApi";
import React from "react";
import { Link } from "react-router-dom";

export default function UserManagement() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetchUsers(token);
    setUsers(res.data);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Link
          to="/register"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Register New User
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Username
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Role
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-4 py-3 text-sm">
                  {u.username}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {u.role}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        updateUserRole(
                          u.id,
                          u.role === "admin" ? "staff" : "admin",
                          token
                        ).then(loadUsers)
                      }
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                    >
                      Toggle Role
                    </button>

                    <button
                      onClick={() =>
                        deleteUser(u.id, token).then(loadUsers)
                      }
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
