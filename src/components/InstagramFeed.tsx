import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Instagram, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Heart, 
  MessageCircle, 
  ExternalLink,
  Sparkles,
  Lock,
  RefreshCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export interface InstagramPost {
  id: string;
  type: 'post' | 'reel';
  mediaUrl: string;
  thumbnailUrl?: string;
  reelVideoUrl?: string;
  permalink: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  timestamp: string;
  isPinned?: boolean;
}

// Ultra-premium fashion preset assets
export const DEFAULT_IG_FEED: InstagramPost[] = [
  {
    id: "ig-1",
    type: "reel",
    mediaUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
    permalink: "https://www.instagram.com/reel/duo_drip_reel1",
    caption: "Study of fluid postures in Swiss Minimalist. Heavy loopback luxury terry featuring drop sleeves. #duodrip #swissminimalism",
    likeCount: 4122,
    commentCount: 142,
    timestamp: "2026-06-20T10:00:00Z"
  },
  {
    id: "ig-2",
    type: "post",
    mediaUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
    permalink: "https://www.instagram.com/p/duo_drip_post1",
    caption: "Curation Release No. 12. Blending clean architectural silhouettes with street-couture wearability. Sourced in Italian mills. #sustainablefashion",
    likeCount: 1989,
    commentCount: 43,
    timestamp: "2026-06-19T14:32:00Z"
  },
  {
    id: "ig-3",
    type: "reel",
    mediaUrl: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600",
    permalink: "https://www.instagram.com/reel/duo_drip_reel2",
    caption: "Inside our design atelier. Drafting the accurate shoulder calculations for ultimate hang tension. #couturedesign #premiumweight",
    likeCount: 3410,
    commentCount: 88,
    timestamp: "2026-06-18T18:15:00Z"
  },
  {
    id: "ig-4",
    type: "post",
    mediaUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600",
    permalink: "https://www.instagram.com/p/duo_drip_post2",
    caption: "Calm palettes in heavy luxury organic cotton. Minimal lines made to last. #organicluxury #aestheticlines",
    likeCount: 2240,
    commentCount: 61,
    timestamp: "2026-06-17T11:05:00Z"
  },
  {
    id: "ig-5",
    type: "post",
    mediaUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600",
    permalink: "https://www.instagram.com/p/duo_drip_post3",
    caption: "Structure meeting simplicity. Designed with precise seam spacing for natural, uncompromised movements. #simpleluxury #premiumknitwear",
    likeCount: 1835,
    commentCount: 29,
    timestamp: "2026-06-16T09:40:00Z"
  },
  {
    id: "ig-6",
    type: "reel",
    mediaUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600",
    permalink: "https://www.instagram.com/reel/duo_drip_reel3",
    caption: "Capturing light and drapes. Explore the newly arrived Bone White and Slate collections online now. #curateddrapes #neutralaesthetic",
    likeCount: 2981,
    commentCount: 74,
    timestamp: "2026-06-15T15:20:00Z"
  },
  {
    id: "ig-7",
    type: "post",
    mediaUrl: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600",
    permalink: "https://www.instagram.com/p/duo_drip_post4",
    caption: "The premium utility layering study. Robust double-fastened stitching detail with breathable texture elements. #layeringfits #coutureutility",
    likeCount: 1542,
    commentCount: 38,
    timestamp: "2026-06-14T10:11:00Z"
  },
  {
    id: "ig-8",
    type: "reel",
    mediaUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600",
    permalink: "https://www.instagram.com/reel/duo_drip_reel4",
    caption: "Raw organic loopback texture. Built to breathe, designed to frame. Experience high-density luxury. #oversizedhoodie #sustainableknits",
    likeCount: 3105,
    commentCount: 94,
    timestamp: "2026-06-13T12:00:00Z"
  }
];

export const PRESET_IG_POSTS = DEFAULT_IG_FEED;

const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&q=80&w=600"
];

const CAPTION_TEMPLATES = [
  "Fluid style draping and pure Swiss minimalism. Exploring fresh aesthetics curated with @{username}. #duodrip #${username} #streetcouture",
  "Collection Note No. 24. Heavy-weighted textiles meet delicate architectural silhouettes. Designed in collaboration with @{username}. #slowfashion #sustainableluxury",
  "Inside our creative design atelier. Sculpting drape flow and ultimate seam alignment. Inspired by modern streetwear curated by @{username}. #minimalisttextiles #fashionlook",
  "Warm earthly tones in signature heavy loops. Made for ultimate layering, detailed to be timeless. Designed by @{username}. #organicweight #essentials",
  "Understated luxury with immaculate edge details. Our custom knits are tailored to withstand trends and build looks. Curated with @{username}. #dripseason #contemporarywear",
  "Catching natural sunset shades over premium organic cotton garments. Explore new color bands with @{username}. #luxuryessentials #modernwardrobe",
  "Drape, line, precision. Crafted with heavy-weight loopback terry to prevent sagging. Curated selection from @{username}. #uncompromisingstyle #luxurycuts",
  "Constructing structural garments for modern motion. Experience uncompromised wearability designed with @{username} curation details. #duodrip #${username}"
];

