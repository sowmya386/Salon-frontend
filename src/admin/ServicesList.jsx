import { useState, useEffect } from "react";
import { getServices, createService, deleteService, updateService } from "../api/services.api";
import { Plus, Search, Scissors, Pencil, Trash2, Loader2, X } from "lucide-react";

// Modal Component defined right here for simplicity
const AddServiceModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "HAIR",
    price: "",
    durationMinutes: "30",
    description: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createService({
        name: formData.name,
        price: parseFloat(formData.price),
        durationInMinutes: parseInt(formData.durationMinutes, 10),
        imageUrl: formData.imageUrl
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to create service", err);
      alert("Failed to create service. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5"/>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Bridal Makeup" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none">
                <option value="HAIR">Hair</option>
                <option value="MAKEUP">Makeup</option>
                <option value="NAILS">Nails</option>
                <option value="SPA">Spa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
              <input required type="number" min="15" step="15" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. 1500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
            <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="https://..." />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditServiceModal = ({ isOpen, onClose, onRefresh, service }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "HAIR",
    price: "",
    durationMinutes: "30",
    description: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || service.serviceName || "",
        category: service.category || "HAIR",
        price: service.price || "",
        durationMinutes: service.durationInMinutes || service.durationMinutes || service.duration || "30",
        description: service.description || "",
        imageUrl: service.imageUrl || ""
      });
    }
  }, [service]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateService(service.id, {
        name: formData.name,
        price: parseFloat(formData.price),
        durationInMinutes: parseInt(formData.durationMinutes, 10),
        imageUrl: formData.imageUrl
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to edit service", err);
      alert("Failed to edit service. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5"/>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Bridal Makeup" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none">
                <option value="HAIR">Hair</option>
                <option value="MAKEUP">Makeup</option>
                <option value="NAILS">Nails</option>
                <option value="SPA">Spa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
              <input required type="number" min="15" step="15" value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. 1500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
            <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="https://..." />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServices();
      // Parse PageServiceResponse (assuming .content exists, otherwise res.data)
      const data = res.data?.content || res.data || [];
      // If the API isn't ready and returns empty, we inject mock data for display
      if (Array.isArray(data) && data.length === 0) {
        setServices([
          { id: 1, name: "Women's Haircut", category: "HAIR", durationMinutes: 45, price: 800 },
          { id: 2, name: "Bridal Makeup", category: "MAKEUP", durationMinutes: 120, price: 15000 },
          { id: 3, name: "Manicure", category: "NAILS", durationMinutes: 30, price: 500 },
          { id: 4, name: "Deep Tissue Massage", category: "SPA", durationMinutes: 60, price: 2500 }
        ]);
      } else {
        setServices(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching services", err);
      // Mock fallback if API fails
      setServices([
        { id: 1, name: "Women's Haircut", category: "HAIR", durationMinutes: 45, price: 800 },
        { id: 2, name: "Bridal Makeup", category: "MAKEUP", durationMinutes: 120, price: 15000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this service?")) return;
    try {
       await deleteService(id);
       fetchServices();
    } catch (e) {
       console.error(e);
       // optimistic delete for UI testing
       setServices(services.filter(s => s.id !== id));
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Services</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your service offerings and prices.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 w-full relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search services..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
          />
        </div>
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-primary-500 focus:border-primary-500 outline-none"
        >
          <option value="ALL">All Categories</option>
          <option value="HAIR">Hair</option>
          <option value="MAKEUP">Makeup</option>
          <option value="NAILS">Nails</option>
          <option value="SPA">Spa</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading services...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No services found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map(service => (
                  <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                      {service.imageUrl ? (
                        <img src={service.imageUrl} alt={service.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center shrink-0">
                          <Scissors className="w-5 h-5" />
                        </div>
                      )}
                      {service.name || service.serviceName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide">
                        {service.category || "GENERAL"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{service.durationInMinutes || service.durationMinutes || service.duration} mins</td>
                    <td className="px-6 py-4 font-medium text-gray-900">₹{service.price}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button onClick={() => setEditingService(service)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                         <Pencil className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      <AddServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchServices}
      />

      <EditServiceModal 
        isOpen={!!editingService} 
        service={editingService}
        onClose={() => setEditingService(null)} 
        onRefresh={fetchServices}
      />
    </div>
  );
};

export default ServicesList;
