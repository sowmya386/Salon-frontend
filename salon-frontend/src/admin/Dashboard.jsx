import { useState, useEffect } from "react";
import { 
  Users, 
  CalendarDays, 
  IndianRupee,
  Loader2,
  TrendingUp,
  Activity
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { getDashboardSummary, getAdminBookings } from "../api/dashboard.api";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch summary stats and bookings in parallel
        const [summaryRes, bookingsRes] = await Promise.all([
          getDashboardSummary(),
          getAdminBookings({ size: 5 }) // fetch 5 recent bookings
        ]);
        
        setSummaryData(summaryRes.data);
        // Assuming Pageable structure, the items are usually in .content
        setAppointments(bookingsRes.data?.content || bookingsRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Assuming mock data for now.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fallbacks for UI if API changes or fails
  const data = summaryData || {};
  
  // Try to parse values from your DashboardSummaryResponse. Using defaults if undefined.
  const totalRevenue = data.totalRevenue || 0;
  const bookingsToday = data.bookingsToday || 0;
  const newCustomers = data.newCustomers ?? Math.max(0, (data.bookingsThisWeek || 0) - (data.bookingsToday || 0));

  // Mock revenue chart data (since the summary might just return a strict number, 
  // you may need to map an array from your API here like data.weeklyRevenue)
  const revenueChartData = data.weeklyRevenue || [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 5390 },
    { name: 'Sun', revenue: 6490 },
  ];

  const stats = [
    { 
      label: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      icon: IndianRupee, 
      trend: "+12.5%", 
      trendUp: true 
    },
    { 
      label: "Bookings Today", 
      value: bookingsToday.toString() || "14", 
      icon: CalendarDays, 
      trend: "+2", 
      trendUp: true 
    },
    { 
      label: "New Customers", 
      value: newCustomers.toString() || "6", 
      icon: Users, 
      trend: "-1", 
      trendUp: false 
    },
    { 
      label: "Business Health", 
      value: "Excellent", 
      icon: Activity, 
      trend: "Top 5%", 
      trendUp: true 
    },
  ];

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-600" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-gray-500 mt-2">Welcome back! Here's a snapshot of your salon empire.</p>
          {error && <p className="text-sm text-red-500 mt-3 bg-red-50 px-3 py-1.5 rounded-md inline-block border border-red-100 font-medium">{error}</p>}
        </div>
        <button className="px-5 py-2.5 premium-gradient text-white rounded-xl shadow-lg shadow-primary-500/30 hover:scale-105 hover:shadow-primary-500/50 transition-all font-bold text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4"/> Generate Report
        </button>
      </div>

      {/* Stat Cards - Mind-blowing UI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="relative group overflow-hidden bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(200,155,75,0.15)] transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-50 to-white border border-primary-100 flex items-center justify-center text-primary-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
            <div className={`mt-5 text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg inline-flex ${stat.trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              <span>{stat.trend}</span>
              <span className="text-gray-500 font-medium">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-[0_8px_40px_rgb(0,0,0,0.06)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 premium-gradient"></div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Revenue Analytics</h2>
              <p className="text-sm font-medium text-gray-500 mt-1">Weekly earning trajectory</p>
            </div>
            <select className="text-sm font-bold border-gray-200 rounded-xl text-gray-700 bg-white px-4 py-2 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm cursor-pointer transition-colors">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(200,155,75,0.05)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#colorUy)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={36}
                  animationDuration={1500}
                />
                <defs>
                  <linearGradient id="colorUy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#aa8126" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/40 shadow-[0_8px_40px_rgb(0,0,0,0.06)] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1 h-full premium-gradient"></div>
          <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-xl font-extrabold text-gray-900">Today's Schedule</h2>
               <p className="text-sm font-medium text-gray-500 mt-1">Upcoming VIP clients</p>
            </div>
            <button className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
          </div>
          
          <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {appointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center mt-10">No appointments scheduled.</p>
            ) : appointments.map((apt, idx) => {
              // Extract fields from BookingResponse payload 
              const customerName = apt.customerName || apt.customer?.name || "Unknown Customer";
              const serviceName = apt.serviceName || apt.service?.name || "Service";
              const status = apt.status || "Pending";
              const displayStatus = status === "BOOKED" ? "CONFIRMED" : status;
              // Attempt to format localDateTime or time string
              const timeString = apt.appointmentTime ? new Date(apt.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "10:00 AM";

              return (
                <div key={apt.bookingId || idx} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-[0_8px_30px_rgb(200,155,75,0.1)] group flex flex-col gap-3 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full premium-gradient text-white flex items-center justify-center font-bold shadow-md">
                          {customerName.charAt(0)}
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{customerName}</h3>
                         <p className="text-xs font-semibold text-gray-500 mt-0.5">{serviceName}</p>
                       </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-1 border-t border-gray-50 pt-3">
                    <div className="flex items-center text-xs text-gray-500 gap-1.5 font-bold">
                      <CalendarDays className="w-4 h-4 text-primary-400" />
                      {timeString}
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 uppercase tracking-widest rounded-md font-extrabold ${
                      displayStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      displayStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                      displayStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {displayStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
