import React from 'react';
import { ShoppingBag, Heart, User, Search } from 'lucide-react';
import { ActiveView, UserProfile } from '../types';
import logoImg from '../assets/images/duo_drip.png';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cartCount: number;
  onCartClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
  onSearch: (term: string) => void;
  userProfile: UserProfile | null;
  onProfileClick: () => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  cartCount,
  onCartClick,
  favoritesCount,
  onFavoritesClick,
  onSearch,
  userProfile,
  onProfileClick
}: NavbarProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fbf9f9]/90 backdrop-blur-md border-b border-black/10">
      <div className="grid grid-cols-3 items-center h-28 px-6 md:px-16 max-w-[1440px] mx-auto w-full">
        {/* Left: Desktop Navigation Links */}
        <div className="flex items-center justify-start">
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => setActiveView('storefront')}
              id="nav-link-collections"
              className={`font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase hover:text-black transition-colors ${
                activeView === 'storefront' ? 'text-black border-b border-black pb-1' : 'text-gray-500'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => {
                setActiveView('shop');
              }}
              id="nav-link-shop"
              className={`font-['Hanken_Grotesk'] text-xs font-semibold tracking-widest uppercase hover:text-black transition-colors ${
                activeView === 'shop' ? 'text-black border-b border-black pb-1' : 'text-gray-500'
              }`}
            >
              Shop All
            </button>
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex justify-center text-center">
          <button
            onClick={() => setActiveView('storefront')}
            id="nav-logo-btn"
            className="flex items-center justify-center select-none cursor-pointer"
          >
            <img
              src={logoImg}
              alt="DUODRIP"
              className="h-24 md:h-36 w-auto object-contain max-h-[144px] min-w-[200px]"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>

        {/* Right: Action Widgets */}
        <div className="flex items-center justify-end gap-6">
          {/* Custom Search bar */}
          <form onSubmit={handleSubmit} className="hidden lg:flex items-center border-b border-black/20 pb-1 mr-2">
            <Search className="w-4 h-4 text-gray-500 mr-1.5" />
            <input
              type="text"
              placeholder="SEARCH"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
              className="bg-transparent border-none text-xs font-['Hanken_Grotesk'] tracking-widest placeholder-gray-400 focus:outline-none w-32 focus:w-44 transition-all duration-300"
            />
          </form>



          {/* Shopping Bag Button */}
          <button
            onClick={onCartClick}
            id="nav-cart-btn"
            className="text-gray-800 hover:text-black transition-colors relative"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          </button>

          {/* Client Profile Indicator */}
          <button
            onClick={onProfileClick}
            id="nav-user-btn"
            className="text-gray-800 hover:text-black transition-colors relative flex items-center gap-1"
            aria-label="My Profile"
            title={userProfile ? `DUODRIP Client: ${userProfile.name}` : 'Create / View Profile'}
          >
            <User className={`w-5 h-5 ${userProfile ? 'text-black fill-black/10' : ''}`} />
            {userProfile && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#fbf9f9]" />
            )}
            {userProfile && (
              <span className="hidden lg:inline text-[9px] font-bold tracking-wider font-mono text-black uppercase">
                {userProfile.name.split(' ')[0]}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
