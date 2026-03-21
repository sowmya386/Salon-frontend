import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { Scissors, Menu, X, Instagram, Facebook, Twitter, LogOut, User as UserIcon } from "lucide-react";
import { getToken, getRole, clearAuth } from "../utils/auth";
import { cn } from "../lib/utils";
import { useState } from "react";

const CustomerLayout = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const token = getToken();
  const role = getRole();
  const isAuthenticated = token && role === "CUSTOMER";

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/products" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 backdrop-blur-xl bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center -rotate-6 shadow-md shadow-primary-500/20 transition-transform group-hover:rotate-0">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">Hyve<span className="premium-text-gradient">Beauty</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 items-center justify-center space-x-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => cn(
                    "text-sm font-bold tracking-wide transition-all",
                    isActive ? "text-primary-600 scale-105" : "text-gray-600 hover:text-gray-900 hover:scale-105"
                  )}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4 justify-end min-w-[200px]">
              {isAuthenticated ? (
                <>
                  <Link to="/portal/profile" className="flex items-center gap-2 p-2 px-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-bold text-gray-700 transition-colors shadow-sm">
                    <UserIcon className="w-4 h-4" /> Profile
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 p-2 px-4 hover:bg-red-50 text-red-600 rounded-xl text-sm font-bold transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all shadow-sm">Log In</Link>
                  <Link to="/register" className="px-5 py-2.5 premium-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-105 hover:shadow-primary-500/50">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full animate-in slide-in-from-top-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => cn(
                  "block px-3 py-2 rounded-md text-base font-semibold",
                  isActive ? "bg-primary-50 text-primary-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/portal/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200">My Profile</Link>
                  <Link to="/portal/book" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-gray-900 text-white font-semibold rounded-xl shadow-lg">Book Now</Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="w-full text-center px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-gray-50 text-gray-900 font-semibold rounded-xl border border-gray-200">Log In</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-gray-900 text-white font-semibold rounded-xl shadow-lg shadow-gray-900/20">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-gray-50/50">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="bg-secondary-600 text-gray-300 py-16 px-6 sm:px-12 lg:px-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center -rotate-6 shadow-md shadow-primary-500/20 group-hover:rotate-0 transition-transform">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-primary-400 transition-colors">Hyve<span className="premium-text-gradient">Beauty</span></span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Experience the pinnacle of styling and grooming. Book your appointments, purchase premium products, and manage your beauty routine from one elegant platform.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="hover:text-white transition-colors">Our Services</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Shop Products</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Customer Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Connect With Us</h4>
            <div className="flex gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:-translate-y-1 transition-all"><Instagram className="w-4 h-4 text-white"/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:-translate-y-1 transition-all"><Facebook className="w-4 h-4 text-white"/></a>
               <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 hover:-translate-y-1 transition-all"><Twitter className="w-4 h-4 text-white"/></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
           &copy; {new Date().getFullYear()} John Salon. All rights reserved. Built with ❤️.
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
