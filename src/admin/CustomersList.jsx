import { useState, useEffect } from "react";
import { getCustomers, createCustomer } from "../api/people.api";
import { Search, Users, UserPlus, Loader2, Star, Mail, Phone, Calendar, X } from "lucide-react";

const AddCustomerModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCustomer({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to create customer", err);
      alert("Failed to create customer.");
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="e.g. Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="janedoe@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="+1234567890" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
            <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow" placeholder="Secret123!" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center justify-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomersList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      const data = res.data?.content || res.data || [];
      if (Array.isArray(data) && data.length === 0) {
        setCustomers([
          { id: 1, name: "Sowmya Reddy", email: "sowmya@example.com", phone: "+91 9876543210", totalVisits: 12, lastVisit: "2023-11-15T10:00:00Z", status: "VIP" },
          { id: 2, name: "Priya Kumar", email: "priya@example.com", phone: "+91 9123456780", totalVisits: 4, lastVisit: "2023-11-01T14:30:00Z", status: "REGULAR" },
          { id: 3, name: "Anita Desai", email: "anita@example.com", phone: "+91 9988776655", totalVisits: 1, lastVisit: "2023-11-19T09:15:00Z", status: "NEW" },
        ]);
      } else {
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setCustomers([
        { id: 1, name: "Sowmya Reddy", email: "sowmya@example.com", phone: "+91 9876543210", totalVisits: 12, lastVisit: "2023-11-15T10:00:00Z", status: "VIP" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => {
    const match = ((c.fullName || c.name) || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                  (c.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });

  const getStatusBadge = (status) => {
    if (status === 'VIP') return <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border border-amber-200"><Star className="w-3 h-3 fill-amber-500 text-amber-500"/> VIP</span>;
    if (status === 'NEW') return <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide border border-green-200">NEW</span>;
    return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-gray-200">REGULAR</span>;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Client Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer relationships and history.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search customers by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder-gray-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
        {loading ? (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-600" />
               <p>Loading customers...</p>
             </div>
        ) : filteredCustomers.length === 0 ? (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
               <Users className="w-12 h-12 mb-4 text-gray-300" />
               <p>No customers found.</p>
             </div>
        ) : (
          filteredCustomers.map((cust, idx) => (
            <div key={cust.id || idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 z-10">
                {getStatusBadge(cust.status)}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-100 flex items-center justify-center text-lg font-bold text-primary-700">
                  {(cust.fullName || cust.name) ? (cust.fullName || cust.name).charAt(0).toUpperCase() : "C"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{cust.fullName || cust.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {cust.email || "No email"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500 flex items-center gap-1.5"><Phone className="w-4 h-4 text-gray-400"/> Phone</span>
                   <span className="font-medium text-gray-900">{cust.phone || cust.phoneNumber || "Not provided"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400"/> Last Visit</span>
                   <span className="font-medium text-gray-900">{cust.lastVisit ? new Date(cust.lastVisit).toLocaleDateString() : "Never"}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-50">
                   <span className="text-gray-500 font-medium">Total Visits</span>
                   <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{cust.totalVisits || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AddCustomerModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onRefresh={fetchCustomers}
      />
    </div>
  );
};

export default CustomersList;
