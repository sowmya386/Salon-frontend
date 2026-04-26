import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers/bookings");
      const bks = res.data?.content || res.data || [];
      setBookings(Array.isArray(bks) ? bks : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
         <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-primary-500" />
        My Bookings
      </h2>
      <div className="space-y-4">
         {[...bookings].sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)).map(b => (
            <div key={b.bookingId || b.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center hover:bg-white hover:shadow-md transition-all group">
               <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{b.serviceName || "Service Appointment"} <span className="text-sm font-normal text-gray-500 ml-2">@ {b.salonName || "Salon"}</span></h4>
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
                            setBookings(bookings.map(bk => (bk.bookingId || bk.id) === (b.bookingId || b.id) ? {...bk, status: 'CANCELLED'} : bk));
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
  );
};

export default MyBookings;
