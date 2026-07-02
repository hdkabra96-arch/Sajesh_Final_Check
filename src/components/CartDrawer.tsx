import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem, UserProfile } from '../types';
import { X, Trash2, Plus, Minus, CreditCard, ShoppingBag, CheckCircle, Tag, Sparkles, UserCheck, MessageCircle, AlertCircle, Send, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, size: string, change: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onAddOrder: (order: {
    customerName: string;
    productName: string;
    amount: number;
    phone?: string;
    email?: string;
    address?: string;
    productId?: string;
    size?: string;
    color?: string;
    quantity?: number;
    whatsAppSent?: boolean;
    status?: 'Shipped' | 'Processing' | 'Delivered' | 'Hold' | 'Pending';
  }) => void;
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenProfileModal: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddOrder,
  userProfile,
  onSaveProfile,
  onOpenProfileModal
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = React.useState('');
  const [discountPercent, setDiscountPercent] = React.useState(0);
  const [promoError, setPromoError] = React.useState('');
  const [promoSuccess, setPromoSuccess] = React.useState('');

  // Checkout modal form
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [checkoutName, setCheckoutName] = React.useState('');
  const [checkoutEmail, setCheckoutEmail] = React.useState('');
  const [checkoutPhone, setCheckoutPhone] = React.useState('');
  const [checkoutAddress, setCheckoutAddress] = React.useState('');
  const [checkoutCity, setCheckoutCity] = React.useState('');
  const [checkoutState, setCheckoutState] = React.useState('');
  const [checkoutZip, setCheckoutZip] = React.useState('');
  const [checkoutCountry, setCheckoutCountry] = React.useState('');
  const [checkoutNotes, setCheckoutNotes] = React.useState('');
  const [saveToProfile, setSaveToProfile] = React.useState(true);
  
  // Order Summary state before redirecting to WhatsApp
  const [showOrderSummary, setShowOrderSummary] = React.useState(false);
  const [errorOpeningWhatsApp, setErrorOpeningWhatsApp] = React.useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = React.useState(false);
  const [createdOrderId, setCreatedOrderId] = React.useState('');

  // Pre-fill fields if user profile exists
  React.useEffect(() => {
    if (userProfile && isCheckingOut) {
      setCheckoutName(userProfile.name || '');
      setCheckoutEmail(userProfile.email || '');
      setCheckoutPhone(userProfile.phone || '');
      setCheckoutAddress(userProfile.address || '');
      setCheckoutCity(userProfile.city || '');
      setCheckoutZip(userProfile.zip || '');
    }
  }, [userProfile, isCheckingOut]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'STYLE10') {
      setDiscountPercent(10);
      setPromoSuccess('10% VIP DISCOUNT APPLIED');
    } else {
      setPromoError('INVALID OR EXPIRED PROMO CODE');
    }
  };

  const subtotal = React.useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = React.useMemo(() => {
    return (subtotal * discountPercent) / 100;
  }, [subtotal, discountPercent]);

  const total = React.useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !checkoutName.trim() ||
      !checkoutEmail.trim() ||
      !checkoutPhone.trim() ||
      !checkoutAddress.trim() ||
      !checkoutCity.trim() ||
      !checkoutState.trim() ||
      !checkoutZip.trim() ||
      !checkoutCountry.trim()
    ) {
      return;
    }

    // Generate Order ID early
    const newId = `STM-${Math.floor(10000 + Math.random() * 90000)}`;
    setCreatedOrderId(newId);
    setShowOrderSummary(true);
  };

  const getWhatsAppUrl = () => {
    if (cart.length === 0) return '';

    // Format products
    const productNames = cart.map(item => item.product.name).join(', ');
    const productCategories = cart.map(item => item.product.category).join(', ');
    const productSizes = cart.map(item => item.selectedSize).join(', ');
    const productColors = cart.map(item => item.product.color).join(', ');
    const productQuantities = cart.map(item => item.quantity).join(', ');
    const productPrices = cart.map(item => `₹${item.product.price.toFixed(2)}`).join(', ');

    // Compile WhatsApp message
    const message = `🛍️ NEW ORDER - DUODRIP

Order ID: ${createdOrderId}

Customer Details

Name: ${checkoutName}
Phone: ${checkoutPhone}
Email: ${checkoutEmail}

Shipping Address

Address: ${checkoutAddress}
City: ${checkoutCity}
State: ${checkoutState}
Pincode: ${checkoutZip}
Country: ${checkoutCountry}

Product Details

Product Name: ${productNames}
Category: ${productCategories}
Size: ${productSizes}
Color: ${productColors}
Quantity: ${productQuantities}

Price: ${productPrices}
Delivery Charges: FREE
Total Amount: ₹${total.toFixed(2)} INR

Order Notes: ${checkoutNotes.trim() ? checkoutNotes : 'None'}

Please confirm my order.

Thank you.`;

    const encodedMessage = encodeURIComponent(message);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile 
      ? `https://api.whatsapp.com/send?phone=917698597279&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=917698597279&text=${encodedMessage}`;
  };

  const handleConfirmAndOpenWhatsApp = () => {
    if (cart.length === 0) return;

    // Register inside recent orders list and save to Supabase
    const firstItem = cart[0];
    onAddOrder({
      customerName: checkoutName,
      productName: cart.map(item => `${item.quantity}x ${item.product.name} (${item.selectedSize})`).join(', '),
      amount: total,
      phone: checkoutPhone,
      email: checkoutEmail,
      address: `${checkoutAddress}, ${checkoutCity}, ${checkoutState} - ${checkoutZip}, ${checkoutCountry}`,
      productId: firstItem?.product.id,
      size: firstItem?.selectedSize,
      color: firstItem?.product.color,
      quantity: cart.reduce((acc, item) => acc + item.quantity, 0),
      whatsAppSent: true,
      status: 'Pending'
    });

    // Save profile if opt-in
    if (saveToProfile) {
      onSaveProfile({
        name: checkoutName,
        email: checkoutEmail,
        phone: checkoutPhone,
        address: checkoutAddress,
        city: checkoutCity,
        zip: checkoutZip,
        preferredSize: userProfile?.preferredSize || firstItem?.selectedSize || ''
      });
    }

    // Succeed and clear cart
    setCheckoutSuccess(true);
    setTimeout(() => {
      onClearCart();
      setIsCheckingOut(false);
      setCheckoutSuccess(false);
      setShowOrderSummary(false);
      setCheckoutName('');
      setCheckoutEmail('');
      setCheckoutPhone('');
      setCheckoutAddress('');
      setCheckoutCity('');
      setCheckoutState('');
      setCheckoutZip('');
      setCheckoutCountry('');
      setCheckoutNotes('');
      onClose();
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Sliding Cart Screen */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[460px] bg-[#fbf9f9] z-50 shadow-2xl flex flex-col justify-between border-l border-black/10"
            id="shopping-cart-drawer"
          >
            {/* Header Block */}
            <div className="p-6 border-b border-black/10 flex justify-between items-center bg-[#efeded]">
              <div className="flex items-center gap-2 text-left">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h2 className="font-['Bodoni_Moda'] text-xl font-bold text-black uppercase">Your Bag</h2>
                <span className="font-mono text-xs bg-black text-white px-1.5 py-0.5 rounded-full font-bold">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-black/10 hover:border-black flex items-center justify-center text-black cursor-pointer"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Central Cart List (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-gray-300 stroke-[1.5]" />
                  <h3 className="font-['Bodoni_Moda'] text-xl font-bold text-black mt-2">Your Bag is Empty</h3>
                  <p className="font-['Hanken_Grotesk'] text-sm text-gray-500 max-w-xs">
                    Explore the catalog, filter core oversized essentials, or build the look with new modern arrivals.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-black text-white font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, itemIdx) => (
                    <div
                      key={`cart-item-${item.product.id}-${item.selectedSize}-${itemIdx}`}
                      className="flex border border-black/5 bg-white p-3 gap-3 relative hover:shadow-sm"
                    >
                      {/* Product Image cover */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-20 object-contain border border-black/5 bg-[#fbf9f9] shrink-0"
                      />

                      {/* Detail metadata block */}
                      <div className="flex-1 text-left flex flex-col justify-between">
                        <div>
                          <p className="font-['Hanken_Grotesk'] text-[9px] tracking-wider text-gray-400 font-bold uppercase">
                            {item.product.textColorCategory}
                          </p>
                          <h4 className="font-['Hanken_Grotesk'] text-xs font-bold text-black leading-snug">
                            {item.product.name}
                          </h4>
                          <div className="flex gap-4 text-[10px] text-gray-500 mt-1">
                            <span>Size: <strong className="text-black font-extrabold">{item.selectedSize}</strong></span>
                          </div>
                        </div>

                        {/* Adjust count quantities bar */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, -1)}
                            className="w-5 h-5 rounded border border-neutral-300 flex items-center justify-center text-xs hover:border-black cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, 1)}
                            className="w-5 h-5 rounded border border-neutral-300 flex items-center justify-center text-xs hover:border-black cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Delete action right aligned */}
                      <div className="text-right flex flex-col justify-between items-end shrink-0 pl-1">
                        <span className="font-['Hanken_Grotesk'] text-xs font-bold text-black block">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.selectedSize)}
                          title="Remove item"
                          className="text-gray-400 hover:text-red-650 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions Frame (Promo Code & Checkouts) */}
            {cart.length > 0 && (
              <div className="border-t border-black/15 p-6 bg-[#efeded]/70">
                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2 mb-4">
                  <div className="flex-1 relative flex items-center bg-white border border-black/10 px-3 py-1">
                    <Tag className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE STYLE10..."
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="bg-transparent border-none focus:outline-none w-full text-[10px] font-['Hanken_Grotesk'] tracking-widest uppercase h-8"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white hover:bg-neutral-800 text-[10px] font-bold tracking-widest uppercase transition-colors shrink-0 cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>

                {/* Feedback Logs */}
                {promoError && (
                  <p className="text-[10px] font-bold text-red-650 text-left mb-3 tracking-wider uppercase">
                    ✕ {promoError}
                  </p>
                )}
                {promoSuccess && (
                  <p className="text-[10px] font-bold text-green-650 text-left mb-3 tracking-wider uppercase">
                    ✓ {promoSuccess}
                  </p>
                )}

                {/* Pricing summary */}
                <div className="space-y-2 border-b border-black/10 pb-4 mb-4 text-left">
                  <div className="flex justify-between font-['Hanken_Grotesk'] text-xs text-gray-650">
                    <span>Subtotal Products</span>
                    <span className="font-mono font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-['Hanken_Grotesk'] text-xs text-green-650">
                      <span>Promo Discount (10% Off)</span>
                      <span className="font-mono font-bold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-['Hanken_Grotesk'] text-xs text-gray-650">
                    <span>Eco Shipping & Freight</span>
                    <span className="font-mono text-green-650 font-bold uppercase text-[10px]">FREE AT DROP</span>
                  </div>
                  <div className="flex justify-between font-['Bodoni_Moda'] text-base font-extrabold text-black pt-2">
                    <span>Total Bill (INR)</span>
                    <span className="font-mono">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Proceed Checkout button */}
                <button
                  onClick={() => setIsCheckingOut(true)}
                  id="proceed-checkout-btn"
                  className="w-full py-4 bg-black text-white hover:bg-neutral-800 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  PROCEED TO SECURE CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Checkout Form Modal (High Fidelity Complete Loop) */}
      {isCheckingOut && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-black/20 p-5 md:p-6 w-full max-w-lg rounded-none text-left relative max-h-[90vh] overflow-y-auto"
            id="checkout-detail-modal"
          >
            <button
              onClick={() => setIsCheckingOut(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              title="Close checkout"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4 font-['Hanken_Grotesk']"
              >
                <div className="flex justify-center text-green-600 mb-2">
                  <CheckCircle className="w-16 h-16 animate-bounce text-neutral-900" />
                </div>
                <h3 className="font-['Bodoni_Moda'] text-2xl font-bold text-black uppercase">Order Received!</h3>
                <span className="text-[11px] font-mono bg-neutral-100 text-black px-2.5 py-1 font-bold">
                  ORDER CODE: {createdOrderId}
                </span>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  We have saved your order details and initiated your customized template on WhatsApp! Please complete sending the message to finalize with our sales desk.
                </p>
                <p className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase">
                  OPENING WHATSAPP NOW...
                </p>
              </motion.div>
            ) : showOrderSummary ? (
              <div className="space-y-4 font-['Hanken_Grotesk']">
                <div className="border-b border-black/10 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="font-['Bodoni_Moda'] text-xl font-bold text-black uppercase">Order Summary</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase">Please confirm before opening WhatsApp</p>
                  </div>
                  <button
                    onClick={() => setShowOrderSummary(false)}
                    className="text-xs underline text-gray-500 hover:text-black uppercase font-bold tracking-wider"
                  >
                    Edit Details
                  </button>
                </div>

                {/* Products Summary list */}
                <div className="max-h-[220px] overflow-y-auto space-y-2 border-b border-black/5 pb-3 pr-1">
                  {cart.map((item, itemIdx) => (
                    <div key={`cart-summary-item-${item.product.id}-${item.selectedSize}-${itemIdx}`} className="flex items-center gap-3 bg-neutral-50 p-2.5 border border-black/5">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-12 object-contain bg-white border border-black/5"
                      />
                      <div className="flex-1 text-left">
                        <h4 className="text-[11px] font-bold text-black leading-tight">{item.product.name}</h4>
                        <div className="flex gap-2.5 text-[9px] text-gray-550 mt-0.5 font-sans">
                          <span>Size: <strong className="text-black font-semibold">{item.selectedSize}</strong></span>
                          <span>Qty: <strong className="text-black font-semibold">{item.quantity}</strong></span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-black">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotal metrics */}
                <div className="space-y-1.5 border-b border-black/5 pb-3 text-xs text-left">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal Products</span>
                    <span className="font-mono font-bold text-black">₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount</span>
                      <span className="font-mono font-bold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Eco Shipping & Freight</span>
                    <span className="text-green-600 font-bold uppercase text-[10px]">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-1.5 text-black font-sans">
                    <span>Grand Total</span>
                    <span className="font-mono">₹{total.toFixed(2)} INR</span>
                  </div>
                </div>

                {/* Address summary block */}
                <div className="bg-neutral-50 p-3 border border-black/5 text-left space-y-1 text-[10px]">
                  <span className="block text-[8px] font-bold uppercase tracking-widest text-gray-400">Delivery Destination</span>
                  <p className="text-black leading-relaxed font-sans">
                    <strong>{checkoutName}</strong> ({checkoutPhone})<br />
                    {checkoutAddress}, {checkoutCity}, {checkoutState} - {checkoutZip}, {checkoutCountry}
                  </p>
                  {checkoutNotes.trim() && (
                    <div className="mt-1.5 pt-1.5 border-t border-black/5">
                      <span className="block text-[8px] font-bold uppercase tracking-widest text-gray-450">Order Notes:</span>
                      <p className="text-gray-550 italic font-sans">{checkoutNotes}</p>
                    </div>
                  )}
                </div>

                {/* Error handling block */}
                {errorOpeningWhatsApp && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[10px] leading-relaxed text-left flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Unable to open WhatsApp automatically.</strong>
                      Please tap the support link or send your order code <strong className="font-mono">{createdOrderId}</strong> directly to us on WhatsApp at:
                      <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="block font-bold text-black underline mt-1">Chat on WhatsApp (+91 76985 97279)</a>
                    </div>
                  </div>
                )}

                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleConfirmAndOpenWhatsApp}
                  className="w-full py-4 bg-emerald-650 hover:bg-emerald-700 text-white font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
                  style={{ backgroundColor: '#10b981', display: 'flex' }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Confirm & Open WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="border-b border-black/10 pb-3 text-left">
                  <h3 className="font-['Bodoni_Moda'] text-xl font-bold text-black uppercase">Checkout Details</h3>
                  <p className="font-['Hanken_Grotesk'] text-[10px] text-gray-400 mt-0.5 uppercase">DUODRIP WhatsApp Purchase Route</p>
                </div>

                {/* Profile integration indicator */}
                {userProfile ? (
                  <div className="flex items-start gap-2.5 bg-neutral-50/50 border border-black/5 p-2.5 text-[10px] text-gray-650 font-sans text-left">
                    <UserCheck className="w-4 h-4 shrink-0 text-neutral-800 mt-0.5" />
                    <div>
                      <span>Active Customer Profile: <strong>{userProfile.name}</strong></span>
                      <p className="text-[9px] text-gray-500 mt-0.5">Shipping and contact defaults synced from your VIP profile database.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCheckingOut(false);
                          setTimeout(() => onOpenProfileModal(), 200);
                        }}
                        className="underline font-bold text-black uppercase text-[8px] tracking-wider mt-1 hover:no-underline block"
                      >
                        Modify Profile Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-neutral-50 border border-neutral-200/60 p-2.5 text-[10px] text-gray-650 font-sans flex justify-between items-center text-left">
                    <span>Create a customer profile to pre-fill shipping defaults.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCheckingOut(false);
                        setTimeout(() => onOpenProfileModal(), 200);
                      }}
                      className="font-bold underline text-black uppercase text-[8px] tracking-wider ml-2 shrink-0"
                    >
                      Build Profile
                    </button>
                  </div>
                )}

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 font-['Hanken_Grotesk'] border-b border-black/5 text-left">
                  <div className="sm:col-span-2">
                    <span className="block text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                      1. Contact & Shipping Parameters
                    </span>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samuel McQueen"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black text-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. samuel@mcqueen.co"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black font-mono text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black font-mono text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Postal PIN / ZIP Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 400001"
                      value={checkoutZip}
                      onChange={(e) => setCheckoutZip(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black font-mono text-black"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Delivery Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 104, Tower B, Landmark Heights"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black text-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={checkoutCity}
                      onChange={(e) => setCheckoutCity(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black text-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={checkoutState}
                      onChange={(e) => setCheckoutState(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black text-black font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Country *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. India"
                      value={checkoutCountry}
                      onChange={(e) => setCheckoutCountry(e.target.value)}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black text-black font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">Order Notes (Optional)</label>
                    <textarea
                      placeholder="Specify customized fitting requirements or delivery instructions..."
                      value={checkoutNotes}
                      onChange={(e) => setCheckoutNotes(e.target.value)}
                      rows={2}
                      className="w-full border border-gray-300 p-2 text-xs bg-[#fbf9f9] focus:outline-black text-black font-sans resize-none"
                    />
                  </div>
                </div>

                {/* Save details to profile toggle */}
                <div className="flex items-start gap-2.5 bg-neutral-50 p-3 border border-black/5 text-left">
                  <input
                    type="checkbox"
                    id="save-to-profile-chk"
                    checked={saveToProfile}
                    onChange={(e) => setSaveToProfile(e.target.checked)}
                    className="mt-0.5 cursor-pointer accent-black h-3.5 w-3.5"
                  />
                  <label htmlFor="save-to-profile-chk" className="text-[10px] text-gray-700 cursor-pointer font-sans select-none leading-tight">
                    <strong>Save these details to my DUODRIP Client Profile</strong>
                    <span className="block text-[8px] text-gray-400 mt-0.5">
                      Check to automatically create or update your profile context. Saves effort during your next garment checkout!
                    </span>
                  </label>
                </div>

                <div className="bg-[#efeded]/70 p-3 text-[10px] text-gray-500 leading-normal font-sans border-l-2 border-black text-left">
                  Total Order Amount: <strong className="text-black font-extrabold font-mono text-xs">₹{total.toFixed(2)} INR</strong> (Shipping is included).
                </div>

                <button
                  type="submit"
                  id="checkout-finalize-btn"
                  className="w-full py-3.5 bg-black text-white hover:bg-neutral-800 font-['Hanken_Grotesk'] text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer"
                >
                  PLACE ORDER ON WHATSAPP
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
