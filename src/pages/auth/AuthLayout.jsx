import { Outlet } from "react-router-dom";
import bgImage from "../../assets/login-bg.png";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left side Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative z-10 bg-white">
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Hyve <span className="premium-text-gradient">Beauty</span>
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Premium salon management & bookings.
            </p>
          </div>

          <Outlet />

        </div>
      </div>

      {/* Right side Image Cover */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <img 
          src={bgImage} 
          alt="Luxury Salon Interior" 
          className="absolute inset-0 w-full h-full object-cover rounded-l-3xl shadow-2xl"
        />
        {/* Decorative Quote or Badge */}
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white backdrop-blur-md bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl">
          <p className="text-xl font-medium leading-relaxed mb-4">
            "Elevating the salon experience, seamlessly blending technology with artistry."
          </p>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center">
               <span className="text-sm font-bold">H</span>
             </div>
             <div>
               <p className="text-sm font-bold">Hyve Manager</p>
               <p className="text-xs text-white/70">Next-gen platform</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
