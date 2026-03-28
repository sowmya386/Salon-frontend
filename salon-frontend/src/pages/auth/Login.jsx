import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { unifiedLogin } from "../../api/auth.api";
import { BASE_URL } from "../../api/axios";
import { setAuth } from "../../utils/auth";
import { Mail, Lock, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await unifiedLogin(formData);
      const token = res.data?.token;
      if (!token) throw new Error("Login did not return a token");
      
      try {
        let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        const payload = JSON.parse(atob(base64));
        const roles = payload.roles || [];
        
        if (roles.includes("ROLE_SUPER_ADMIN")) {
          setAuth(token, "SUPER_ADMIN");
          navigate("/super-admin/dashboard");
        } else if (roles.includes("ROLE_ADMIN")) {
          setAuth(token, "ADMIN");
          navigate("/admin/dashboard");
        } else {
          setAuth(token, "CUSTOMER");
          navigate("/portal");
        }
      } catch (err) {
        console.error("Token parse error", err);
        setAuth(token, "CUSTOMER");
        navigate("/portal");
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
      <p className="text-sm text-gray-500 mt-2 mb-8">Enter your details to access your account.</p>

      <button 
        type="button" 
        onClick={() => { window.location.href = BASE_URL.replace('/api', '/oauth2/authorization/google'); }}
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

      {error && (
        <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium mb-6 border border-red-200 shadow-sm animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</Link>
          </div>
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



        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
