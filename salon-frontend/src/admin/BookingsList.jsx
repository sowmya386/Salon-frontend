import { useState, useEffect } from "react";
import { getBookings, completeBooking, cancelBooking } from "../api/bookings.api";
import { Plus, Search, CalendarDays, Loader2, CheckCircle2, XCircle, Clock, MoreHorizontal, User } from "lucide-react";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getBookings();
      const data = res.data?.content || res.data || [];
      
      if (Array.isArray(data) && data.length === 0) {
        setBookings([
          { bookingId: 1, customerName: "Sarah Jenkins", serviceName: "Balayage Hair Color", status: "BOOKED", appointmentTime: "2023-11-20T10:00:00" },
          { bookingId: 2, customerName: "Priya Kumar", serviceName: "Bridal Makeup", status: "BOOKED", appointmentTime: "2023-11-20T11:30:00" },
          { bookingId: 3, customerName: "Amy Lin", serviceName: "Manicure", status: "COMPLETED", appointmentTime: "2023-11-19T14:00:00" },
          { bookingId: 4, customerName: "Emma Watson", serviceName: "Haircut", status: "CANCELLED", appointmentTime: "2023-11-21T09:00:00" },
        ]);
      } else {
         setBookings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setBookings([
        { bookingId: 1, customerName: "Sarah Jenkins", serviceName: "Balayage Hair Color", status: "BOOKED", appointmentTime: "2023-11-20T10:00:00" },
        { bookingId: 2, customerName: "Priya Kumar", serviceName: "Bridal Makeup", status: "BOOKED", appointmentTime: "2023-11-20T11:30:00" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      if (newStatus === "COMPLETED") await completeBooking(bookingId);
      if (newStatus === "CANCELLED") {
        const reason = window.prompt("Reason for cancellation:");
        if (reason === null) return; // user backed out
        await cancelBooking(bookingId, { message: reason });
      }
      
      // Optimistic update for UI feedback
      setBookings(bookings.map(b => (b.bookingId || b.id) === bookingId ? { ...b, status: newStatus } : b));
    } catch (e) {
       console.error(e);
       alert("Failed to update booking status.");
    }
  };

  const filteredBookings = bookings.filter(b => {
    const custName = (b.customerName || "").toLowerCase();
    const srvName = (b.serviceName || "").toLowerCase();
    const searchMatch = custName.includes(searchTerm.toLowerCase()) || srvName.includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "ALL" || b.status === statusFilter;
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-green-200"><CheckCircle2 className="w-3.5 h-3.5"/> Complete</span>;
      case 'BOOKED': return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-blue-200">Confirmed</span>;
      case 'CANCELLED': return <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-red-200"><XCircle className="w-3.5 h-3.5"/> Cancelled</span>;
      default: return <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-yellow-200"><Clock className="w-3.5 h-3.5"/> {status || "PENDING"}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule and manage customer bookings.</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 relative animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="relative w-full sm:w-2/3">
           <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search by customer or service..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-white focus:bg-white transition-all shadow-sm"
           />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/3 py-2 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-white transition-all cursor-pointer shadow-sm"
        >
          <option value="ALL">All Statuses</option>
          <option value="BOOKED">Booked</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-gray-300" />
                    Loading bookings...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <CalendarDays className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                    No appointments found.
                  </td>
                </tr>
              ) : (
                [...filteredBookings].sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)).map((booking, idx) => {
                  const custName = booking.customerName || "Walk-in";
                  const srvName = booking.serviceName || "Service";
                  const time = new Date(booking.appointmentTime || new Date()).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={booking.bookingId || idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{custName}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{srvName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleStatusUpdate(booking.bookingId, 'COMPLETED')} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-200" title="Mark Complete">
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleStatusUpdate(booking.bookingId, 'CANCELLED')} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="Cancel Booking">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsList;
