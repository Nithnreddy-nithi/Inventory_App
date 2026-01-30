import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Purchase from "./pages/Purchase";
import Reporting from "./pages/Reporting";
import CreatePurchase from "./pages/CreatePurchase";
import PurchaseDetail from "./pages/PurchaseDetail";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminRoute from "./components/AdminRoute";
import UserManagement from "./pages/UserManagement";

import CreateOrder from "./pages/CreateOrder";
import OrderDetail from "./pages/OrderDetail";
import AboutUs from "./pages/AboutUs";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PUBLIC ROUTES (NO SIDEBAR) */}
        <Route path="/login" element={<Login />} />




        {/* 🔒 PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/register" element={<Register />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/purchase" element={<Purchase />} />
          <Route path="/purchase/new" element={<CreatePurchase />} />
          <Route path="/purchase/:id" element={<PurchaseDetail />} />
          <Route path="/reporting" element={<Reporting />} />
          <Route path="/orders/new" element={<CreateOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
