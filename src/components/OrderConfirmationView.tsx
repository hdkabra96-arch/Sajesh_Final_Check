import React from 'react';
import { CheckCircle2, Package, MapPin, Phone, CreditCard, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';
import { RecentOrder } from '../types';
import { motion } from 'framer-motion';

interface OrderConfirmationViewProps {
  order: RecentOrder | null;
  onContinueShopping: () => void;
}

export default function OrderConfirmationView({
  order,
  onContinueShopping
}: OrderConfirmationViewProps) {
  if (!order) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center font-['Hanken_Grotesk']">
        <Package className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="font-['Bodoni_Moda'] text-2xl font-bold text-black uppercase">No Order Details</h2>
        <p className="text-gray-500 text-sm mt-2 max-w-sm">No transaction details found for verification in this session.</p>
        <button
          onClick={onContinueShopping}
          className="mt-6 px-8 py-3.5 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors"
        >
          CONTINUE SHOPPING
        </button>
      </div>
    );
  }

  // Calculate dynamic estimated delivery (4-5 days from now)
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const estStart = new Date(today);
    estStart.setDate(today.getDate() + 3);
    const estEnd = new Date(today);
    estEnd.setDate(today.getDate() + 5);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${estStart.toLocaleDateString('en-US', options)} - ${estEnd.toLocaleDateString('en-US', options)} (3-5 Business Days)`;
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 pt-12 pb-24 font-['Hanken_Grotesk'] text-left">
      <div className="bg-white border border-black/10 p-6 md:p-12 shadow-sm space-y-8 relative overflow-hidden">
        {/* Success Top Indicator */}
        <div className="text-center space-y-4 pb-8 border-b border-black/10">
          <div className="flex justify-center text-black mb-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <CheckCircle2 className="w-20 h-20 text-neutral-900 stroke-[1.2]" />
            </motion.div>
          </div>
          <h2 className="font-['Bodoni_Moda'] text-3xl font-extrabold text-black uppercase tracking-wide">
            Thank you for your order.
          </h2>
          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
            Order Reference: <span className="font-mono text-black font-bold bg-neutral-100 px-2 py-0.5">{order.id}</span>
          </p>
        </div>

        {/* Required COD Success Notification banner */}
        <div className="p-4 bg-neutral-50 border-l-2 border-black space-y-1">
          <p className="text-xs text-black font-extrabold tracking-wide uppercase">Important Delivery Instructions</p>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Your order has been placed successfully. Please keep the payment ready at the time of delivery.
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Order logistics info */}
          <div className="space-y-6">
            <h3 className="font-['Bodoni_Moda'] text-lg font-bold text-black uppercase border-b border-black/5 pb-2">
              Shipping & Customer Info
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <Package className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Recipient</span>
                  <span className="font-semibold text-black text-sm">{order.customerName}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Mobile Number</span>
                  <span className="font-semibold text-black font-mono">{order.phone || 'Not provided'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Delivery Address</span>
                  <span className="text-black font-medium leading-relaxed block">{order.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment & Schedule info */}
          <div className="space-y-6">
            <h3 className="font-['Bodoni_Moda'] text-lg font-bold text-black uppercase border-b border-black/5 pb-2">
              Payment & Dispatch Details
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <CreditCard className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Payment Method</span>
                  <span className="font-semibold text-black uppercase">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : order.paymentMethod || 'Cash on Delivery'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[8px] font-bold text-gray-400 shrink-0 mt-0.5">₹</div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Payment Status</span>
                  <span className="font-bold text-orange-650 bg-orange-50 px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase inline-block">
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Estimated Delivery</span>
                  <span className="font-semibold text-black block leading-relaxed">{getEstimatedDeliveryDate()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-4 pt-4">
          <h3 className="font-['Bodoni_Moda'] text-lg font-bold text-black uppercase border-b border-black/5 pb-2">
            Cart Summary
          </h3>
          
          <div className="bg-[#fbf9f9] border border-black/5 p-4 space-y-3">
            <div className="flex justify-between font-['Hanken_Grotesk'] text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-black/5 pb-2">
              <span>Items / Silhouettes</span>
              <span className="text-right">Price</span>
            </div>

            <div className="text-xs text-black space-y-2 leading-relaxed">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="font-bold text-black text-sm block leading-snug">{order.productName}</span>
                  {order.size && (
                    <span className="text-[10px] text-gray-500 font-semibold block mt-0.5">
                      Selected Size: <span className="text-black font-bold font-mono">{order.size}</span>
                    </span>
                  )}
                  {order.quantity && (
                    <span className="text-[10px] text-gray-500 font-semibold block">
                      Quantity: <span className="text-black font-bold font-mono">{order.quantity}</span>
                    </span>
                  )}
                </div>
                <span className="font-mono text-sm font-bold shrink-0 self-center text-black">
                  ₹{order.amount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="border-t border-black/5 pt-3 flex justify-between items-center text-black">
              <span className="font-['Bodoni_Moda'] text-base font-extrabold uppercase">Total Amount Paid</span>
              <span className="font-mono text-lg font-black">₹{order.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Continue Shopping button */}
        <div className="pt-6 text-center">
          <button
            onClick={onContinueShopping}
            className="px-10 py-4 bg-black text-white hover:bg-neutral-800 text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
