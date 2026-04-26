import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getApprovedSalons } from "../../api/auth.api";
import { MapPin, Star, Search, Loader2 } from "lucide-react";

const Salons = () => {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    getApprovedSalons()
      .then(res => {
        setSalons(res.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredSalons = salons.filter(salon => {
    const matchesSearch = salon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (salon.city && salon.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "ALL" || salon.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["ALL", ...new Set(salons.map(s => s.category).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Discover Premium Salons</h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
          Find and book appointments at the best salons near you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by salon name or city..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48 px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm transition-all cursor-pointer"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      ) : filteredSalons.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">No salons found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSalons.map((salon, idx) => (
            <div 
              key={salon.id} 
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="h-48 bg-gray-100 relative overflow-hidden">
                {/* Placeholder Image */}
                <img 
                  src={`https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                  alt={salon.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold line-clamp-1">{salon.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-200">
                    <MapPin className="w-4 h-4" />
                    <span>{salon.city || "Various Locations"}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                    {salon.category || "Salon"}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium text-gray-700">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                  {salon.description || "Experience premium grooming and styling services at our state-of-the-art facility."}
                </p>
                <Link 
                  to={`/salons/${salon.id}`}
                  className="w-full block text-center py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors shadow-md shadow-gray-900/10"
                >
                  View Details & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Salons;
