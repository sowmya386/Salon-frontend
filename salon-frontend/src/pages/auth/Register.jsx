import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { adminRegister, customerRegister, getApprovedSalons } from "../../api/auth.api";
import { User, Mail, Lock, Loader2, UserCircle, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";

const Register = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("CUSTOMER");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    salonName: "John Salon",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [salons, setSalons] = useState([]);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const res = await getApprovedSalons();
        setSalons(res.data);
      } catch (err) {
        console.error("Failed to fetch salons", err);
      }
    };
    fetchSalons();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "ADMIN") {
        await adminRegister({ 
          fullName: formData.fullName, 
          email: formData.email, 
          password: formData.password,
          salonName: formData.salonName
        });
        alert("Registration successful! Please login.");
        navigate("/login");
      } else {
        await customerRegister({
           fullName: formData.fullName, 
           email: formData.email, 
           password: formData.password,
           phone: formData.phone,
           salonName: formData.salonName
        });
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create an account</h2>
      <p className="text-sm text-gray-500 mt-2 mb-8">Join us to experience premium salon services.</p>

      {/* Role Tabs */}
      <div className="flex p-1 bg-gray-100/80 rounded-xl mb-8 border border-gray-200/60">
        <button
          type="button"
          onClick={() => { setActiveTab("CUSTOMER"); setError(""); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all",
            activeTab === "CUSTOMER" ? "bg-white text-primary-600 shadow-sm ring-1 ring-gray-900/5" : "text-gray-500 hover:text-gray-900"
          )}
        >
          <UserCircle className="w-5 h-5" /> Customer Sign Up
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab("ADMIN"); setError(""); }}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all",
            activeTab === "ADMIN" ? "bg-white text-secondary-600 shadow-sm ring-1 ring-gray-900/5" : "text-gray-500 hover:text-gray-900"
          )}
        >
          <ShieldCheck className="w-5 h-5" /> Register New Salon
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
          {error}
        </div>
      )}

      <button 
        type="button" 
        onClick={() => { window.location.href = "http://localhost:8081/oauth2/authorization/google"; }}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 mb-6 shadow-sm"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required
              type="text" 
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Sowmya Reddy"
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@email.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {activeTab === "CUSTOMER" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <div className="relative">
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full px-4 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>
        )}

        {activeTab === "ADMIN" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">New Salon Name</label>
            <input 
              required
              type="text" 
              value={formData.salonName}
              onChange={(e) => setFormData({...formData, salonName: e.target.value})}
              placeholder="E.g. The Glamour Studio"
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-2">This will register your unique salon workspace.</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20 mt-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign up"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Sign in here
        </Link>
      </p>
    </div>
  );
};

export default Register;
