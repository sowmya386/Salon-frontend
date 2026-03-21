import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Quote, ChevronRight, CheckCircle2, Instagram } from "lucide-react";
import { getServices } from "../../api/services.api";

const Home = () => {
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    // Fetch some services to show on the homepage
    getServices()
      .then(res => {
        const data = res.data?.content || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedServices(data.slice(0, 3));
        } else {
          // Fallback
          setFeaturedServices([
            { id: 1, name: "Signature Haircut & Styling", price: 1200, durationInMinutes: 60 },
            { id: 2, name: "Bridal Makeup Package", price: 15000, durationInMinutes: 180 },
            { id: 3, name: "Deep Tissue Massage", price: 2500, durationInMinutes: 60 },
          ]);
        }
      })
      .catch(() => {
         setFeaturedServices([
            { id: 1, name: "Signature Haircut & Styling", price: 1200, durationInMinutes: 60 },
            { id: 2, name: "Bridal Makeup Package", price: 15000, durationInMinutes: 180 },
            { id: 3, name: "Deep Tissue Massage", price: 2500, durationInMinutes: 60 },
          ]);
      });
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-black z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2674&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay z-0"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-10">
          <span className="inline-block py-1.5 px-4 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/20 text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(200,155,75,0.15)] hover:bg-primary-500/20 transition-colors cursor-default">
            Elevate Your Salon Empire
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-white drop-shadow-2xl">
            Discover Your <br className="hidden md:block" />
            <span className="premium-text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8126] animate-gradient-x">Perfect Style</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Experience premium grooming, expert styling, and luxurious spa treatments designed to bring out your absolute best.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
             <Link to="/portal/book" className="w-full sm:w-auto px-10 py-4 premium-gradient text-white rounded-full font-bold text-lg shadow-[0_0_40px_-5px_rgba(200,155,75,0.5)] transition-all hover:scale-105 flex items-center justify-center gap-3 border border-primary-400/50">
               Book Appointment <ArrowRight className="w-5 h-5"/>
             </Link>
             <Link to="/services" className="w-full sm:w-auto px-10 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/10 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-2xl flex items-center justify-center">
               Explore Services
             </Link>
          </div>
          
          {/* Floating Badges */}
          <div className="absolute top-1/4 -left-12 hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl animate-bounce" style={{animationDuration: '3s'}}>
             <div className="w-12 h-12 rounded-full premium-gradient flex items-center justify-center text-white">
                <Star className="w-6 h-6 fill-white" />
             </div>
             <div className="text-left">
                <p className="text-white font-bold text-lg">4.9/5</p>
                <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">Top Rated</p>
             </div>
          </div>
          <div className="absolute top-1/3 -right-16 hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
             <div className="text-right">
                <p className="text-white font-bold text-lg">10k+</p>
                <p className="text-gray-300 text-xs font-medium uppercase tracking-wider">Happy Clients</p>
             </div>
             <div className="w-12 h-12 rounded-full premium-gradient flex items-center justify-center text-white">
                <CheckCircle2 className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 z-10">
           <div className="w-8 h-12 rounded-full border-2 border-white flex justify-center p-2">
              <div className="w-1.5 h-3 bg-white rounded-full"></div>
           </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-28 bg-[#0a0a0a] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="text-center max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Signature <span className="premium-text-gradient">Treatments</span></h2>
              <p className="text-gray-400 text-lg md:text-xl">Curated luxury experiences delivered by our master stylists and therapists.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredServices.map((service, idx) => (
                 <div key={idx} className="group rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(200,155,75,0.15)] hover:border-primary-500/50 transition-all duration-500 relative overflow-hidden flex flex-col items-start justify-between min-h-[320px]">
                    <div className="absolute top-0 right-0 p-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                       <Link to="/portal/book" className="w-14 h-14 premium-gradient text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(200,155,75,0.5)] hover:scale-110 transition-transform">
                         <ChevronRight className="w-6 h-6" />
                       </Link>
                    </div>
                    
                    <div className="w-full">
                       <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/10 text-xs font-bold text-gray-300 mb-6 shadow-sm tracking-widest uppercase">
                         {service.category || 'PREMIUM'}
                       </span>
                       <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors leading-tight">{service.name}</h3>
                       
                       <ul className="space-y-3 mb-8">
                          <li className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" /> Premium products
                          </li>
                          <li className="flex items-center gap-3 text-sm text-gray-400 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" /> Expert consultation
                          </li>
                       </ul>
                    </div>

                    <div className="flex items-end gap-3 w-full border-t border-white/10 pt-6">
                       <span className="text-3xl font-black text-white">₹{service.price}</span>
                       <span className="text-sm font-bold text-gray-500 mb-1.5">/ {service.durationInMinutes ?? service.duration} mins</span>
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="mt-16 text-center">
              <Link to="/services" className="inline-flex items-center justify-center gap-3 px-8 py-3 rounded-full border border-primary-500/50 text-primary-400 font-bold hover:bg-primary-500 hover:text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(200,155,75,0.1)]">
                 View All Services <ArrowRight className="w-5 h-5" />
              </Link>
           </div>
        </div>
      </section>

      {/* Salon Photo Gallery */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Our <span className="premium-text-gradient">Masterpieces</span></h2>
              <p className="text-gray-500 text-lg md:text-xl">A glimpse into our world of expert styling, precise cuts, and flawless beauty transformations.</p>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
              <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden group relative shadow-xl">
                 <img src="https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=800&auto=format&fit=crop" alt="Premium Hair Styling" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="text-white">
                       <h4 className="text-xl font-bold">Premium Hair Styling</h4>
                       <p className="text-sm text-gray-300 flex items-center gap-1 mt-1"><Instagram className="w-3 h-3"/> @hyve.beauty</p>
                    </div>
                 </div>
              </div>
              <div className="rounded-3xl overflow-hidden group relative shadow-md">
                 <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop" alt="Bridal Makeup" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="row-span-2 rounded-3xl overflow-hidden group relative shadow-lg">
                 <img src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=400&auto=format&fit=crop" alt="Spa Treatment" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="rounded-3xl overflow-hidden group relative shadow-md">
                 <img src="https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&auto=format&fit=crop" alt="Color & Highlights" className="w-full h-full object-cover text-white transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="col-span-2 rounded-3xl overflow-hidden group relative shadow-lg">
                 <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800&auto=format&fit=crop" alt="Men's Grooming" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="rounded-3xl overflow-hidden group relative shadow-md bg-gray-900 flex items-center justify-center border border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer">
                 <div className="text-center">
                    <Instagram className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                    <span className="text-white font-bold text-sm">Follow us</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-secondary-600 text-white relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-secondary-600 to-secondary-500"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Loved by Clients</h2>
               <div className="flex justify-center gap-1">
                 {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-primary-500 text-primary-500" />)}
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="glass-dark p-8 rounded-3xl">
                  <Quote className="w-10 h-10 text-primary-500/50 mb-6" />
                  <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium">"Absolutely transformed my hair. The styling is impeccable and the ambiance of the salon feels like a retreat."</p>
                  <div>
                    <p className="font-bold text-white">Samantha R.</p>
                    <p className="text-sm text-gray-400">Regular Client</p>
                  </div>
               </div>
               <div className="glass-dark p-8 rounded-3xl hidden md:block">
                  <Quote className="w-10 h-10 text-primary-500/50 mb-6" />
                  <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium">"Their bridal makeup package was everything I dreamed of. Professional, punctual, and flawless execution."</p>
                  <div>
                    <p className="font-bold text-white">Priya M.</p>
                    <p className="text-sm text-gray-400">Bride</p>
                  </div>
               </div>
               <div className="glass-dark p-8 rounded-3xl hidden lg:block">
                  <Quote className="w-10 h-10 text-primary-500/50 mb-6" />
                  <p className="text-gray-300 text-lg leading-relaxed mb-6 font-medium">"Best deep tissue massage I've ever had. Recovered from a sports injury much faster thanks to their therapy."</p>
                  <div>
                    <p className="font-bold text-white">Arjun K.</p>
                    <p className="text-sm text-gray-400">Athlete</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Home;
