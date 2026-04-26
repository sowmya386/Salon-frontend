import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Plus, Trash2, Loader2, IndianRupee } from "lucide-react";

const CreateInvoiceModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    discount: 0,
    paymentMode: "CASH"
  });

  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/services"), // Admin gets services
      api.get("/products")  // Admin gets products
    ]).then(([svcsRes, prodRes]) => {
      setServices(svcsRes.data?.content || svcsRes.data || []);
      setProducts(prodRes.data?.content || prodRes.data || []);
    }).catch(err => console.error(err))
      .finally(() => setLoadingData(false));
  }, []);

  const addItem = (type, id) => {
    if (!id) return;
    const sourceList = type === 'SERVICE' ? services : products;
    const itemData = sourceList.find(i => i.id.toString() === id.toString());
    if (!itemData) return;
    
    // Check if already in list (for services, only 1 quantity allowed usually, products can have >1)
    const existing = items.find(i => i.itemId === id && i.itemType === type);
    if (existing) {
      if (type === 'PRODUCT') {
         setItems(items.map(i => i === existing ? {...i, quantity: i.quantity + 1} : i));
      }
    } else {
      setItems([...items, {
        itemType: type,
        itemId: id,
        name: itemData.name,
        price: itemData.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (idx, delta) => {
    const newItems = [...items];
    const item = newItems[idx];
    if (item.itemType === 'SERVICE') return; // Cannot change service quantity
    item.quantity += delta;
    if (item.quantity <= 0) newItems.splice(idx, 1);
    setItems(newItems);
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const taxable = subtotal - (Number(formData.discount) || 0);
  const gst = taxable * 0.18;
  const total = taxable + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Please add at least one item.");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post("/admin/invoices/manual", {
         customerName: formData.customerName,
         customerPhone: formData.customerPhone,
         discount: Number(formData.discount),
         paymentMode: formData.paymentMode,
         items: items.map(i => ({ itemType: i.itemType, itemId: i.itemId, quantity: i.quantity }))
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Manual Invoice</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500"/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Walk-in Customer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Phone (Optional)</label>
              <input type="tel" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" placeholder="Phone number" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Add Items</h3>
            <div className="flex gap-4">
              <select onChange={(e) => { addItem('SERVICE', e.target.value); e.target.value=''; }} className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="">
                <option value="" disabled>+ Add Service</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} - ₹{s.price}</option>)}
              </select>
              <select onChange={(e) => { addItem('PRODUCT', e.target.value); e.target.value=''; }} className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="">
                <option value="" disabled>+ Add Product</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>)}
              </select>
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 min-h-[150px]">
              {items.length === 0 ? <p className="text-gray-400 text-center py-4 text-sm font-medium">No items added yet</p> : (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div className="flex-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600 mr-2">{item.itemType}</span>
                        <span className="font-semibold text-gray-900 text-sm">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
                          <button type="button" onClick={() => updateQuantity(idx, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50" disabled={item.itemType === 'SERVICE'}>-</button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(idx, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-50" disabled={item.itemType === 'SERVICE'}>+</button>
                        </div>
                        <span className="font-bold text-gray-900 w-20 text-right">₹{item.price * item.quantity}</span>
                        <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
             <div className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (₹)</label>
                  <input type="number" min="0" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                  <select value={formData.paymentMode} onChange={e => setFormData({...formData, paymentMode: e.target.value})} className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none">
                     <option value="CASH">Cash</option>
                     <option value="CARD">Card / POS</option>
                     <option value="UPI">UPI</option>
                  </select>
               </div>
             </div>
             <div className="flex flex-col justify-end space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-red-500"><span>Discount:</span> <span>-₹{(Number(formData.discount) || 0).toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST (18%):</span> <span className="font-medium text-gray-900">₹{gst.toFixed(2)}</span></div>
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between items-center">
                   <span className="font-bold text-gray-900">Total:</span> 
                   <span className="text-2xl font-extrabold text-primary-600">₹{total.toFixed(2)}</span>
                </div>
             </div>
          </div>

          <div className="pt-4 flex gap-4 justify-end">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting || items.length === 0} className="px-6 py-2.5 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-lg disabled:bg-gray-300 disabled:text-gray-500 flex items-center gap-2">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <IndianRupee className="w-5 h-5" />}
              Generate Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
