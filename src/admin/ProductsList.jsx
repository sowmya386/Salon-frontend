import { useState, useEffect } from "react";
import { getProducts, createProduct, deleteProduct, updateProduct } from "../api/products.api";
import { Plus, Search, Package, Pencil, Trash2, Loader2, X, AlertTriangle } from "lucide-react";

const AddProductModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stockQuantity: "10",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stockQuantity, 10),
        description: formData.description
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to create product", err);
      // alert("Failed to create product. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5"/>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="e.g. Argan Hair Oil" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="e.g. L'Oreal" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
              <input required type="number" min="0" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center justify-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditProductModal = ({ isOpen, onClose, onRefresh, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    stockQuantity: "10",
    description: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        price: product.price || "",
        stockQuantity: product.stock || "0",
        description: product.description || ""
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProduct(product.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stockQuantity, 10),
        description: formData.description
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to edit product", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-5 h-5"/>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="e.g. Argan Hair Oil" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="e.g. L'Oreal" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
              <input required type="number" min="0" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center justify-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      // Assume PageProductResponse format
      const data = res.data?.content || res.data || [];
      if (Array.isArray(data) && data.length === 0) {
        setProducts([
          { id: 1, name: "Moroccanoil Treatment", price: 3500, stock: 24, description: "" },
          { id: 2, name: "Olaplex No.7 Bonding Oil", price: 2800, stock: 5, description: "" },
          { id: 3, name: "Kerastase Shampoo", price: 2200, stock: 0, description: "" }
        ]);
      } else {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching products", err);
      // Fallback mock data for visual UI building
      setProducts([
        { id: 1, name: "Moroccanoil Treatment", price: 3500, stock: 24, description: "" },
        { id: 2, name: "Olaplex No.7 Bonding Oil", price: 2800, stock: 4, description: "" },
        { id: 3, name: "Kerastase Shampoo", price: 2200, stock: 12, description: "" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this product?")) return;
    try {
       await deleteProduct(id);
       fetchProducts();
    } catch (e) {
       console.error(e);
       setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    return (
      product.name?.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your retail products and stock alerts.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search products by name or description..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder-gray-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-gray-300" />
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    <Package className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{product.brand || "PRODUCT"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.stock > 10 ? (
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          In Stock ({product.stock})
                        </span>
                      ) : product.stock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-amber-200/50">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Low Stock ({product.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-red-200/50">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">₹{product.price}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button onClick={() => setEditingProduct(product)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                         <Pencil className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchProducts}
      />

      <EditProductModal 
        isOpen={!!editingProduct} 
        product={editingProduct}
        onClose={() => setEditingProduct(null)} 
        onRefresh={fetchProducts}
      />
    </div>
  );
};

export default ProductsList;
