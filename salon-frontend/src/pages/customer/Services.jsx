import { useState, useEffect } from "react";
import { getServices } from "../../api/services.api";
import { Loader2, Search, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await getServices();
      const data = res.data?.content || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
      } else {
        setServices([
          { id: 1, name: "Signature Haircut & Styling", price: 1200, durationInMinutes: 60 },
          { id: 2, name: "Keratin Smooth Treatment", price: 5500, durationInMinutes: 120 },
          { id: 3, name: "Bridal Makeup Package", price: 15000, durationInMinutes: 180 },
          { id: 4, name: "Deep Tissue Massage", price: 2500, durationInMinutes: 60 },
          { id: 5, name: "Deluxe Manicure", price: 800, durationInMinutes: 45 },
        ]);
      }
    } catch (err) {
      console.error(err);
      setServices([
        { id: 1, name: "Signature Haircut & Styling", price: 1200, durationInMinutes: 60 },
        { id: 2, name: "Bridal Makeup Package", price: 15000, durationInMinutes: 180 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(srv => {
    const term = (searchTerm || "").toLowerCase();
    const matchSearch = (srv.name || "").toLowerCase().includes(term) || 
                        (srv.description || "").toLowerCase().includes(term);
    const matchCategory = category === "ALL" || (srv.category || "") === category;
    return matchSearch && matchCategory;
  });

  const categories = ["ALL", ...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Our Services</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Explore our premium catalog of salon and spa treatments. Book your next appointment online instantly.</p>
        </div>

        <div className="bg-white p-4 rounded-full border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 mb-12 max-w-4xl mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          <div className="relative w-full sm:flex-1">
             <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input 
               type="text" 
               placeholder="Search treatments..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-transparent text-sm font-medium focus:outline-none placeholder-gray-400"
             />
          </div>
          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-64 py-3 px-4 bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>
            ))}
          </select>
        </div>

        {loading ? (
             <div className="py-24 flex flex-col items-center justify-center text-gray-400">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary-600" />
               <p className="font-medium">Loading our services...</p>
             </div>
        ) : filteredServices.length === 0 ? (
             <div className="py-24 flex flex-col items-center justify-center text-gray-400 bg-white rounded-3xl border border-gray-100 border-dashed">
               <Search className="w-12 h-12 mb-4 text-gray-300" />
               <p className="font-medium">No services found matching your criteria.</p>
             </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
            {filteredServices.map((service, idx) => (
               <div key={service.id || idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col group">
                  <div className="flex justify-between items-start mb-6">
                     <span className="inline-block py-1.5 px-3 rounded-full bg-primary-50 text-primary-700 border border-primary-100 text-xs font-bold tracking-wide">
                        {service.category || 'SERVICE'}
                     </span>
                     <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {service.durationInMinutes ?? service.duration} min
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{service.name}</h3>
                  <p className="text-gray-500 text-sm mb-8 flex-1 line-clamp-3 leading-relaxed">
                     {service.description || "Experience the ultimate pampering session tailored just for you by our professional team."}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                     <span className="text-3xl font-extrabold text-gray-900">₹{service.price}</span>
                     <Link to={`/portal/book?service=${service.id}`} className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-primary-600 hover:scale-110 shadow-lg shadow-gray-900/20 transition-all">
                        <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
