import { useState, useEffect } from "react";
import { getProducts } from "../../api/products.api";
import { Loader2, Search, ShoppingBag, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      const data = res.data?.content || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setProducts(data);
      } else {
        setProducts([
          { id: 1, name: "Moroccanoil Treatment", price: 3500, stock: 24, description: "Silky, shiny, healthy hair in a bottle." },
          { id: 2, name: "Olaplex No.7 Bonding Oil", price: 2800, stock: 5, description: "Highly concentrated, weightless styling oil." },
          { id: 3, name: "Kerastase Nutritive Shampoo", price: 2200, stock: 12, description: "Nourishing shampoo for dry, sensitized hair." },
          { id: 4, name: "Luxury Styling Clay", price: 1800, stock: 0, description: "Strong hold with a matte finish." },
        ]);
      }
    } catch (err) {
      console.error(err);
      setProducts([
        { id: 1, name: "Moroccanoil Treatment", price: 3500, stock: 24, description: "Silky, shiny, healthy hair in a bottle." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const term = (searchTerm || "").toLowerCase();
    return (p.name || "").toLowerCase().includes(term) || (p.description || "").toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Salon Retail Store</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Maintain your salon-perfect look at home with our curated selection of professional beauty products.</p>
        </div>

        <div className="bg-white p-4 rounded-full border border-gray-200 shadow-sm flex items-center gap-4 mb-12 max-w-xl mx-auto relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <Search className="w-5 h-5 absolute left-6 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search products or brands..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 bg-transparent text-sm font-medium focus:outline-none placeholder-gray-400"
          />
        </div>

        {loading ? (
             <div className="py-24 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-600" />
               <p className="font-medium">Loading products...</p>
             </div>
        ) : filteredProducts.length === 0 ? (
             <div className="py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
               <ShoppingBag className="w-12 h-12 mb-4 text-gray-300" />
               <p className="font-medium">No products found matching your search.</p>
             </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            {filteredProducts.map((product, idx) => (
               <div key={product.id || idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col group relative overflow-hidden">
                  <div className="absolute top-4 left-4 z-10">
                     <span className="inline-block py-1 px-2.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-bold tracking-widest uppercase">
                        {product.brand || "PRODUCT"}
                     </span>
                  </div>

                  <div className="w-full h-48 bg-gray-50 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-primary-50/50 transition-colors">
                     <ShoppingBag className="w-16 h-16 text-gray-300 group-hover:text-primary-200 transition-colors" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2">
                     {product.description || "Professional grade hair and skin care product."}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                     <div>
                        <span className="block text-2xl font-extrabold text-gray-900">₹{product.price}</span>
                        {product.stock > 0 ? (
                           <span className="flex items-center gap-1 mt-1 text-xs font-semibold text-green-600">
                              <CheckCircle2 className="w-3 h-3" /> In Stock
                           </span>
                        ) : (
                           <span className="flex items-center gap-1 mt-1 text-xs font-semibold text-red-500">
                              Out of Stock
                           </span>
                        )}
                     </div>
                     <button 
                        disabled={product.stock <= 0}
                        className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary-600 hover:scale-110 shadow-lg shadow-gray-900/20 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:scale-100 disabled:shadow-none"
                     >
                        <ArrowRight className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
