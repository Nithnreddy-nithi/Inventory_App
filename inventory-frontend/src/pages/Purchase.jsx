import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function Purchase() {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);


  const loadPurchases = async () => {
    try {
      const res = await api.get("/purchases/");
      setPurchases(res.data);
    } catch {
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPurchases();
  }, []);

  const receivePurchase = async (id) => {
    if (!window.confirm("Receive this purchase? Stock will be updated.")) return;

    try {
      await api.put(`/purchases/${id}/receive`);
      toast.success("Purchase received");
      loadPurchases();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to receive purchase");
    }
  };

  const deletePurchase = async (id) => {
    if (!window.confirm("Delete this draft purchase?")) return;

    try {
      await api.delete(`/purchases/${id}`);
      toast.success("Purchase deleted");
      loadPurchases();
    } catch {
      toast.error("Failed to delete purchase");
    }
  };
  const confirmReceive = async () => {
  if (!selectedPurchase) return;

  try {
    await api.put(`/purchases/${selectedPurchase.id}/receive`);
    toast.success("Purchase received successfully");
    loadPurchases();
    navigate("/inventory");
  } catch (err) {
    toast.error(err.response?.data?.detail || "Failed to receive purchase");
  } finally {
    setShowReceiveModal(false);
    setSelectedPurchase(null);
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Purchases</h2>
        <button onClick={() => navigate("/purchase/new")} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          + New Purchase
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Supplier</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-right">Total</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {purchases.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-500">
                  No purchases found
                </td>
              </tr>
            ) : (
              purchases.map((p) => (
                <tr key={p.id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4">#{p.id}</td>
                  <td className="px-6 py-4">
                    {p.supplier?.name || "—"} 
                  </td>
                  <td className="px-6 py-4">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.status === "received"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >   
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    ₹{p.total_amount || 0}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {p.status === "draft" && (
                      <>
                       <button
                            onClick={() => {
                              setSelectedPurchase(p);
                              setShowReceiveModal(true);
                            }}
                            className="text-green-600 hover:underline"
                          >
                            Receive
                        </button>

                       
                        <button
                          onClick={() => deletePurchase(p.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {p.status === "received" && (
                      <span className="text-slate-400 text-xs">
                        Locked
                      </span>
                    )}
                  </td>
                  <td><button
                              onClick={() => navigate(`/purchase/${p.id}`)}
                                className="text-blue-600 hover:underline"
                                  >
                                                View
                                              </button> 
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>



      {showReceiveModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

      <h3 className="text-lg font-semibold text-green-700">
        Receive Purchase
      </h3>

      <p className="mt-3 text-slate-600 text-sm">
        Receiving this purchase will:
      </p>

      <ul className="list-disc list-inside text-sm text-slate-600 mt-2 space-y-1">
        <li>Increase inventory stock</li>
        <li>Lock this purchase permanently</li>
        <li>Create inventory transaction logs</li>
      </ul>

      <p className="mt-3 text-sm font-medium text-red-600">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowReceiveModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={confirmReceive}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Confirm Receive
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
