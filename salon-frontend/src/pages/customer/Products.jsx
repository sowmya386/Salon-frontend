import { useState, useEffect } from "react";
import { getProducts } from "../../api/products.api";
import { Loader2, Search, ShoppingBag, ArrowRight, CheckCircle2, ShoppingCart, X, Plus, Minus, MapPin, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Cart & Checkout State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0=cart, 1=address, 2=payment, 3=success
  
  const [checkoutData, setCheckoutData] = useState({
    address: "",
    paymentMethod: "PhonePe"
  });

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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="bg-white p-4 rounded-full border border-gray-200 shadow-sm flex items-center gap-4 w-full sm:max-w-xl relative">
            <Search className="w-5 h-5 absolute left-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products or brands..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-transparent text-sm font-medium focus:outline-none placeholder-gray-400"
            />
          </div>
          <button 
            onClick={() => { setIsCartOpen(true); setCheckoutStep(0); }}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-gray-800 transition-all font-bold"
          >
            <ShoppingCart className="w-5 h-5"/> 
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
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
                        onClick={() => {
                          const existing = cart.find(c => c.id === product.id);
                          if(existing) {
                            setCart(cart.map(c => c.id === product.id ? {...c, quantity: c.quantity + 1} : c));
                          } else {
                            setCart([...cart, { ...product, quantity: 1 }]);
                          }
                          setIsCartOpen(true);
                          setCheckoutStep(0);
                        }}
                        disabled={product.stock <= 0}
                        className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary-600 hover:scale-110 shadow-lg shadow-gray-900/20 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:hover:scale-100 disabled:shadow-none"
                     >
                        <Plus className="w-5 h-5" />
                     </button>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>

      {/* Slide-out Cart & Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
               <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                 {checkoutStep === 0 && <><ShoppingCart className="w-6 h-6"/> Your Cart</>}
                 {checkoutStep === 1 && <><MapPin className="w-6 h-6"/> Shipping Details</>}
                 {checkoutStep === 2 && <><CreditCard className="w-6 h-6"/> Payment</>}
                 {checkoutStep === 3 && <><CheckCircle2 className="w-6 h-6 text-green-500"/> Order Placed</>}
               </h2>
               <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><X className="w-6 h-6"/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {checkoutStep === 0 && (
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                         <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                           <ShoppingBag className="w-6 h-6 text-gray-300" />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                           <p className="text-primary-600 font-extrabold text-sm mb-2">₹{item.price}</p>
                           <div className="flex items-center gap-3">
                             <button onClick={() => {
                               const newCart = cart.map(c => c.id === item.id ? {...c, quantity: Math.max(0, c.quantity - 1)} : c).filter(c => c.quantity > 0);
                               setCart(newCart);
                             }} className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200">-</button>
                             <span className="font-bold text-sm">{item.quantity}</span>
                             <button onClick={() => {
                               setCart(cart.map(c => c.id === item.id ? {...c, quantity: c.quantity + 1} : c));
                             }} className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-200">+</button>
                           </div>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                    <textarea 
                      required
                      placeholder="123 Salon Avenue, Suite 400..."
                      value={checkoutData.address}
                      onChange={e => setCheckoutData({...checkoutData, address: e.target.value})}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 shadow-sm outline-none"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Payment Method</label>
                  {['PhonePe', 'Google Pay', 'Card', 'Cash on Delivery'].map(method => (
                    <label key={method} className={`block rounded-2xl border ${checkoutData.paymentMethod === method ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-opacity-20' : 'bg-white border-gray-100'} p-4 cursor-pointer transition-all`}>
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="payMethod" 
                          value={method}
                          checked={checkoutData.paymentMethod === method}
                          onChange={e => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                          className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        />
                        <span className="font-bold text-gray-900">{method}</span>
                      </div>
                    </label>
                  ))}
                  
                  {['PhonePe', 'Google Pay'].includes(checkoutData.paymentMethod) && (
                    <div className="mt-6 p-4 bg-white border border-gray-200 border-dashed rounded-xl text-center">
                      <p className="text-sm font-medium text-gray-500 mb-3">Scan to Pay via {checkoutData.paymentMethod}</p>
                      <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-bold block">QR CODE Mock</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-3">This is a simulated UI flow. No real money will be charged.</p>
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h3>
                  <p className="text-gray-500 mb-8 max-w-[250px]">Your premium products will be delivered to your address shortly.</p>
                  <button onClick={() => { setCart([]); setIsCartOpen(false); setCheckoutStep(0); }} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">Continue Shopping</button>
                </div>
              )}
            </div>

            {/* Cart Footer / Totals */}
            {checkoutStep < 3 && cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-xl font-extrabold text-gray-900 flex flex-col items-end">
                     ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                     <span className="text-xs text-gray-400 font-medium">Taxes included</span>
                  </span>
                </div>
                
                <div className="flex gap-3">
                  {checkoutStep > 0 && (
                    <button onClick={() => setCheckoutStep(checkoutStep - 1)} className="w-1/3 py-4 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">Back</button>
                  )}
                  <button 
                    disabled={checkoutStep === 1 && !checkoutData.address.trim()}
                    onClick={() => {
                      if(checkoutStep < 2) setCheckoutStep(checkoutStep + 1);
                      else setCheckoutStep(3); // process order
                    }} 
                    className={`flex-1 py-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 disabled:bg-gray-300 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2`}
                  >
                    {checkoutStep === 0 ? "Proceed to Checkout" : checkoutStep === 1 ? "Proceed to Payment" : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
