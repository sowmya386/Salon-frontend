import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getServices } from "../../api/services.api";
import { Loader2, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedServiceId = searchParams.get("service");

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  
  const [formData, setFormData] = useState({
    serviceId: preSelectedServiceId || "",
    bookingDate: "",
    bookingTime: "10:00"
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getServices()
      .then(res => {
        const data = res.data?.content || res.data || [];
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setServices([
          { id: 1, name: "Signature Haircut & Styling", price: 1200, durationInMinutes: 60 },
          { id: 2, name: "Deep Tissue Massage", price: 2500, durationInMinutes: 60 },
          { id: 5, name: "Deluxe Manicure", price: 800, durationInMinutes: 45 },
        ]);
      })
      .finally(() => setLoadingServices(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // POST /customers/bookings
      // Backend expects: { serviceId: Long, appointmentTime: LocalDateTime }
      const appointmentTime = `${formData.bookingDate}T${formData.bookingTime}:00`;

      const payload = {
        serviceId: Number(formData.serviceId),
        appointmentTime,
      };

      await api.post("/customers/bookings", payload);
      setSuccess(true);
      setTimeout(() => navigate("/portal/profile"), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to book appointment. Please check availability.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedServiceDetails = services.find(s => s.id.toString() === formData.serviceId.toString());

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
           <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 font-medium">Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="bg-gray-900 px-8 py-10 text-white text-center">
           <h1 className="text-3xl font-extrabold mb-2">Book an Appointment</h1>
           <p className="text-gray-400">Select a service, choose a time, and prepare to be pampered.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm font-semibold border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Service Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">1. Select Service</label>
            {loadingServices ? (
              <div className="h-14 flex items-center px-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-400"><Loader2 className="w-5 h-5 animate-spin mr-3"/> Loading services...</div>
            ) : (
              <select 
                required
                value={formData.serviceId}
                onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all cursor-pointer shadow-sm appearance-none"
              >
                <option value="" disabled>Choose a treatment...</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (₹{s.price} - {s.durationInMinutes} mins)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Date & Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">2. Select Date</label>
               <div className="relative">
                 <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="date" 
                   required
                   value={formData.bookingDate}
                   onChange={(e) => setFormData({...formData, bookingDate: e.target.value})}
                   min={new Date().toISOString().split('T')[0]} // Cannot book in the past
                   className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm"
                 />
               </div>
            </div>
            
            <div className="space-y-4">
               <label className="block text-sm font-bold text-gray-900 uppercase tracking-wide">3. Select Time</label>
               <div className="relative">
                 <Clock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input 
                   type="time" 
                   required
                   value={formData.bookingTime}
                   onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}
                   className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-sm"
                 />
               </div>
            </div>
          </div>

          {/* Booking Summary */}
          {selectedServiceDetails && (
            <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex justify-between items-center animate-in slide-in-from-bottom-2">
               <div>
                  <h4 className="font-bold text-gray-900">Total Price</h4>
                  <p className="text-sm text-gray-500 font-medium">Includes taxes and fees</p>
               </div>
               <div className="text-3xl font-extrabold text-primary-700">₹{selectedServiceDetails.price}</div>
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <button 
               type="button" 
               onClick={() => navigate(-1)}
               className="w-full sm:w-1/3 border-2 border-gray-200 text-gray-600 rounded-xl py-4 font-bold text-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
             >
               Go Back
             </button>
             <button 
               type="submit" 
               disabled={submitting || !formData.serviceId || !formData.bookingDate}
               className="w-full sm:w-2/3 bg-gray-900 text-white rounded-xl py-4 font-bold text-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2"
             >
               {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Pay Later"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
