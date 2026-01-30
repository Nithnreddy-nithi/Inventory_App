import React, { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
 
const ITEMS_PER_PAGE = 8;

/* ---------- HELPERS ---------- */

function getStatus(stockQty) {
  if (stockQty === 0)
    return { label: "Out of Stock", color: "bg-red-100 text-red-600" };
  if (stockQty < 10)
    return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
  return { label: "In Stock", color: "bg-green-100 text-green-700" };
}

/* ---------- COMPONENT ---------- */

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { user } = useAuth();


  /* Modal + Form */
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock_qty: "",
    category_id: "",
    supplier_id: "",
  });

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 400); // 400ms delay

  return () => clearTimeout(timer);
}, [search]);


  /* ---------- LOAD DATA ---------- */

  const loadData = async () => {
    try {
      const [p, c, s] = await Promise.all([
        api.get("/products/"),
        api.get("/categories/"),
        api.get("/suppliers/"),
      ]);
      setProducts(p.data);
      setCategories(c.data);
      setSuppliers(s.data);
      setLoading(false);
    } catch {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ---------- FILTER ---------- */

const filteredProducts = products.filter((p) => {
  const matchCategory =
    selectedCategoryId === "All" ||
    String(p.category_id) === String(selectedCategoryId);

  const matchSearch =
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase())


  return matchCategory && matchSearch;
});

const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const paginatedProducts = filteredProducts.slice(
  startIndex,
  startIndex + ITEMS_PER_PAGE
);



  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  /* ---------- FORM HANDLERS ---------- */

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      stock_qty: "",
      category_id: "",
      supplier_id: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      stock_qty: product.stock_qty,
      category_id: product.category_id,
      supplier_id: product.supplier_id,
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });




  /* ---------- ADD / EDIT ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock_qty: Number(form.stock_qty),
      stock: Number(form.stock_qty) > 0 ? 1 : 0,
      category_id: Number(form.category_id),
      supplier_id: Number(form.supplier_id),
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await api.post("/products/", payload);
         toast.success("Product added successfully"); 
      }
      setShowModal(false);
      loadData();
    } catch {
      toast.error("Failed to save product");
      alert("Operation failed");
    }
  };



  
  /* ---------- DELETE ---------- */
  const confirmDelete = async () => {
  if (!productToDelete) return;

  try {
    await api.delete(`/products/${productToDelete.id}`);
    toast.success("Product deleted");
    loadData();
  } catch {
    toast.error("Failed to delete product");
  } finally {
    setShowDeleteModal(false);
    setProductToDelete(null);
  }
};
useEffect(() => {
  if (location.state?.fromPurchase) {
    toast.success("Inventory updated");
  }
}, []);


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    loadData();
  } catch {
    toast.error("Failed to delete product");
  }
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  /* ---------- UI ---------- */

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div  className="flex items-center justify-between bg-white
                p-4 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold">Products</h2>
        

        <div className="flex items-center gap-3">

          <input
      type="text"
      placeholder="Search product..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm w-90"
    />
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

{user.role === "admin" && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
)}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4"
          >
            <h3 className="text-lg font-semibold">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h3>

            <input name="name" value={form.name} onChange={handleChange}
              placeholder="Name" className="border w-full px-3 py-2 rounded" required />

            <input name="price" type="number" value={form.price} onChange={handleChange}
              placeholder="Price" className="border w-full px-3 py-2 rounded" required />

            <input name="stock_qty" type="number" value={form.stock_qty} onChange={handleChange}
              placeholder="Stock Qty" className="border w-full px-3 py-2 rounded" required />

            <select name="category_id" value={form.category_id} onChange={handleChange}
              className="border w-full px-3 py-2 rounded" required>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select name="supplier_id" value={form.supplier_id} onChange={handleChange}
              className="border w-full px-3 py-2 rounded" required>
              <option value="">Select supplier</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded">Cancel</button>
              <button type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

        {paginatedProducts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10
                          flex flex-col items-center justify-center
                          text-center space-y-3">
            <div className="text-5xl">📦</div>

            <h3 className="text-lg font-semibold">
              No products found
            </h3>

            <p className="text-slate-500 text-sm max-w-sm">
              Try adjusting your search or category filter, or add a new product.
            </p>

            <button
              onClick={openAddModal}
              className="mt-3 bg-blue-600 text-white
                        px-5 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Product
            </button>
          </div>
        )}

              {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((p) => {
          const status = getStatus(p.stock_qty);
          return (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-sm
             hover:shadow-lg hover:-translate-y-1
             transition-all duration-200
             flex flex-col justify-between">
              <div className="flex justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                <span  className={`text-xs px-3 py-1 rounded-full font-semibold
                        ring-1 ring-inset ${
                          status.label === "In Stock"
                            ? "bg-green-50 text-green-700 ring-green-200"
                            : status.label === "Low Stock"
                            ? "bg-yellow-50 text-yellow-700 ring-yellow-200"
                            : "bg-red-50 text-red-700 ring-red-200"
                        }`}>
                  {status.label}
                </span>
              </div>

              <p className="text-sm text-slate-500">{getCategoryName(p.category_id)}</p>
              <div className="w-full h-28 bg-slate-100 rounded-xl mb-3
                flex items-center justify-center text-slate-400">
                            Image
                          </div>


              <div className="flex justify-between mt-4">
                <p>₹{p.price}</p>
                <p>Qty: {p.stock_qty}</p>
              </div>

              <div className="flex gap-2 mt-4">
                {user.role === "admin" && (
                <button onClick={() => openEditModal(p)}
                  className="flex-1 rounded-lg border
               border-blue-600 text-blue-600
               hover:bg-blue-50 py-1.5 text-sm">
                  Edit
                </button>
                )}

               {user.role === "admin" && (
                <button onClick={() => {
                        setProductToDelete(p);
                        setShowDeleteModal(true);
                      }}
                      className="flex-1 border border-red-600 text-red-600 rounded py-1
                                hover:bg-red-50">
                  Delete
                </button>
               )} 
              </div>
            </div>
          );
        })}
      </div>


      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6">
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === i + 1
            ? "bg-blue-600 text-white"
            : "hover:bg-slate-100"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

{showDeleteModal && (
  <div className="fixed inset-0 bg-black/40
                  flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md
                    shadow-xl animate-fade-in">

      <h3 className="text-lg font-semibold text-red-600">
        Delete Product
      </h3>

      <p className="mt-2 text-slate-600 text-sm">
        Are you sure you want to delete
        <span className="font-semibold"> {productToDelete?.name}</span>?
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-lg
                     hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}






    </div>
  );
}
