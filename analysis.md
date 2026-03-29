# QA Bug Report & Analysis: Salon SaaS Platform

## 1. Structured Bug Reports & Feature Requests

### **Bug: Customer Page Blank & Navigation Break**
- **What's happening**: Navigating to a specific customer page loads a blank screen. Hitting the browser back button breaks the app state, requiring a full app restart.
- **Expected behavior**: The customer details view should render correctly. The back button should return the user to the previous list view seamlessly without blowing up the app.
- **Suggested fix**: Add an `ErrorBoundary` around the customer details component. Ensure React Router `useParams` data fetching handles `null` or `undefined` gracefully without throwing unhandled render exceptions.

### **Bug: Booking Cancellation Does Not Reflect**
- **What's happening**: After cancelling a booking, the UI still shows it as active until the page is manually refreshed.
- **Expected behavior**: The booking status should instantly update to "Cancelled" upon a successful API call.
- **Suggested fix**: Update the local `bookings` state array immediately upon a successful `DELETE/PUT` API response (Optimistic UI update), or trigger a refetch of the data using `useEffect` dependencies or React Query invalidation.

### **Bug: Invoice PDF Download Failing**
- **What's happening**: Attempting to download an invoice as a PDF does not work.
- **Expected behavior**: Clicking the button should trigger a prompt to save the generated PDF file.
- **Suggested fix**: Ensure the backend endpoint serving the PDF sets the `Content-Disposition: attachment; filename="invoice.pdf"` header. Alternatively, use frontend libraries like `jspdf` or `html2pdf.js` to parse the DOM into a PDF.

### **UX Issue: Booking List Sorting**
- **What's happening**: The booking list displays Old → New chronologically.
- **Expected behavior**: The list should display New → Old so upcoming/latest bookings are immediately visible at the top.
- **Suggested fix**: Add `ORDER BY createdAt DESC` to the backend database query, or apply a quick `.sort((a,b) => new Date(b.date) - new Date(a.date))` directly on the frontend array before rendering.

### **Bug: Appointment Booking Slow & Payment Bypass**
- **What's happening**: Booking an appointment feels slow. Furthermore, the payment method is required but the form succeeds even if left empty.
- **Expected behavior**: The booking should have a loading state and the frontend should strictly block submission if payment details are missing.
- **Suggested fix**: Add strict `required` validation to the payment method state before triggering the API POST. Introduce loading spinners and disable buttons (`disabled={isLoading}`) to mask query latency.

### **Feature Request: Profile Edit Restrictions**
- **What's happening**: There is no option for users to edit their email or change their password from the profile.
- **Expected behavior**: Users should be able to update their email and change their password securely.
- **Suggested fix**: Add a "Change Password" modal integrating Supabase's `auth.updateUser` mechanism, supporting credential updates securely.

### **UX Issue: AI Widget Blocking Cart Flow**
- **What's happening**: The floating AI widget overlay interrupts or blocks the checkout/add-to-cart buttons on mobile.
- **Expected behavior**: The cart and purchase flow should be fully accessible without overlay obstruction.
- **Suggested fix**: Adjust the `z-index` of the cart checkout bar to rest above the widget, or add bottom padding (`pb-24`) to page containers to prevent overlap by the fixed widget.

### **Bug: Add to Cart Errors**
- **What's happening**: Clicking "Add to Cart" throws errors or causes unexpected app behavior.
- **Expected behavior**: The product/service should be pushed to the global cart context, updating the cart icon counter properly.
- **Suggested fix**: Check the Cart Context array mutation. Ensure `setCart([...cart, newItem])` is used instead of directly modifying the existing state array which causes React reconciliation errors.

### **Bug: Invoice Not Reflecting Payment Status**
- **What's happening**: After concluding a payment, the generated invoice isn't updated to show the new "PAID" status.
- **Expected behavior**: The invoice should automatically show "PAID" and a zero-balance due if the transaction succeeded.
- **Suggested fix**: Pass the transaction response (e.g. `status: "PAID"`) securely through the callback URL or webhook, and map that explicitly to the Invoice generation function.

### **Bug: Payment Method Selection Problems**
- **What's happening**: Users experience issues selecting payment methods during checkout (e.g., clicks not registering, wrong option highlighted).
- **Expected behavior**: Distinct payment methods (Card, UPI, Cash) should be easily selectable radio buttons.
- **Suggested fix**: Fix the uncontrolled vs. controlled component bug. Ensure the radio group's `onChange` event properly updates the parent component's payment state and that the `checked` attribute matches the state string exactly.

### **UX Issue: Admin UI Layout & Navigation Labels**
- **What's happening**: The admin panel UI is poorly laid out (especially on mobile) and tab navigation labels are misleading or incorrect.
- **Expected behavior**: Admin panel should have logically grouped, clear labels and an adaptive layout suitable for laptops and mobile devices.
- **Suggested fix**: Implemented a slide-out hamburger menu for the `AdminLayout` (already executed). Review strings in `navItems` array and rename loosely termed labels to standard industry terminology (e.g., "Revenue" instead of "Logs").

---

## 2. 3 Commonly Occurring Root Causes

Across all these reported bugs, the issues consistently map back to three core technical debts:

1. **State Management & Reactivity**: 
   *Symptoms:* Cancellations not showing without refresh, Cartesian errors adding to the cart, invoices showing incorrect payment statuses.
   *Cause:* The app is likely mutating state directly or failing to synchronize local state arrays with fresh Server responses (lack of Optimistic Updates or global Context re-fetching).
2. **API Sync & Unhandled Lifecycles**: 
   *Symptoms:* Sluggish booking, blank customer screens upon back button events, failing PDF downloads.
   *Cause:* Complex asynchronous actions have no fallback error states or latency indicators via UI. Blank screens mean the render cycle expects data that the API hasn't delivered yet (or failed to deliver).
3. **Navigation / Routing Architecture**: 
   *Symptoms:* Back button breaking the app, overlapping widgets.
   *Cause:* Improper handling of React Router's DOM history stack. When users hit backing, the component lacks necessary URL identifiers to re-fetch, thereby catastrophically crashing the tree.

---

## 3. Product Photo Recommendations

To significantly boost conversion rate and convey premium quality, images must be introduced efficiently:

1. **Booking Cards**: Include vibrant, high-quality images of the service result or tools (e.g., a fade, Keratin treatment setup) taking up the top 40% of the selection card. 
2. **Cart & Checkout**: Keep it minimalistic. Use a small thumbnail (`w-12 h-12`) alongside the service name in the checkout line items so customers are visually reminded of what they are buying.
3. **Invoices**: Do not use product photos on invoices as it bloats PDF sizing. Instead, use a crisp Salon Brand Logo in the top-right header for professionalism. 
4. **Admin Listings (ProductsList & Services)**: Use square avatar thumbnails (aspect ratio 1:1, `w-10 h-10 object-cover rounded shadow-sm`) in the data table rows so admins can physically verify products in inventory matches digital stock without reading every label.
