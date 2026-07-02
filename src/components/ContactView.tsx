import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MapPin, Mail, Phone, Clock, Handshake, ShieldAlert, ExternalLink } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export default function ContactView() {
  const [copied, setCopied] = React.useState(false);
  const [routeOrigin, setRouteOrigin] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: 'Customer Assistance',
    message: ''
  });

  const [submittedMessage, setSubmittedMessage] = React.useState<ContactMessage | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields to complete the transmittal.');
      return;
    }

    const newMessage: ContactMessage = {
      id: `DRIP-MSG-${Math.floor(100000 + Math.random() * 900000)}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Store in localStorage
    const saved = localStorage.getItem('duodrip_contact_submissions');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(newMessage);
    localStorage.setItem('duodrip_contact_submissions', JSON.stringify(list));

    // Focus / state update
    setSubmittedMessage(newMessage);

    // Reset inputs
    setFormData({
      name: '',
      email: '',
      subject: 'Customer Assistance',
      message: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="max-w-[1440px] mx-auto px-6 md:px-16 pb-24 pt-12"
      id="contact-view-container"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left Panel: Aesthetic Contact Metadata */}
        <div className="lg:col-span-5 space-y-12">
          <div>
            <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.3em] text-[#ba1a1a] uppercase block mb-3">
              CONNECT WITH US
            </span>
            <h1 className="font-['Bodoni_Moda'] text-4xl md:text-5xl font-light text-black tracking-tight leading-tight">
              Let’s Talk Style.
            </h1>
            <p className="font-['Hanken_Grotesk'] text-sm text-gray-500 max-w-sm mt-4 leading-relaxed">
              Whether you need help with sizing, order updates, custom requests, or wholesale inquiries, our team is here to assist you every step of the way.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">DIRECT ARCHIVE EMAIL</h3>
                <a href="mailto:duodripin@gmail.com" className="font-['Hanken_Grotesk'] text-sm text-black font-semibold hover:underline">
                  duodripin@gmail.com 
                </a>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400 mt-1">Expected reply :- under 12 hours </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">STUDIO COORDINATES</h3>
                <span className="font-['Hanken_Grotesk'] text-sm text-black font-semibold">
                  +91 7698597279 
                </span>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400 mt-1">Available all days & all time </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">HEAD DESIGN STUDIO</h3>
                <p className="font-['Hanken_Grotesk'] text-sm text-black font-semibold">
                  Ring Road Surat Gujarat
                </p>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400 mt-1">Visits available exclusively by reservation.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase">CONCIERGE OFFICE HOURS</h3>
                <p className="font-['Hanken_Grotesk'] text-sm text-black font-semibold">
                  Monday – Friday: 09:00 – 18:00 EST <br />
                  Saturday – Sunday: Closed for archive ideation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Boutique Map */}
        <div className="lg:col-span-7 bg-[#efeded]/40 border border-black/5 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-[0.3em] text-[#ba1a1a] uppercase block mb-1">
                  OFFICIAL STUDIO LOCATION
                </span>
                <h2 className="font-['Bodoni_Moda'] text-3xl font-light text-black tracking-tight">
                  Ring Road, Surat
                </h2>
              </div>
              <div className="flex items-center gap-2 bg-black/5 px-2.5 py-1 text-[9px] font-mono text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>MAP LIVE</span>
              </div>
            </div>

            {/* Google Map Iframe embedded elegantly with premium minimal style */}
            <div className="relative w-full h-[410px] border border-black/10 overflow-hidden bg-white shadow-sm transition-all duration-300">
              <iframe
                title="Google Maps Location"
                src="https://maps.google.com/maps?q=Ring%20Road%2C%20Surat%2C%20Gujarat%2C%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-black/5">
            {/* Directions Input Card */}
            <div className="bg-white border border-black/5 p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-[#ba1a1a] uppercase mb-1">
                  NAVIGATION ACCESS
                </h4>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400 mb-4 leading-relaxed">
                  Enter your address or origin point below to initialize route directions.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (routeOrigin.trim()) {
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=Ring+Road,+Surat,+Gujarat,+India&origin=${encodeURIComponent(
                        routeOrigin
                      )}`,
                      '_blank'
                    );
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="e.g. Surat Station"
                  value={routeOrigin}
                  onChange={(e) => setRouteOrigin(e.target.value)}
                  className="flex-1 bg-neutral-50 border border-black/10 focus:border-black px-3 py-2 text-xs font-semibold outline-none transition-all placeholder-gray-400 font-['Hanken_Grotesk'] rounded-none text-black"
                />
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white px-4 py-2 text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer font-['Hanken_Grotesk']"
                >
                  ROUTE
                </button>
              </form>
            </div>

            {/* Copy / Open Location Card */}
            <div className="bg-white border border-black/5 p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-['Hanken_Grotesk'] text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
                  COPY COORDINATES
                </h4>
                <p className="font-['Hanken_Grotesk'] text-xs font-semibold text-black mb-1">
                  Ring Road Surat Gujarat
                </p>
                <p className="font-['Hanken_Grotesk'] text-[11px] text-gray-400 mb-4 font-mono">
                  Surat, 395002, India
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('Ring Road Surat Gujarat');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-1 py-2 px-3 border border-black/10 hover:border-black text-black text-[9px] tracking-widest font-bold uppercase transition-colors text-center cursor-pointer font-['Hanken_Grotesk'] flex items-center justify-center gap-1"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a
                  href="https://maps.google.com/?q=Ring+Road,+Surat,+Gujarat,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 bg-black hover:bg-neutral-800 text-white text-[9px] tracking-widest font-bold uppercase transition-colors text-center cursor-pointer font-['Hanken_Grotesk'] flex items-center justify-center gap-1"
                >
                  Open Map
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
