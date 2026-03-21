import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Store, AlertCircle, Loader2 } from "lucide-react";
import { getPendingSalons, approveSalon, rejectSalon } from "../api/superadmin.api";

const SuperAdminDashboard = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const res = await getPendingSalons();
      setSalons(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load pending salons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(id);
      if (action === 'approve') {
        await approveSalon(id);
        setMessage("Salon approved successfully! They can now log in.");
      } else {
        await rejectSalon(id);
        setMessage("Salon registration rejected.");
      }
      // Remove from list
      setSalons(prev => prev.filter(s => s.id !== id));
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error(err);
      setMessage(`Failed to ${action} salon.`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salon Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage new salon registrations</p>
        </div>
        <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-amber-200">
          <AlertCircle className="w-4 h-4" />
          {salons.length} Pending
        </div>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-200 animate-in fade-in mb-6">
          {message}
        </div>
      )}

      {salons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 shadow-sm">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-bold text-gray-900 mb-1">No pending salons</p>
          <p className="text-sm">All registration requests have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salons.map(salon => (
            <div key={salon.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <Store className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{salon.name}</h3>
                  <p className="text-sm text-gray-500">Registered on {new Date(salon.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(salon.id, 'approve')}
                  disabled={actionLoading === salon.id}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2.5 rounded-xl text-sm font-bold border border-green-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {actionLoading === salon.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4"/>}
                  Approve
                </button>
                <button
                  onClick={() => handleAction(salon.id, 'reject')}
                  disabled={actionLoading === salon.id}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-xl text-sm font-bold border border-red-200 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {actionLoading === salon.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <XCircle className="w-4 h-4"/>}
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
