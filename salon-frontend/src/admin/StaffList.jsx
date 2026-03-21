import { useState, useEffect } from "react";
import { getStaff } from "../api/people.api";
import { Search, UserCircle, Plus, Loader2, CalendarClock, Phone } from "lucide-react";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await getStaff();
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage personnel, roles, and schedules.</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
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
        ) : (
          staffList.map((staff, idx) => (
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
                  <button className="flex-1 py-2 text-sm font-semibold rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">Edit</button>
                  <button className="flex-1 py-2 text-sm font-semibold rounded-xl bg-gray-50 text-red-600 hover:bg-red-50 transition-colors">Suspend</button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffList;
