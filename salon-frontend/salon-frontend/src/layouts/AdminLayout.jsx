import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Scissors, 
  Package, 
  CalendarDays, 
  Receipt, 
  Users, 
  UserCircle, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { clearAuth } from "../utils/auth";
import { cn } from "../lib/utils";
import BotWidget from "../components/BotWidget";

const AdminLayout = ({ isSuperAdmin = false }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Services", icon: Scissors, path: "/admin/services" },
    { label: "Products", icon: Package, path: "/admin/products" },
    { label: "Bookings", icon: CalendarDays, path: "/admin/bookings" },
    { label: "Billing", icon: Receipt, path: "/admin/billing" },
    { label: "Customers", icon: Users, path: "/admin/customers" },
    { label: "Staff", icon: UserCircle, path: "/admin/staff" },
  ];

  const superAdminNavItems = [
    { label: "Approvals", icon: LayoutDashboard, path: "/super-admin/dashboard" },
  ];

  const activeNavItems = isSuperAdmin ? superAdminNavItems : navItems;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 sm:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed sm:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <NavLink to="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
            Hyve Manager
          </NavLink>
          <button 
            className="sm:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {activeNavItems.map((item) => (
             <NavLink
             key={item.path}
             to={item.path}
             onClick={() => setIsMobileMenuOpen(false)}
             className={({ isActive }) => cn(
               "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
               isActive 
                 ? "bg-primary-50 text-primary-700" 
                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
             )}
           >
             <item.icon className="w-5 h-5 shrink-0" />
             {item.label}
           </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden w-full">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="sm:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <NavLink to="/" className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline hidden sm:block">
              &larr; View Live Site
            </NavLink>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{isSuperAdmin ? "Super Admin" : "Admin User"}</p>
                <p className="text-xs text-gray-500">{isSuperAdmin ? "Global Access" : "Salon Manager"}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border border-primary-200">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </div>
        
        {/* Global Floating AI Assistant Widget */}
        <BotWidget />
      </main>
    </div>
  );
};

export default AdminLayout;
