import jsPDF from "jspdf";
import "jspdf-autotable";

export const downloadInvoicePdf = (invoiceData) => {
  if (!invoiceData) return;

  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 14, 22);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const invoiceId = invoiceData.invoiceId || invoiceData.id || invoiceData.invoiceNumber || "N/A";
  const dateStr = new Date(invoiceData.createdAt || invoiceData.date || new Date()).toLocaleDateString();
  const customerName = invoiceData.customerName || invoiceData.customer?.name || "Customer";

  // Top details
  doc.text(`Invoice Number: #${invoiceId}`, 14, 32);
  doc.text(`Date: ${dateStr}`, 14, 38);
  doc.text(`Payment Mode: ${invoiceData.paymentMode || "PAID"}`, 14, 44);
  
  // Bill To
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 140, 32);
  doc.setFont("helvetica", "normal");
  doc.text(customerName, 140, 38);
  if (invoiceData.customer?.email) doc.text(invoiceData.customer.email, 140, 44);
  if (invoiceData.customer?.phone) doc.text(invoiceData.customer.phone, 140, 50);

  // Default items if empty
  const items = (invoiceData.items && invoiceData.items.length > 0) 
    ? invoiceData.items 
    : [
        { itemName: "Salon Service", quantity: 1, price: invoiceData.totalAmount || invoiceData.amount || 0, amount: invoiceData.totalAmount || invoiceData.amount || 0 }
      ];

  const tableColumn = ["Item Description", "Qty", "Price", "Total"];
  const tableRows = [];

  items.forEach(item => {
    const rowData = [
      item.itemName || "Service/Product",
      item.quantity || 1,
      `Rs ${item.price || item.amount || 0}`,
      `Rs ${item.amount || (item.quantity * item.price) || 0}`
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42] }, // Slate 900
    styles: { font: "helvetica", fontSize: 10 },
  });

  const finalY = doc.lastAutoTable.finalY || 60;
  
  // Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  const totalAmountStr = `Total Amount: Rs ${invoiceData.totalAmount || invoiceData.amount || 0}`;
  doc.text(totalAmountStr, 14, finalY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Thank you for your business!", 14, finalY + 30);

  // Save PDF
  doc.save(`Invoice_${invoiceId}_${dateStr.replace(/\\//g, "-")}.pdf`);
};
