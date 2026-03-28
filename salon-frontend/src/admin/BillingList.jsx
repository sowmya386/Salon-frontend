import { useState, useEffect } from "react";
import { getInvoices } from "../api/billing.api";
import { Plus, Search, Receipt, Loader2, IndianRupee, Printer, Download, CheckCircle2, Clock } from "lucide-react";
import { downloadInvoicePdf } from "../utils/pdfGenerator";

const BillingList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices();
      const data = res.data?.content || res.data || [];
      if (Array.isArray(data) && data.length === 0) {
        setInvoices([
          { invoiceId: 1, paymentMode: "CASH", totalAmount: 4500, createdAt: "2023-11-20T10:30:00", customerName: "Sowmya Reddy" },
          { invoiceId: 2, paymentMode: "UPI", totalAmount: 12500, createdAt: "2023-11-20T14:45:00", customerName: "Priya Kumar" },
          { invoiceId: 3, paymentMode: "CARD", totalAmount: 800, createdAt: "2023-11-19T09:15:00", customerName: "Anita Desai" },
        ]);
      } else {
        setInvoices(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
      setInvoices([
        { invoiceId: 1, paymentMode: "CASH", totalAmount: 4500, createdAt: "2023-11-20T10:30:00", customerName: "Sowmya Reddy" },
        { invoiceId: 2, paymentMode: "UPI", totalAmount: 12500, createdAt: "2023-11-20T14:45:00", customerName: "Priya Kumar" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const paymentMode = (inv.paymentMode || "").toString().toLowerCase();
    const invId = (inv.invoiceId ?? inv.id ?? inv.invoiceNumber ?? "").toString().toLowerCase();
    const custName = (inv.customerName || inv.customer?.name || "").toLowerCase();

    const searchTermLower = searchTerm.toLowerCase();
    const searchMatch = invId.includes(searchTermLower) || paymentMode.includes(searchTermLower) || custName.includes(searchTermLower);
    const statusMatch = statusFilter === "ALL" || (inv.paymentMode || "") === statusFilter;
    return searchMatch && statusMatch;
  });

  const getStatusBadge = (paymentMode) => {
    const label = paymentMode ? paymentMode : "PAID";
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5" /> {label}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Billing & Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage payments, create invoices, and print receipts.</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
         <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl shadow-lg shadow-primary-900/20 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-primary-100 text-sm font-medium mb-1">Total Revenue (Monthly)</p>
              <h3 className="text-3xl font-bold">₹1,45,000</h3>
            </div>
            <Receipt className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-medium mb-1">Pending Payments</p>
            <h3 className="text-3xl font-bold text-gray-900">₹12,500</h3>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center border-dashed border-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <IndianRupee className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-sm font-semibold text-gray-600">Quick Payment Link</p>
         </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 relative animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
        <div className="relative w-full sm:w-2/3">
           <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
           <input 
             type="text" 
             placeholder="Search by ID or customer..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white hover:bg-white transition-all shadow-sm"
           />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-1/3 py-2 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-white transition-all cursor-pointer shadow-sm"
        >
          <option value="ALL">All Payment Modes</option>
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 delay-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-700 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-gray-300" />
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <Receipt className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv, idx) => {
                  const custName = inv.customerName || inv.customer?.name || "Customer";
                  const time = new Date(inv.createdAt || inv.date || new Date()).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });

                  return (
                    <tr key={inv.invoiceId || inv.id || idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-gray-900">{inv.invoiceId || inv.id || inv.invoiceNumber}</td>
                      <td className="px-6 py-4 font-medium text-gray-700">{custName}</td>
                      <td className="px-6 py-4 text-gray-500">{time}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{inv.totalAmount ?? inv.amount}</td>
                      <td className="px-6 py-4">
                        {getStatusBadge(inv.paymentMode)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => downloadInvoicePdf(inv)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-200" title="Download PDF">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Print">
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingList;
