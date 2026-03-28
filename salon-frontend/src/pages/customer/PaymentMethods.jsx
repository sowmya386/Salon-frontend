import React, { useState } from 'react';
import { CreditCard, Plus, HelpCircle, AlertCircle, RefreshCw, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const PaymentMethods = () => {
  const [cards, setCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/26', default: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '05/25', default: false }
  ]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvc: '' });

  const handleAddCard = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setCards([...cards, {
        id: Date.now(),
        type: newCard.number.startsWith('4') ? 'Visa' : 'Mastercard',
        last4: newCard.number.slice(-4) || '1234',
        expiry: newCard.expiry || '12/28',
        default: cards.length === 0
      }]);
      setIsAddOpen(false);
      setLoading(false);
      setNewCard({ name: '', number: '', expiry: '', cvc: '' });
    }, 1000);
  };

  const setAsDefault = (id) => {
    setCards(cards.map(c => ({
      ...c,
      default: c.id === id
    })));
  };

  const removeCard = (id) => {
    setCards(cards.filter(c => c.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-primary-500" />
          Your Payment Methods
        </h2>
        <button onClick={() => setIsAddOpen(true)} className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 shadow-lg shadow-gray-900/20 transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Payment Method
        </button>
      </div>

      <div className="space-y-4">
        {cards.length === 0 ? (
           <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
             <p className="text-gray-500 font-medium">No saved payment methods.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map(card => (
              <div key={card.id} className={cn(
                "relative p-6 rounded-2xl border-2 transition-all group",
                card.default ? "border-primary-500 bg-primary-50/10 shadow-md shadow-primary-500/10" : "border-gray-100 hover:border-gray-200 bg-white shadow-sm"
              )}>
                {card.default && (
                  <span className="absolute -top-3 left-4 bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm opacity-100 animate-in fade-in">
                    Default
                  </span>
                )}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{card.type} ending in {card.last4}</p>
                      <p className="text-sm text-gray-500">Expires {card.expiry}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!card.default && (
                    <button onClick={() => setAsDefault(card.id)} className="text-sm font-semibold text-primary-600 hover:text-primary-800 hover:underline">
                      Set as Default
                    </button>
                  )}
                  {!card.default && <span className="text-gray-300">|</span>}
                  <button onClick={() => removeCard(card.id)} className="text-sm font-semibold text-red-600 hover:text-red-800 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-gray-400" /> Subscription & Autopay
        </h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-2xl">
          By default, we will charge your default payment method for any upcoming appointments or retail subscriptions. You can manage these settings anytime.
        </p>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => !loading && setIsAddOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Plus className="w-5 h-5 text-gray-900"/> Add a card</h2>
              <button disabled={loading} onClick={() => setIsAddOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddCard} className="p-6 space-y-5">
              
              <div className="bg-blue-50 text-blue-800 p-3 rounded-xl flex items-start gap-2 text-sm mb-2">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>We accept all major credit and debit cards. Your payment information is securely encrypted.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Name on card</label>
                <input 
                  type="text" 
                  value={newCard.name}
                  onChange={e => setNewCard({...newCard, name: e.target.value})}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium transition-all shadow-sm"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Card number</label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    maxLength="16"
                    value={newCard.number}
                    onChange={e => setNewCard({...newCard, number: e.target.value})}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium transition-all shadow-sm"
                    placeholder="0000 0000 0000 0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Expiry Date</label>
                   <input 
                     type="text" 
                     maxLength="5"
                     required
                     value={newCard.expiry}
                     onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                     className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium transition-all shadow-sm"
                     placeholder="MM/YY"
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1 ml-1">
                     Security Code <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                   </label>
                   <input 
                     type="text" 
                     maxLength="4"
                     required
                     value={newCard.cvc}
                     onChange={e => setNewCard({...newCard, cvc: e.target.value})}
                     className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-900 font-medium transition-all shadow-sm"
                     placeholder="CVC"
                   />
                 </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  disabled={loading}
                  onClick={() => setIsAddOpen(false)} 
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg shadow-gray-900/20 hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentMethods;