export function generateFeedForUsername(username: string): InstagramPost[] {
  const normUser = username.trim().toLowerCase().replace(/[^a-zA-Z0-9_.]/g, '') || 'duodrip_official';
  
  // Create deterministic hash from username to seed details
  const getSimpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const seed = getSimpleHash(normUser);
  const posts: InstagramPost[] = [];
  
  for (let i = 0; i < 12; i++) {
    const isReel = (seed + i) % 2 === 0;
    const imgIndex = (seed + i) % UNSPLASH_IMAGES.length;
    const templateIndex = (seed + i) % CAPTION_TEMPLATES.length;
    
    // Deterministic random ranges
    const likeCount = 1000 + ((seed * (i + 1)) % 4500);
    const commentCount = 20 + ((seed + (i * 3)) % 180);
    
    // Deterministic timestamp calculating backwards in days from current local date
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - i - 1); 
    const timestampStr = dateObj.toISOString();

    const postId = `dynamic-ig-${normUser}-${i + 1}`;
    const mediaUrl = UNSPLASH_IMAGES[imgIndex];
    const permalink = `https://www.instagram.com/${isReel ? 'reel' : 'p'}/curated_${normUser}_${i + 1}`;
    const caption = CAPTION_TEMPLATES[templateIndex].replace(/{username}/g, normUser);

    posts.push({
      id: postId,
      type: isReel ? 'reel' : 'post',
      mediaUrl,
      permalink,
      caption,
      likeCount,
      commentCount,
      timestamp: timestampStr
    });
  }

  return posts;
}

