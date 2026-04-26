import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { MapPin, Star, Clock, CalendarCheck, Info, Loader2 } from "lucide-react";

const SalonProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We mock fetching specific salon details and its services for now
    // In a real app, we'd have an endpoint like GET /salons/:id
    const fetchSalonData = async () => {
      try {
        const salonRes = await api.get('/salons');
        const salons = salonRes.data || [];
        const foundSalon = salons.find(s => s.id.toString() === id);
        
        if (foundSalon) {
          setSalon(foundSalon);
          // Fetch services specifically for this salon
          // (Mocking this request by hitting global services but filtering if backend supports it,
          // or just showing global services for demo)
          const servicesRes = await api.get('/public/services');
          setServices(servicesRes.data?.content || servicesRes.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSalonData();
  }, [id]);

  if (loading) {
    return <div className="min-h-[60vh] flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;
  }

  if (!salon) {
    return <div className="text-center py-20"><h2 className="text-2xl font-bold">Salon Not Found</h2></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Profile */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-12">
        <div className="h-64 bg-gray-900 relative">
          <img 
            src={salon.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
            alt={salon.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute bottom-8 left-8 text-white">
            <span className="px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3 inline-block">
              {salon.category || "Premium Salon"}
            </span>
            <h1 className="text-4xl font-extrabold mb-2">{salon.name}</h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {salon.city || "Multiple Locations"}</div>
              <div className="flex items-center gap-1.5 text-amber-400"><Star className="w-4 h-4 fill-current"/> 4.8 / 5.0 (124 reviews)</div>
            </div>
          </div>
        </div>
        <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2"><Info className="w-5 h-5 text-primary-600"/> About Us</h3>
            <p className="text-gray-600 leading-relaxed">
              {salon.description || "Welcome to our salon, where beauty meets relaxation. We offer a wide range of premium services designed to help you look and feel your absolute best. Our team of expert stylists and therapists use only top-tier products to ensure a magnificent experience."}
            </p>
          </div>
          <div className="w-full md:w-72 bg-gray-50 rounded-2xl p-6 border border-gray-100 shrink-0">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2"><Clock className="w-4 h-4"/> Opening Hours</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex justify-between"><span>Mon - Fri</span> <span className="font-medium text-gray-900">09:00 AM - 08:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span> <span className="font-medium text-gray-900">10:00 AM - 07:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span> <span className="font-medium text-primary-600">Closed</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Services List */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 pr-4">{service.name}</h3>
              <span className="text-xl font-extrabold text-primary-600 shrink-0">₹{service.price}</span>
            </div>
            <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3">{service.description || "A relaxing and rejuvenating service tailored just for you."}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5"><Clock className="w-4 h-4"/> {service.durationInMinutes || 45} mins</span>
              <button 
                onClick={() => navigate(`/portal/book?service=${service.id}&salon=${salon.id}`)}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" /> Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
      {services.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">No services listed yet for this salon.</p>
        </div>
      )}
    </div>
  );
};

export default SalonProfile;
