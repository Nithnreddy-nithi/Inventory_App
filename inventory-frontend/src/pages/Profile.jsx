import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setMessage("");

      await api.put("/auth/change-password", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setMessage("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-6">My Profile</h2>

      {/* User Info */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Username</label>
          <div className="border rounded-lg px-4 py-2">{user.username}</div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Role</label>
          <div className="border rounded-lg px-4 py-2 capitalize">
            {user.role}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="mt-8">
        <h3 className="font-medium mb-3">Change Password</h3>

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3"
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 mb-3"
        />

        {message && (
          <p className="text-sm text-center text-red-500">{message}</p>
        )}

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg"
        >
          Back
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