export default function InstagramFeed() {
  // Read synchronized settings reactively from localStorage
  const [isEnabled, setIsEnabled] = React.useState(true);
  const [displayCount, setDisplayCount] = React.useState(12);
  const [autoplay, setAutoplay] = React.useState(true);
  const [autoplaySpeed, setAutoplaySpeed] = React.useState(3000);
  const [showArrows, setShowArrows] = React.useState(true);
  const [showDots, setShowDots] = React.useState(true);
  const [contentFilter, setContentFilter] = React.useState<'both' | 'posts' | 'reels'>('both');
  const [posts, setPosts] = React.useState<InstagramPost[]>(DEFAULT_IG_FEED);
  const [connected, setConnected] = React.useState(false);
  const [username, setUsername] = React.useState('duodrip_official');
  const [lastSync, setLastSync] = React.useState('');
  
  // Skeleton Loader State to represent real-time API syncing delays
  const [isLoading, setIsLoading] = React.useState(false);

  // Hidden / Pinned / Approved items arrays
  const [hiddenIds, setHiddenIds] = React.useState<string[]>([]);
  const [pinnedIds, setPinnedIds] = React.useState<string[]>([]);
  const [approvedIds, setApprovedIds] = React.useState<string[]>([]);
  const [approvalRequired, setApprovalRequired] = React.useState(false);

  // Load configuration context on mount & periodically
  const loadConfig = React.useCallback(() => {
    try {
      const enabledVal = localStorage.getItem('duodrip_ig_enabled') !== 'false';
      setIsEnabled(enabledVal);

      const countVal = Number(localStorage.getItem('duodrip_ig_limit')) || 12;
      setDisplayCount(countVal);

      const autoVal = localStorage.getItem('duodrip_ig_autoplay') !== 'false';
      setAutoplay(autoVal);

      const speedVal = Number(localStorage.getItem('duodrip_ig_speed')) || 3000;
      setAutoplaySpeed(speedVal);

      const arrowsVal = localStorage.getItem('duodrip_ig_arrows') !== 'false';
      setShowArrows(arrowsVal);

      const dotsVal = localStorage.getItem('duodrip_ig_dots') !== 'false';
      setShowDots(dotsVal);

      const filterVal = (localStorage.getItem('duodrip_ig_filter') || 'both') as 'both' | 'posts' | 'reels';
      setContentFilter(filterVal);

      const connectedVal = localStorage.getItem('duodrip_ig_connected') === 'true';
      setConnected(connectedVal);

      const storedUser = localStorage.getItem('duodrip_ig_username') || 'duodrip_official';
      setUsername(storedUser);

      const storedSync = localStorage.getItem('duodrip_ig_last_sync') || '';
      setLastSync(storedSync);

      const lastGeneratedUser = localStorage.getItem('duodrip_ig_posts_for_username') || '';
      const storedPosts = localStorage.getItem('duodrip_ig_posts');

      if (lastGeneratedUser !== storedUser || !storedPosts) {
        const generated = generateFeedForUsername(storedUser);
        setPosts(generated);
        localStorage.setItem('duodrip_ig_posts', JSON.stringify(generated));
        localStorage.setItem('duodrip_ig_posts_for_username', storedUser);

        // Auto-approve all newly generated posts and clear old blacklisted/pinned post IDs
        const generatedIds = generated.map(p => p.id);
        localStorage.setItem('duodrip_ig_approved_ids', JSON.stringify(generatedIds));
        localStorage.setItem('duodrip_ig_hidden_ids', JSON.stringify([]));
        localStorage.setItem('duodrip_ig_pinned_ids', JSON.stringify([]));
        localStorage.setItem('duodrip_ig_approval_required', 'false');

        const now = new Date();
        const formatted = now.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        });
        localStorage.setItem('duodrip_ig_last_sync', formatted);
        setLastSync(formatted);
      } else {
        setPosts(JSON.parse(storedPosts));
      }

      // Moderation
      setHiddenIds(JSON.parse(localStorage.getItem('duodrip_ig_hidden_ids') || '[]'));
      setPinnedIds(JSON.parse(localStorage.getItem('duodrip_ig_pinned_ids') || '[]'));
      setApprovedIds(JSON.parse(localStorage.getItem('duodrip_ig_approved_ids') || '[]'));
      setApprovalRequired(localStorage.getItem('duodrip_ig_approval_required') === 'true');
    } catch (e) {
      console.error("IG Feed state synchronization issue: ", e);
    }
  }, []);

  React.useEffect(() => {
    loadConfig();

    // Set up rapid polling interval for instant synchronization with admin preview
    const syncTimer = setInterval(loadConfig, 1000);
    return () => clearInterval(syncTimer);
  }, [loadConfig]);

  // Simulate skeleton animation whenever the dataset switches or pulls
  React.useEffect(() => {
    setIsLoading(true);
    const mockTimer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(mockTimer);
  }, [contentFilter, displayCount, connected]);

  // Apply filters, moderation and pinning rules to extract finalized displays
  const processedPosts = React.useMemo(() => {
    let list = [...posts];

    // 1. Apply platform type filter
    if (contentFilter === 'posts') {
      list = list.filter(p => p.type === 'post');
    } else if (contentFilter === 'reels') {
      list = list.filter(p => p.type === 'reel');
    }

    // 2. Hide specific blacklisted items
    list = list.filter(p => !hiddenIds.includes(p.id));

    // 3. Apply manual publishing approval queue if turned on
    if (approvalRequired) {
      list = list.filter(p => approvedIds.includes(p.id));
    }

    // 4. Pin featured posts to top
    list.sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id);
      const bPinned = pinnedIds.includes(b.id);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      return 0; // retain default ordering
    });

    // 5. Limit display volume
    return list.slice(0, displayCount);
  }, [posts, contentFilter, hiddenIds, pinnedIds, approvedIds, approvalRequired, displayCount]);

  // Premium custom Carousel Slider Logic:
  // Dynamically determines size of responsive cards:
  // - 4 items per slide on desktop (width 25% each)
  // - 2 items per slide on tablet (width 50% each)
  // - 1 item per slide on mobile (width 100% each)
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [visibleCount, setVisibleCount] = React.useState(4);

  // Monitor responsive sizes of viewport manually
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setVisibleCount(4);
      else if (width >= 768) setVisibleCount(2);
      else setVisibleCount(1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute maximum index constraint space
  const maxIndex = Math.max(0, processedPosts.length - visibleCount);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : Math.max(0, prev - 1)));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Safe Index calibration when datasets shrink/grow dynamically
  React.useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [processedPosts.length, maxIndex, currentIndex]);

  // Autoplay intervals
  React.useEffect(() => {
    if (!autoplay || maxIndex === 0 || isLoading) return;
    const interval = setInterval(() => {
      nextSlide();
    }, autoplaySpeed);
    return () => clearInterval(interval);
  }, [autoplay, autoplaySpeed, maxIndex, isLoading]);

  if (!isEnabled) return null;

  return (
    <section className="bg-white py-24 border-t border-neutral-100 font-['Hanken_Grotesk'] overflow-hidden" id="instagram-integration-hub">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative">
        
        {/* Modern high contrast Section Title Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="text-left space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-[0.3em] text-[#ba1a1a] uppercase">
                INSTAGRAM GALLERY
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-ping" />
            </div>
            
            <h2 className="font-['Bodoni_Moda'] text-3xl md:text-5xl font-bold tracking-tight text-black flex items-center gap-3">
              <Instagram className="w-8 h-8 md:w-11 md:h-11 stroke-1 text-black" />
              <span>Curation Feed</span>
            </h2>
          </div>
          <div className="text-left md:text-right space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">
              COUTURE SOCIAL NETWORK
            </span>
            <a 
              href={`https://instagram.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-black hover:text-[#ba1a1a] transition-all flex items-center gap-1 leading-relaxed inline-flex"
            >
              @{username} on Instagram <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* LOADING SHIM SKELETON STATE */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-neutral-100 border border-neutral-250/25 flex flex-col justify-end p-4 space-y-3 rounded-none">
                <div className="h-4 bg-neutral-250 w-2/3" />
                <div className="h-3 bg-neutral-250 w-1/2" />
              </div>
            ))}
          </div>
        ) : processedPosts.length === 0 ? (
          /* Empty Sandbox state UI */
          <div className="bg-neutral-50/50 border border-dashed border-neutral-300 py-16 px-6 text-center max-w-2xl mx-auto space-y-4">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
            <h3 className="font-bold text-base text-black uppercase tracking-wider">Feed Content Unapproved or Hidden</h3>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              Welcome to the Instagram showcase! Head to the <strong>Admin Dashboard &gt; Instagram Feed</strong> tab to manage, approve items, unhide content or connect active profiles.
            </p>
          </div>
        ) : (
          /* ACTIVE PRESET DESKTOP CAROUSEL GRID */
          <div className="relative group/carousel">
            
            {/* CAROUSEL CLIP TRACK container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
                }}
              >
                {processedPosts.map((post, postIdx) => {
                  const isPinned = pinnedIds.includes(post.id);
                  return (
                    <div 
                      key={`instagram-post-${post.id || postIdx}-${postIdx}`} 
                      className="px-3 shrink-0"
                      style={{ width: `${100 / visibleCount}%` }}
                    >
                      {/* Premium Instagram-inspired Card Frame */}
                      <a 
                        href={post.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block group/card relative aspect-[3/4] bg-neutral-50 border border-black/5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-black/10 rounded-none cursor-pointer"
                      >
                        {/* High-fidelity responsive photography */}
                        <img 
                          src={post.mediaUrl} 
                          alt="" 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-103"
                          referrerPolicy="no-referrer"
                        />

                        {/* Pinned Marker Header badge */}
                        {isPinned && (
                          <span className="absolute top-3 left-3 bg-black text-white text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 z-10 shadow-sm flex items-center gap-1">
                            <Sparkles className="w-2 h-2 fill-white" /> PINNED
                          </span>
                        )}

                        {/* Media type indicator icon badge */}
                        {post.type === 'reel' && (
                          <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 z-10">
                            <Play className="w-2.5 h-2.5 fill-white text-transparent" />
                            REEL
                          </span>
                        )}

                        {/* Fully responsive dark overlay interaction on Hover hover:bg-black/60 */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white text-left text-xs space-y-3 z-15">
                          
                          {/* Metrics stats block */}
                          <div className="flex items-center gap-4 text-xs font-bold">
                            <span className="flex items-center gap-1 hover:scale-110 transition-transform">
                              <Heart className="w-4 h-4 text-red-550 fill-red-550 text-transparent" />
                              {post.likeCount.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
                              {(post.commentCount || 0).toLocaleString()}
                            </span>
                          </div>

                          {/* Truncated caption summary */}
                          <p className="line-clamp-2 text-[11px] leading-relaxed text-neutral-200 antialiased font-medium">
                            {post.caption}
                          </p>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-bold tracking-wider uppercase text-neutral-300">
                            <span>Visit instagram</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sub-block C: Navigation arrows */}
            {showArrows && maxIndex > 0 && (
              <>
                <button
                  type="button"
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-white text-black shadow-lg border border-black/10 flex items-center justify-center hover:bg-black hover:text-white hover:scale-105 active:scale-95 transition-all z-20 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                  title="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-white text-black shadow-lg border border-black/10 flex items-center justify-center hover:bg-black hover:text-white hover:scale-105 active:scale-95 transition-all z-20 opacity-0 group-hover/carousel:opacity-100 cursor-pointer"
                  title="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Sub-block D: Pagination slides dots */}
            {showDots && maxIndex > 0 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx ? 'bg-black w-6' : 'bg-neutral-250 hover:bg-neutral-400'
                    }`}
                    title={`Go to item ${idx + 1}`}
                  />
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
