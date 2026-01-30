import { useState } from "react";
import { register } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "staff",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    alert("User created successfully");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register User</h2>

        <input
          name="username"
          placeholder="Username"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <select
          name="role"
          className="w-full border p-2 mb-4"
          onChange={handleChange}
        >
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Create User
        </button>
      </form>
    </div>
  );
}
