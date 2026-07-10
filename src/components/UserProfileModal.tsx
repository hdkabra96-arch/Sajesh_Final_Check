import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, MapPin, Sparkles, LogOut, CheckCircle, Package, Edit3, ArrowRight, Lock, ShieldCheck, HelpCircle } from 'lucide-react';
import { UserProfile, RecentOrder } from '../types';
import { fetchUserProfileByEmail } from '../supabaseClient';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onLogoutProfile: () => void;
  orders: RecentOrder[];
}

export default function UserProfileModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onLogoutProfile,
  orders
}: UserProfileModalProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  // Authentication & Login states
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPin, setLoginPin] = React.useState('');
  const [loginError, setLoginError] = React.useState('');
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  // Form states
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [preferredSize, setPreferredSize] = React.useState<'M' | 'L' | 'XL' | 'XXL' | ''>('');
  const [pin, setPin] = React.useState('');

  // Initial Form set on profile change/load
  React.useEffect(() => {
    if (!isOpen) {
      setIsLoggingIn(false);
      setLoginEmail('');
      setLoginPin('');
      setLoginError('');
      setIsAuthenticating(false);
    }
    if (userProfile) {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setPhone(userProfile.phone);
      setAddress(userProfile.address);
      setCity(userProfile.city);
      setZip(userProfile.zip);
      setPreferredSize(userProfile.preferredSize);
      setPin(userProfile.pin || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setZip('');
      setPreferredSize('');
      setPin('');
    }
  }, [userProfile, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onSaveProfile({
      name,
      email,
      phone,
      address,
      city,
      zip,
      preferredSize,
      pin: pin.trim() || '1234'
    });
    setIsEditing(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPin.trim()) return;

    setIsAuthenticating(true);
    setLoginError('');

    try {
      // Direct look-up of the profile from Supabase
      const profile = await fetchUserProfileByEmail(loginEmail.trim());
      
      // Simulate verification / authorization sequence for extreme luxury feel
      await new Promise(resolve => setTimeout(resolve, 900));

      if (profile) {
        const expectedPin = (profile.pin || '1234').trim();
        if (loginPin.trim() === expectedPin) {
          onSaveProfile(profile);
          setIsLoggingIn(false);
          setLoginEmail('');
          setLoginPin('');
          setLoginError('');
        } else {
          setLoginError('Incorrect PIN code. Please verify your credentials or try again.');
        }
      } else {
        setLoginError('Registered client profile not found. Please check your email or create a new profile.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setLoginError('Authentication service offline. Please try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };


  // Filter orders matching first and last name or email (checking customer name case-insensitively)
  const myOrders = React.useMemo(() => {
    if (!userProfile) return [];
    return orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(userProfile.name.toLowerCase()) ||
        userProfile.name.toLowerCase().includes(order.customerName.toLowerCase())
    );
  }, [orders, userProfile]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/75 z-[120] flex items-center justify-center p-4 md:p-6 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white border border-black/15 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative z-10"
            style={{ maxHeight: 'calc(100vh - 40px)' }}
            id="user-profile-center-modal"
          >
            {/* Header */}
            <div className="bg-[#efeded] p-5 border-b border-black/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2 text-left">
                <User className="w-4 h-4 text-black" />
                <h2 className="font-['Bodoni_Moda'] text-lg font-bold uppercase tracking-wider text-black">
                  {userProfile ? 'My Customer Profile' : 'Create Customer Profile'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-black/10 hover:border-black flex items-center justify-center text-black hover:bg-white transition-colors cursor-pointer"
                title="Close Profile"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {userProfile && !isEditing ? (
                /* Profile View Dashboard */
                <div className="space-y-6 text-left">
                  {/* Avatar & Welcome banner */}
                  <div className="flex items-center gap-4 bg-[#fbf9f9] border border-black/5 p-4">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-sm font-bold font-mono">
                      {userProfile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2) || 'DU'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-['Hanken_Grotesk'] text-sm font-bold text-black">{userProfile.name}</h3>
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                      </div>
                      <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        DUODRIP VIP CLIENT • {userProfile.email}
                      </p>
                    </div>
                  </div>

                  {/* General Profile Specs */}
                  <div className="p-4 border border-black/10 bg-white space-y-3 font-['Hanken_Grotesk']">
                    <div className="flex justify-between items-center border-b border-black/5 pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Profile Details</span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-black uppercase hover:underline cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase font-semibold">Email</span>
                        <span className="text-black font-medium">{userProfile.email}</span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase font-semibold">Phone</span>
                        <span className="text-black font-medium">{userProfile.phone || 'Not Specified'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[9px] text-gray-400 uppercase font-semibold">Shipping Address</span>
                        <span className="text-black font-medium block leading-snug">
                          {userProfile.address || 'Not Specified'}
                          {userProfile.city && `, ${userProfile.city}`}
                          {userProfile.zip && ` - ${userProfile.zip}`}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase font-semibold">Preferred Size</span>
                        <span className="font-mono font-bold bg-black text-white px-2 py-0.5 text-[10px] inline-block uppercase mt-1">
                          {userProfile.preferredSize || 'None Selected'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] text-gray-400 uppercase font-semibold">Client Secure PIN</span>
                        <span className="font-mono font-bold text-black text-xs block mt-1 tracking-widest">
                          {userProfile.pin ? '••••' : '1234 (Default)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Orders Tracker Panel */}
                  <div className="space-y-3">
                    <span className="block text-[10px] uppercase tracking-widest font-bold text-gray-500">
                      My DUODRIP Deliveries ({myOrders.length})
                    </span>

                    {myOrders.length === 0 ? (
                      <div className="p-6 border border-dashed border-gray-300 text-center space-y-3 bg-[#fbf9f9]">
                        <Package className="w-7 h-7 text-gray-300 mx-auto" />
                        <p className="text-xs text-gray-500 font-sans max-w-xs mx-auto">
                          You haven't placed any orders with this profile name yet. Any new purchases you make using these billing details will sync here immediately!
                        </p>
                      </div>
                    ) : (
                      <div className="border border-black/10 divide-y divide-black/10">
                        {myOrders.map((order, oIdx) => {
                          const isSuccess = order.status === 'Delivered' || order.status === 'Shipped';
                          return (
                            <div key={`user-order-${order.id || oIdx}-${oIdx}`} className="p-3.5 bg-white flex justify-between items-center gap-4 hover:bg-[#fbf9f9]">
                              <div className="text-left font-['Hanken_Grotesk'] space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] bg-neutral-100 text-black px-1.5 py-0.5 font-bold uppercase">
                                    {order.id}
                                  </span>
                                  <span className="text-[10px] text-gray-400">{order.date}</span>
                                </div>
                                <h4 className="text-xs font-bold text-black line-clamp-1">
                                  {order.productName}
                                </h4>
                                <div className="text-[10px] text-gray-500 font-medium space-y-0.5 mt-1.5">
                                  <div>Total Charge: <strong className="text-black font-semibold font-mono">₹{order.amount.toFixed(2)}</strong></div>
                                  <div className="flex gap-4">
                                    <span>Method: <strong className="text-black font-semibold uppercase">{order.paymentMethod || 'COD'}</strong></span>
                                    <span>Payment: <strong className={`font-semibold uppercase ${
                                      order.paymentStatus === 'Paid' ? 'text-green-700' :
                                      order.paymentStatus === 'Failed' ? 'text-red-700' :
                                      'text-amber-700'
                                    }`}>{order.paymentStatus || 'Pending'}</strong></span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                                <span
                                  className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 tracking-wider ${
                                    order.status === 'Delivered'
                                      ? 'bg-green-100 text-green-700'
                                      : order.status === 'Shipped'
                                      ? 'bg-indigo-150 text-indigo-850'
                                      : order.status === 'Processing'
                                      ? 'bg-blue-100 text-blue-700'
                                      : order.status === 'Confirmed'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : order.status === 'Hold'
                                      ? 'bg-yellow-101 text-yellow-800'
                                      : 'bg-black text-white'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="flex justify-between items-center border-t border-black/5 pt-4">
                    <button
                      onClick={onLogoutProfile}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-[#ba1a1a] hover:text-red-750 uppercase cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Disconnect Profile
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 bg-black text-white font-bold text-[10px] uppercase tracking-widest hover:bg-neutral-800"
                    >
                      Close Portal
                    </button>
                  </div>
                </div>
              ) : isLoggingIn ? (
                /* Sleek Secure Authentication/Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-left font-['Hanken_Grotesk']">
                  <div className="bg-[#fbf9f9] border border-black/5 p-4 mb-2 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-black leading-relaxed font-sans font-bold uppercase tracking-wider">
                        RETURNING VIP CLIENT PORTAL
                      </p>
                      <p className="text-[11px] text-gray-500 leading-normal font-sans mt-0.5">
                        Authorize with your registered email and secure client PIN to retrieve your customized silhouettes, preferences, and delivery history.
                      </p>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-left leading-relaxed font-sans">
                      {loginError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                        Client Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          disabled={isAuthenticating}
                          placeholder="e.g. samuel@mcqueen.co"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full border border-gray-300 pl-10 pr-3 py-2 text-xs bg-white focus:outline-black text-black font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                        Secure Client PIN / Passcode *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                          type="password"
                          required
                          disabled={isAuthenticating}
                          maxLength={4}
                          placeholder="••••"
                          value={loginPin}
                          onChange={(e) => setLoginPin(e.target.value)}
                          className="w-full border border-gray-300 pl-10 pr-3 py-2 text-xs bg-white focus:outline-black text-black font-mono tracking-widest"
                        />
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1 block leading-normal">
                        If you haven't set a custom PIN before, enter any 4-digit code (e.g. 1234) to secure this session.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-black/5">
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-3 bg-black text-white text-[10px] font-extrabold tracking-widest uppercase hover:bg-neutral-800 flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isAuthenticating ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>AUTHENTICATING PROFILE...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>VERIFY & ACCESS PROFILE</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isAuthenticating}
                      onClick={() => {
                        setIsLoggingIn(false);
                        setLoginError('');
                      }}
                      className="text-center text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-wider underline cursor-pointer mt-1"
                    >
                      New client? Create a profile instead
                    </button>
                  </div>
                </form>
              ) : (
                /* Profile Form (Create or Edit Mode) */
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="bg-[#fbf9f9] border border-black/5 p-4 mb-2">
                    <p className="text-xs text-black leading-relaxed font-sans">
                      {isEditing 
                        ? "Modify your DUODRIP parameters. Changes will apply immediately to your active billing defaults and delivery trackers."
                        : "Unlock free premium courier delivery. Creating your DUODRIP client profile auto-populates all future checkout screens!"
                      }
                    </p>
                  </div>

                  <div className="space-y-3 font-['Hanken_Grotesk']">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samuel McQueen"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. samuel@mcqueen.co"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black font-mono text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black font-mono text-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Flat 402, Arc House, Outer Ring Road"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black text-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mumbai"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                          Postal PIN/ZIP Code
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 400001"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black font-mono text-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                        Preferred Fit Size
                      </label>
                      <div className="flex gap-2">
                        {(['M', 'L', 'XL', 'XXL'] as const).map((sz) => {
                          const isSelected = preferredSize === sz;
                          return (
                             <button
                               key={sz}
                               type="button"
                               onClick={() => setPreferredSize(sz)}
                               className={`w-10 h-10 border text-xs font-bold font-mono transition-colors cursor-pointer ${
                                 isSelected
                                   ? 'bg-black text-white border-black'
                                   : 'bg-white text-gray-500 border-black/10 hover:border-black'
                               }`}
                             >
                               {sz}
                             </button>
                          );
                        })}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1">
                        Selecting a value defaults the quickview sizing button automatically.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                        Secure Client PIN / Passcode *
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="e.g. 1234"
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full border border-gray-300 p-2.5 text-xs bg-white focus:outline-black text-black font-mono tracking-widest"
                      />
                      <p className="text-[9px] text-gray-400 mt-1">
                        Define a 4-digit code to lock and secure this profile. You will be prompted for this code to log in next time.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3.5 pt-4 border-t border-black/5">
                    <div className="flex justify-end gap-3">
                      {userProfile && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-5 py-2.5 border border-black/10 text-black text-[10px] font-extrabold tracking-widest uppercase hover:bg-neutral-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-black text-white text-[10px] font-extrabold tracking-widest uppercase hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{userProfile ? 'Save Modifications' : 'Create Account'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!userProfile && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoggingIn(true);
                          setLoginError('');
                        }}
                        className="text-center text-[10px] font-bold text-gray-500 hover:text-black uppercase tracking-wider underline cursor-pointer mt-1"
                      >
                        Already have a customer profile? Log In directly
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
