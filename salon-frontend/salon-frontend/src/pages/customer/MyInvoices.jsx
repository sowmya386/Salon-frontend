import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Receipt, CheckCircle2, Loader2 } from "lucide-react";
import { downloadInvoicePdf } from "../../utils/pdfGenerator";

const MyInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers/invoices");
      const invs = res.data?.content || res.data || [];
      setInvoices(Array.isArray(invs) ? invs : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
         <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Receipt className="w-6 h-6 text-amber-500" />
        Invoice History
      </h2>
      <div className="space-y-4">
         {invoices.map(inv => (
            <div key={inv.invoiceId} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center hover:bg-white hover:shadow-md transition-all group">
               <div>
                  <h4 className="font-bold text-gray-900">Order #{inv.invoiceId}</h4>
                  <div className="text-sm text-gray-500 mt-1">{new Date(inv.createdAt).toLocaleDateString()}</div>
               </div>
               <div className="text-right flex flex-col items-end gap-1">
                  <div className="font-extrabold text-gray-900 text-lg mb-1">₹{inv.totalAmount}</div>
                  <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {inv.paymentMode || "PAID"}
                  </span>
                  <button onClick={() => downloadInvoicePdf({ ...inv })} className="mt-1 text-xs font-semibold text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-2.5 py-1 rounded-md transition-colors">Download PDF</button>
               </div>
            </div>
         ))}
         {invoices.length === 0 && (
           <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 font-medium">No invoices found.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default MyInvoices;
