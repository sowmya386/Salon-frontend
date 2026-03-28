import { useState, useEffect } from "react";
import api from "../../api/axios";
import { User, Calendar, Receipt, Clock, MapPin, Loader2, CheckCircle2, Award, Sparkles, ChevronRight, ShoppingBag, Scissors, X, Save, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { downloadInvoicePdf } from "../../utils/pdfGenerator";
import PaymentMethods from "./PaymentMethods";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Edit Profile Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", profileImageUrl: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      // Fetch Profile
      const profileRes = await api.get("/customers/profile").catch(() => ({
        data: {
          fullName: "Guest User",
          email: "guest@example.com",
          phone: "+91 9999999999",
          salonName: "Default",
        },
      }));
      setProfile(profileRes.data);
      setEditForm({ 
        fullName: profileRes.data.fullName || "", 
        phone: profileRes.data.phone || "",
        profileImageUrl: profileRes.data.profileImageUrl || "" 
      });

      // Fetch Bookings
      const bookingsRes = await api.get("/customers/bookings").catch(() => ({ data: [] }));
      const bks = bookingsRes.data?.content || bookingsRes.data || [];
      setBookings(Array.isArray(bks) ? bks : []);

      // Fetch Invoices
      const invoicesRes = await api.get("/customers/invoices").catch(() => ({ data: [] }));
      const invs = invoicesRes.data?.content || invoicesRes.data || [];
      setInvoices(Array.isArray(invs) ? invs : []);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/customers/profile", editForm);
      setProfile(res.data);
      setIsEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. " + (err.response?.data?.message || ""));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  // --- GAMIFICATION LOGIC ---
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const totalVisits = bookings.length;
  let currentTier = "Bronze";
  let nextTier = "Silver";
  let targetVisits = 5;

  if (totalVisits >= 5 && totalVisits < 10) { currentTier = "Silver"; nextTier = "Gold"; targetVisits = 10; }
  else if (totalVisits >= 10 && totalVisits < 20) { currentTier = "Gold"; nextTier = "Platinum"; targetVisits = 20; }
  else if (totalVisits >= 20) { currentTier = "Platinum"; nextTier = "Diamond"; targetVisits = 50; }

  const progressPercent = Math.min(100, Math.round((totalVisits / targetVisits) * 100));
  
  const upcomingBookings = bookings.filter(b => b.status === "BOOKED" && new Date(b.appointmentTime) > new Date()).sort((a,b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
  const nextAppointment = upcomingBookings[0];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <User className="w-4 h-4" /> },
    { id: 'bookings', name: 'My Bookings', icon: <Calendar className="w-4 h-4" /> },
    { id: 'invoices', name: 'My Invoices', icon: <Receipt className="w-4 h-4" /> },
    { id: 'payments', name: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
      
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-gray-200 pb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-lg"
            )}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[50vh]">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* dynamic greeting hero banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white p-8 md:p-12 shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20 shadow-inner shrink-0 relative overflow-hidden">
                    {profile?.profileImageUrl ? (
                      <img src={profile.profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    )}
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{greeting}, {profile?.fullName?.split(' ')[0] || 'Guest'} <Sparkles className="inline w-6 h-6 text-primary-400 mb-1" /></h1>
                    <p className="text-gray-300 font-medium mb-6 text-lg">{profile?.email} • {profile?.phone}</p>
                    
                    {/* Gamification Stats */}
                    <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                        <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 flex flex-col items-center md:items-start">
                          <div className="flex gap-2 items-center mb-1">
                            <Award className="w-5 h-5 text-primary-400" />
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loyalty Progress</p>
                          </div>
                          <div className="flex items-center gap-3 w-full mt-1">
                            <p className="text-white font-bold text-sm tracking-wide">{currentTier}</p>
                            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                               <div className="h-full bg-gradient-to-r from-primary-600 to-amber-400 rounded-full duration-1000 ease-out transition-all" style={{ width: `${progressPercent}%` }}></div>
                            </div>
                            <p className="text-gray-400 font-bold text-xs">{totalVisits}/{targetVisits}</p>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-1.5">{targetVisits - totalVisits} visits to {nextTier} tier!</p>
                        </div>
                    </div>
                  </div>
                  <div className="shrink-0 pt-4 md:pt-0">
                    <button onClick={() => setIsEditOpen(true)} className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 w-full md:w-auto">Edit Profile</button>
                  </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Highlight Upcoming Appointment */}
              <div className="lg:col-span-1 bg-gradient-to-br from-primary-50 to-amber-50 rounded-3xl p-6 border border-primary-100 shadow-sm relative overflow-hidden group">
                 <Calendar className="absolute -bottom-4 -right-4 w-24 h-24 text-primary-100 group-hover:scale-110 transition-transform duration-500" />
                 <h3 className="font-extrabold text-primary-900 mb-4 tracking-tight flex items-center gap-2"><Clock className="w-5 h-5"/> Next Appointment</h3>
                 {nextAppointment ? (
                    <div className="relative z-10">
                       <p className="text-lg font-bold text-gray-900 mb-1">{nextAppointment.serviceName}</p>
                       <p className="text-primary-700 font-medium mb-4">{new Date(nextAppointment.appointmentTime).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                       <span className="inline-flex items-center gap-1 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">Confirmed</span>
                    </div>
                 ) : (
                    <div className="relative z-10">
                       <p className="text-sm text-gray-600 mb-4 font-medium">No upcoming appointments. Treat yourself today!</p>
                       <Link to="/portal/book" className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-primary-200 hover:bg-primary-50 transition-colors">Book Now <ChevronRight className="w-4 h-4"/></Link>
                    </div>
                 )}
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/portal/book" className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-2xl text-gray-700 group-hover:scale-110 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all duration-300">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">Book New</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">Schedule your next salon visit instantly.</p>
                    </div>
                </Link>
                
                <Link to="/products" className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-2xl text-gray-700 group-hover:scale-110 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all duration-300">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">Shop Retail</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">Buy professional grooming products online.</p>
                    </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary-500" />
              My Bookings
            </h2>
            <div className="space-y-4">
               {bookings.map(b => (
                  <div key={b.bookingId} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center hover:bg-white hover:shadow-md transition-all group">
                     <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{b.serviceName || "Service Appointment"}</h4>
                        <div className="flex items-center gap-4 text-sm tracking-wide mt-1">
                           <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-4 h-4"/> {new Date(b.appointmentTime).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                     </div>
                     <div>
                        {b.status === 'BOOKED' ? (
                           <div className="flex items-center gap-3">
                             <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-200 shadow-sm">Confirmed</span>
                             <button onClick={async () => {
                               if(!window.confirm("Are you sure you want to cancel this booking?")) return;
                               try {
                                  await api.put(`/customers/bookings/${b.bookingId || b.id}/cancel`);
                                  setBookings(bookings.map(bk => bk.bookingId === b.bookingId ? {...bk, status: 'CANCELLED'} : bk));
                               } catch (e) { alert("Failed to cancel."); }
                             }} className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full border border-red-200 transition-colors">Cancel</button>
                           </div>
                        ) : b.status === 'COMPLETED' ? (
                           <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-200 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5"/> Completed</span>
                        ) : b.status === 'CANCELLED' ? (
                           <div className="flex flex-col items-end gap-1">
                             <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-red-200 shadow-sm">Cancelled</span>
                             {b.cancellationMessage && <span className="text-xs text-red-500 font-medium">Reason: {b.cancellationMessage}</span>}
                           </div>
                        ) : (
                           <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-200 shadow-sm">{b.status}</span>
                        )}
                     </div>
                  </div>
               ))}
               {bookings.length === 0 && (
                 <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                   <p className="text-gray-500 font-medium">No bookings found.</p>
                   <Link to="/portal/book" className="text-primary-600 font-bold hover:underline mt-2 inline-block">Book an appointment</Link>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-amber-500" />
              Invoice History
            </h2>
            <div className="space-y-4">
               {invoices.map(inv => (
                  <div key={inv.invoiceId} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center hover:bg-white hover:shadow-md transition-all group">
                     <div>
                        <h4 className="font-bold text-gray-900">Order #{inv.invoiceId}</h4>
                        <div className="text-sm text-gray-500 mt-1">{new Date(inv.createdAt).toLocaleDateString()}</div>
                     </div>
                     <div className="text-right flex flex-col items-end gap-1">
                        <div className="font-extrabold text-gray-900 text-lg mb-1">₹{inv.totalAmount}</div>
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {inv.paymentMode || "PAID"}
                        </span>
                        <button onClick={() => downloadInvoicePdf({ ...inv, customer: profile })} className="mt-1 text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-md transition-colors">Download PDF</button>
                     </div>
                  </div>
               ))}
               {invoices.length === 0 && (
                 <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                   <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                   <p className="text-gray-500 font-medium">No invoices found.</p>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
           <PaymentMethods />
        )}

      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => !saving && setIsEditOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-primary-600"/> Edit Profile</h2>
              <button disabled={saving} onClick={() => setIsEditOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative group cursor-pointer">
                   {editForm.profileImageUrl ? (
                     <img src={editForm.profileImageUrl} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
                   )}
                   <input 
                     type="file" 
                     title="Upload Avatar"
                     accept="image/*"
                     className="absolute inset-0 opacity-0 cursor-pointer"
                     onChange={(e) => {
                       const file = e.target.files[0];
                       if (file) {
                         const reader = new FileReader();
                         reader.onloadend = () => {
                           setEditForm({...editForm, profileImageUrl: reader.result});
                         };
                         reader.readAsDataURL(file);
                       }
                     }}
                   />
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">Click to upload photo</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.fullName}
                  onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium transition-all shadow-sm"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone}
                  onChange={e => setEditForm({...editForm, phone: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium transition-all shadow-sm"
                  placeholder="+91 9999999999"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  disabled={saving}
                  onClick={() => setIsEditOpen(false)} 
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full py-3 premium-gradient text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
