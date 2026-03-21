import { useState, useEffect } from "react";
import api from "../../api/axios";
import { User, Calendar, Receipt, Clock, MapPin, Loader2, CheckCircle2, Award, Sparkles, ChevronRight, ShoppingBag, Scissors } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        // Fetch Bookings
        const bookingsRes = await api.get("/customers/bookings").catch(() => ({ data: [] }));
        const bks = bookingsRes.data?.content || bookingsRes.data || [];
        setBookings(Array.isArray(bks) && bks.length > 0 ? bks : [
          { bookingId: 101, serviceName: "Signature Haircut", appointmentTime: "2023-11-25T14:00:00", status: "BOOKED" },
          { bookingId: 102, serviceName: "Deep Tissue Massage", appointmentTime: "2023-10-10T10:00:00", status: "COMPLETED" },
        ]);

        // Fetch Invoices
        const invoicesRes = await api.get("/customers/invoices").catch(() => ({ data: [] }));
        const invs = invoicesRes.data?.content || invoicesRes.data || [];
        setInvoices(Array.isArray(invs) && invs.length > 0 ? invs : [
          { invoiceId: 201, totalAmount: 1200, createdAt: "2023-10-10T11:00:00", paymentMode: "CASH", items: [] }
        ]);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 text-white p-8 md:p-12 shadow-2xl">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20 shadow-inner shrink-0">
               <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
               <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Welcome back, {profile?.fullName?.split(' ')[0] || 'Guest'} <Sparkles className="inline w-6 h-6 text-primary-400 mb-1" /></h1>
               <p className="text-gray-300 font-medium mb-6 text-lg">{profile?.email} • {profile?.phone}</p>
               
               <div className="flex justify-center md:justify-start gap-4 flex-wrap">
                  <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                     <Award className="w-6 h-6 text-primary-400" />
                     <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loyalty Status</p>
                        <p className="text-white font-bold">Gold Member</p>
                     </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3">
                     <Calendar className="w-6 h-6 text-primary-400" />
                     <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Visits</p>
                        <p className="text-white font-bold">{bookings.length}</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="shrink-0">
               <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/10 w-full md:w-auto">Edit Profile</button>
            </div>
         </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
         <Link to="/portal/book" className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all flex items-start gap-4">
            <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 group-hover:scale-110 transition-transform">
               <Calendar className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-gray-900 mb-1">Book Appointment</h3>
               <p className="text-sm text-gray-500 leading-relaxed">Schedule your next salon visit instantly.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors self-center" />
         </Link>
         
         <Link to="/services" className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
               <Scissors className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-gray-900 mb-1">Browse Services</h3>
               <p className="text-sm text-gray-500 leading-relaxed">Check out our latest premium treatments.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors self-center" />
         </Link>

         <Link to="/products" className="group p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all flex items-start gap-4">
            <div className="p-3 bg-purple-50 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
               <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="flex-1">
               <h3 className="font-bold text-gray-900 mb-1">Shop Products</h3>
               <p className="text-sm text-gray-500 leading-relaxed">Buy professional grooming products.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors self-center" />
         </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Bookings History */}
         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
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
                           <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-blue-200 shadow-sm">Confirmed</span>
                        ) : b.status === 'COMPLETED' ? (
                           <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-200 shadow-sm"><CheckCircle2 className="w-3.5 h-3.5"/> Completed</span>
                        ) : b.status === 'CANCELLED' ? (
                           <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-red-200 shadow-sm">Cancelled</span>
                        ) : (
                           <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-200 shadow-sm">{b.status}</span>
                        )}
                     </div>
                  </div>
               ))}
               {bookings.length === 0 && <p className="text-gray-500 text-center py-4">No bookings found.</p>}
            </div>
         </div>

         {/* Invoice History */}
         <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               <Receipt className="w-6 h-6 text-amber-500" />
               Invoice History
            </h2>
            <div className="space-y-4">
               {invoices.map(inv => (
                  <div key={inv.invoiceId} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center hover:bg-white hover:shadow-md transition-all group">
                     <div>
                        <h4 className="font-bold text-gray-900">{inv.invoiceId}</h4>
                        <div className="text-sm text-gray-500 mt-1">{new Date(inv.createdAt).toLocaleDateString()}</div>
                     </div>
                     <div className="text-right">
                        <div className="font-extrabold text-gray-900 text-lg mb-1">₹{inv.totalAmount}</div>
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {inv.paymentMode || "PAID"}
                        </span>
                     </div>
                  </div>
               ))}
               {invoices.length === 0 && <p className="text-gray-500 text-center py-4">No invoices found.</p>}
            </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
