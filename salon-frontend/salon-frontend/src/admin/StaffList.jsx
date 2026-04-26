import { useState, useEffect } from "react";
import { getStaff, createStaff, updateStaff, toggleStaffActive, deleteStaff, getPendingAdmins, approvePendingAdmin } from "../api/people.api";
import { Search, UserCircle, Plus, Loader2, CalendarClock, Phone, X, AlertTriangle } from "lucide-react";

const AddStaffModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "STYLIST",
    commissionPercent: "10"
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createStaff({
        ...formData,
        commissionPercent: parseInt(formData.commissionPercent, 10)
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to create staff", err);
      // alert("Failed to create staff.");
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Staff</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Jessica Smith" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="jessica@example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none">
                <option value="STYLIST">Stylist</option>
                <option value="MANAGER">Manager</option>
                <option value="RECEPTIONIST">Receptionist</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
              <input required type="number" min="0" max="100" value={formData.commissionPercent} onChange={e => setFormData({...formData, commissionPercent: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Password</label>
              <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="Secret123!" />
            </div>
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center justify-center">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Staff"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditStaffModal = ({ isOpen, onClose, onRefresh, staff }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "STYLIST",
    commissionPercent: "10"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        phone: staff.phone || "",
        role: staff.role || "STYLIST",
        commissionPercent: staff.commissionPercent != null ? String(staff.commissionPercent) : "0"
      });
    }
  }, [staff]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateStaff(staff.id, {
        ...formData,
        commissionPercent: parseInt(formData.commissionPercent, 10)
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to edit staff", err);
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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Staff Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Jessica Smith" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="+1234567890" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none">
                <option value="STYLIST">Stylist</option>
                <option value="MANAGER">Manager</option>
                <option value="RECEPTIONIST">Receptionist</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commission (%)</label>
            <input required type="number" min="0" max="100" value={formData.commissionPercent} onChange={e => setFormData({...formData, commissionPercent: e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" />
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

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const [res, pendingRes] = await Promise.all([
        getStaff(),
        getPendingAdmins()
      ]);
      
      const pData = pendingRes.data || [];
      setPendingAdmins(pData);

      const data = res.data?.content || res.data || [];
      if (Array.isArray(data) && data.length === 0) {
        setStaffList([
          { id: 1, name: "Jessica Smith", role: "Senior Stylist", phone: "+91 9876543210", shift: "Morning (9AM - 2PM)", active: true },
          { id: 2, name: "David Chen", role: "Color Specialist", phone: "+91 9123456780", shift: "Full Day (10AM - 6PM)", active: true },
          { id: 3, name: "Emily Blunt", role: "Makeup Artist", phone: "+91 9988776655", shift: "Evening (2PM - 8PM)", active: false },
        ]);
      } else {
        setStaffList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setStaffList([]);
      setPendingAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleToggleActive = async (id) => {
    if(!window.confirm("Are you sure you want to change this staff's status?")) return;
    try {
      await toggleStaffActive(id);
      fetchStaff();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveAdmin = async (id) => {
    if(!window.confirm("Approve this Admin for your salon? They will be granted full access immediately.")) return;
    try {
      await approvePendingAdmin(id);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to approve admin");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage personnel, roles, and schedules.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 mt-6">
        <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search staff by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder-gray-400"
        />
      </div>

      {pendingAdmins.length > 0 && (
        <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl animate-in fade-in">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Pending Administrator Approvals ({pendingAdmins.length})
          </h2>
          <div className="space-y-4">
            {pendingAdmins.map(admin => (
              <div key={admin.id} className="bg-white p-4 rounded-xl shadow-sm border border-yellow-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">{admin.fullName}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
                <button onClick={() => handleApproveAdmin(admin.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  Approve Admin
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 mt-6">
        {loading ? (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-600" />
               <p>Loading staff...</p>
             </div>
        ) : staffList.length === 0 ? (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
               <UserCircle className="w-12 h-12 mb-4 text-gray-300" />
               <p>No staff members found.</p>
             </div>
        ) : (() => {
          const filteredStaff = staffList.filter(s => 
            (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
            (s.email || "").toLowerCase().includes(searchTerm.toLowerCase())
          );
          return filteredStaff.length === 0 ? (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
               <UserCircle className="w-12 h-12 mb-4 text-gray-300" />
               <p>No staff members matching your search.</p>
             </div>
          ) : filteredStaff.map((staff, idx) => (
            <div key={staff.id || idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden">
                     <UserCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${staff.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${staff.active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    {staff.active ? 'ON DUTY' : 'OFF DUTY'}
                  </span>
               </div>
               
               <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{staff.name}</h3>
               <p className="text-sm text-primary-600 font-medium mb-4">
                 Commission: {staff.commissionPercent != null ? `${staff.commissionPercent}%` : "0%"}
               </p>
               
               <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                     <Phone className="w-4 h-4 text-gray-400" />
                     {staff.phone || "No phone"}
                  </div>
                  {staff.email ? (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="w-4 h-4 inline-flex items-center justify-center text-gray-400">@</span>
                      {staff.email}
                    </div>
                  ) : null}
               </div>
               
               <div className="mt-6 flex gap-2">
                  <button onClick={() => setEditingStaff(staff)} className="flex-1 py-2 text-sm font-semibold rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">Edit</button>
                  <button onClick={() => handleToggleActive(staff.id)} className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${staff.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                    {staff.active ? 'Suspend' : 'Activate'}
                  </button>
               </div>
            </div>
          ));
        })()}
      </div>

      <AddStaffModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onRefresh={fetchStaff}
      />

      <EditStaffModal 
        isOpen={!!editingStaff} 
        staff={editingStaff}
        onClose={() => setEditingStaff(null)} 
        onRefresh={fetchStaff}
      />
    </div>
  );
};

export default StaffList;
