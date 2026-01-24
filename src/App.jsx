import { Heart, Calendar, MapPin, ChevronDown, Copy, Check, Volume2 } from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import InfiniteGallery from './components/InfiniteGallery';
import RSVPForm from './components/RSVPForm';
import VenueMap from './components/VenueMap';
import LoveCounter from './components/LoveCounter';

// Music APIs for preview
const DEEZER_SEARCH_URL = 'https://api.deezer.com/search';
const ITUNES_SEARCH_URL = 'https://itunes.apple.com/search';
const CORS_PROXY = 'https://corsproxy.io/?';

// Hook to handle welcome sound on page load
function useWelcomeSound() {
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const previewUrlRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Try iTunes API (no CORS proxy needed)
    const tryItunes = async () => {
      try {
        const response = await fetch(
          `${ITUNES_SEARCH_URL}?term=${encodeURIComponent('raye where is my husband')}&media=music&limit=5`
        );
        const data = await response.json();
        
        const track = data.results?.find(t => 
          t.trackName?.toLowerCase().includes('husband') && 
          t.artistName?.toLowerCase().includes('raye')
        ) || data.results?.[0];
        
        if (track?.previewUrl) {
          return track.previewUrl;
        }
      } catch (e) {
        console.log('iTunes search failed:', e);
      }
      return null;
    };

    // Try Deezer API with proxy
    const tryDeezer = async () => {
      try {
        const searchUrl = `${DEEZER_SEARCH_URL}?q=${encodeURIComponent('raye where is my husband')}&limit=5`;
        const fetchUrl = `${CORS_PROXY}${encodeURIComponent(searchUrl)}`;
        
        const response = await fetch(fetchUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        const data = await response.json();
        
        const track = data.data?.find(t => 
          t.title?.toLowerCase().includes('husband') && 
          t.artist?.name?.toLowerCase().includes('raye')
        ) || data.data?.[0];
        
        if (track?.preview) {
          return track.preview;
        }
      } catch (e) {
        console.log('Deezer search failed:', e);
      }
      return null;
    };

    // Fetch preview URL - try iTunes first, then Deezer
    const fetchPreview = async () => {
      try {
        let previewUrl = await tryItunes();
        
        if (!previewUrl) {
          previewUrl = await tryDeezer();
        }
        
        if (previewUrl) {
          console.log('Found preview URL:', previewUrl);
          previewUrlRef.current = previewUrl;
          
          // Try to autoplay (will likely fail on mobile)
          try {
            audioRef.current = new Audio(previewUrl);
            audioRef.current.volume = 0.5;
            await audioRef.current.play();
            setHasPlayed(true);
            
            // Add fade out
            audioRef.current.addEventListener('timeupdate', () => {
              const audio = audioRef.current;
              if (!audio || !audio.duration) return;
              const fadeStart = audio.duration - 3;
              if (audio.currentTime >= fadeStart) {
                const fadeProgress = (audio.currentTime - fadeStart) / 3;
                audio.volume = Math.max(0, 0.5 * (1 - fadeProgress));
              }
            });
          } catch {
            // Autoplay blocked - show prompt
            setShowPrompt(true);
          }
        } else {
          console.log('No preview found from any source');
        }
      } catch (error) {
        console.log('Failed to fetch preview:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to let page settle
    const timeout = setTimeout(fetchPreview, 800);

    return () => {
      clearTimeout(timeout);
      audioRef.current?.pause();
    };
  }, []);

  // Play sound - creates fresh audio on user gesture for mobile compatibility
  const playSound = () => {
    if (!previewUrlRef.current) {
      console.log('No preview URL available');
      return;
    }
    
    try {
      // Always create fresh audio element on user gesture (required for mobile)
      const audio = new Audio(previewUrlRef.current);
      audio.volume = 0.5;
      
      // Add fade out at end
      audio.addEventListener('timeupdate', () => {
        if (!audio.duration) return;
        const fadeStart = audio.duration - 3;
        if (audio.currentTime >= fadeStart) {
          const fadeProgress = (audio.currentTime - fadeStart) / 3;
          audio.volume = Math.max(0, 0.5 * (1 - fadeProgress));
        }
      });
      
      // Play immediately within the user gesture
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playing successfully');
            audioRef.current = audio;
            setHasPlayed(true);
            setShowPrompt(false);
          })
          .catch((error) => {
            console.log('Play failed:', error);
          });
      }
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  return { showPrompt, playSound, hasPlayed, isLoading };
}

// Dark to light page entrance overlay
function PageEntranceOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ 
        duration: 2.5, 
        ease: "easeOut",
        delay: 0.3 
      }}
      onAnimationComplete={(definition) => {
        // Remove from DOM after animation
        if (definition.opacity === 0) {
          const el = document.getElementById('page-entrance-overlay');
          if (el) el.style.display = 'none';
        }
      }}
      id="page-entrance-overlay"
    />
  );
}

// Sound prompt component
function SoundPrompt({ onPlay }) {
  const [tapped, setTapped] = useState(false);
  
  const handleClick = () => {
    setTapped(true);
    onPlay();
    // Reset after a moment in case it fails
    setTimeout(() => setTapped(false), 2000);
  };
  
  return (
    <motion.button
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onClick={handleClick}
      disabled={tapped}
      className="fixed left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-sm border border-gold/30 rounded-full px-5 py-2.5 shadow-lg hidden md:flex items-center justify-center gap-2 hover:bg-white transition-colors cursor-pointer disabled:opacity-70"
      style={{ top: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
    >
      {tapped ? (
        <>
          <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin flex-shrink-0" />
          <span className="text-navy text-sm font-medium whitespace-nowrap">Laden...</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-navy flex-shrink-0" />
          <span className="text-navy text-sm font-medium whitespace-nowrap">Tik voor muziek! 🎵</span>
        </>
      )}
    </motion.button>
  );
}

// Crisp bright sparkle using CSS star shape
function CrispSparkle({ x, y, delay, size }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ 
        left: x, 
        top: y,
      }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, 1.2, 1, 0],
        rotate: [0, 90],
      }}
      transition={{
        duration: 0.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 0.8,
        ease: "easeOut",
      }}
    >
      {/* 4-point star using rotated squares */}
      <div 
        className="relative"
        style={{ width: size, height: size }}
      >
        {/* Horizontal line */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white"
          style={{ 
            width: size * 2.5, 
            height: 2,
            boxShadow: '0 0 4px #fff, 0 0 8px #fff, 0 0 16px #c9a959',
          }}
        />
        {/* Vertical line */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white"
          style={{ 
            width: 2, 
            height: size * 2.5,
            boxShadow: '0 0 4px #fff, 0 0 8px #fff, 0 0 16px #c9a959',
          }}
        />
        {/* Diagonal line 1 */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80"
          style={{ 
            width: size * 1.8, 
            height: 1,
            transform: 'translate(-50%, -50%) rotate(45deg)',
            boxShadow: '0 0 3px #fff, 0 0 6px #c9a959',
          }}
        />
        {/* Diagonal line 2 */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80"
          style={{ 
            width: size * 1.8, 
            height: 1,
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            boxShadow: '0 0 3px #fff, 0 0 6px #c9a959',
          }}
        />
        {/* Bright center */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
          style={{ 
            width: 4, 
            height: 4,
            boxShadow: '0 0 4px 2px #fff, 0 0 12px 4px #c9a959',
          }}
        />
      </div>
    </motion.div>
  );
}

// Sparkles Container - Bright crisp sparkles
function SparklesEffect() {
  const sparkles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: `${Math.random() * 85 + 7}%`,
      y: `${Math.random() * 75 + 12}%`,
      delay: Math.random() * 3,
      size: Math.random() * 8 + 6, // 6-14px
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <CrispSparkle 
          key={sparkle.id} 
          x={sparkle.x} 
          y={sparkle.y} 
          delay={sparkle.delay}
          size={sparkle.size}
        />
      ))}
    </div>
  );
}

// Animated Gradient Background
function AnimatedGradient() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        background: [
          'radial-gradient(ellipse at 20% 20%, rgba(114, 47, 55, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(201, 169, 89, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(253, 251, 247, 1) 0%, rgba(245, 240, 232, 1) 100%)',
          'radial-gradient(ellipse at 80% 30%, rgba(114, 47, 55, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(201, 169, 89, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(253, 251, 247, 1) 0%, rgba(245, 240, 232, 1) 100%)',
          'radial-gradient(ellipse at 30% 80%, rgba(114, 47, 55, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(201, 169, 89, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(253, 251, 247, 1) 0%, rgba(245, 240, 232, 1) 100%)',
          'radial-gradient(ellipse at 20% 20%, rgba(114, 47, 55, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(201, 169, 89, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(253, 251, 247, 1) 0%, rgba(245, 240, 232, 1) 100%)',
        ],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Gift Info Component
function GiftInfo() {
  const [copied, setCopied] = useState(false);
  const bankNumber = 'BE82 7330 7478 1168';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankNumber.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 px-6">
      <motion.div 
        className="max-w-md mx-auto text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-dusty text-sm mb-2">
          💌 Een bijdrage is altijd welkom:
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-sm text-navy">
            {bankNumber}
          </span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-navy/10 rounded transition-colors"
            title="Kopieer"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-dusty" />
            )}
          </button>
        </div>
        <p className="text-xs text-dusty mt-1">HOFMAN-LOENDERS</p>
      </motion.div>
    </section>
  );
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

function App() {
  const weddingDate = new Date('2026-07-31');
  const { showPrompt, playSound, hasPlayed, isLoading } = useWelcomeSound();
  
  return (
    <div className="min-h-screen bg-cream">
      {/* Dark to light page entrance */}
      <PageEntranceOverlay />

      {/* Sound prompt if autoplay blocked */}
      <AnimatePresence>
        {showPrompt && !hasPlayed && !isLoading && (
          <SoundPrompt onPlay={playSound} />
        )}
      </AnimatePresence>

      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#722F37',
            color: '#fff',
            fontFamily: 'Raleway, sans-serif',
          },
          success: {
            iconTheme: { primary: '#fff', secondary: '#722F37' },
          },
          error: {
            style: { background: '#dc2626' },
          },
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <AnimatedGradient />
        
        {/* Sparkle Particles */}
        <SparklesEffect />

        <motion.div 
          className="relative z-10 text-center px-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Pre-heading */}
          <motion.p 
            variants={fadeInUp}
            className="text-dusty tracking-[0.3em] uppercase text-sm mb-4"
          >
            Wij gaan trouwen
          </motion.p>
          
          {/* Names with bird behind */}
          <motion.div 
            variants={fadeInUp}
            className="relative mb-6"
          >
            {/* Pigeons - behind names */}
            <motion.img
              src="/images/pigeons.png"
              alt=""
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 lg:w-[450px] h-auto opacity-[0.12] pointer-events-none"
              animate={{ 
                rotate: [0, 2, 0, -2, 0],
                y: [0, -5, 0, 3, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: 'easeInOut',
              }}
            />
            
            <h1 className="relative z-10 font-serif text-6xl md:text-8xl lg:text-9xl text-navy leading-tight">
              Hanna
              <span className="block text-3xl md:text-4xl lg:text-5xl text-dusty my-2 md:my-4">&</span>
              Tristan
            </h1>
          </motion.div>

          {/* Heart Icon */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-center mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <Heart className="w-8 h-8 text-navy fill-navy/20" />
            </motion.div>
          </motion.div>

          {/* Date */}
          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 text-dusty mb-8"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xl md:text-2xl font-light tracking-wide">
              31 Juli 2026
            </span>
          </motion.div>

          {/* RSVP Button */}
          <motion.a
            variants={fadeInUp}
            href="#rsvp"
            className="inline-flex items-center gap-2 bg-navy text-white py-4 px-10 rounded-full font-medium text-lg hover:bg-navy-dark transition-all hover:shadow-xl shadow-lg"
          >
            Bevestig je komst
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => document.getElementById('love-counter')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-label="Scroll naar beneden"
        >
          <ChevronDown className="w-8 h-8 text-dusty-light" />
        </motion.button>
      </section>

      {/* Love Counter - Pukkelpop first kiss */}
      <LoveCounter />

      {/* Gallery Section - Proposal photos */}
      <section className="py-16 md:py-24">
        <motion.div 
          className="text-center mb-8 px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-3">
            En toen zei ze ja! 💍
          </h2>
          <p className="text-dusty text-lg mb-1">Pukkelpop, 15 augustus 2025</p>
        </motion.div>
        
        <InfiniteGallery />
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="relative py-16 md:py-24 px-6 overflow-hidden">
        {/* Sparkles behind the form */}
        <SparklesEffect />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-navy mb-4">RSVP</h2>
            <p className="text-dusty max-w-xl mx-auto">
              Kom je mee feesten? We hopen je erbij te zien!
            </p>
          </motion.div>

          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-cream-dark"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RSVPForm />
          </motion.div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" className="py-16 md:py-24 px-6 bg-cream-dark/30">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-navy/10 rounded-full mb-6">
              <MapPin className="w-8 h-8 text-navy" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-navy mb-4">Locatie</h2>
            <p className="text-dusty max-w-xl mx-auto">
              Hier vieren we het feest!
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VenueMap />
          </motion.div>
        </div>
      </section>

      {/* Gift Info */}
      <GiftInfo />

      {/* Footer */}
      <footer className="py-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-navy fill-navy/30" />
          </div>
          <p className="font-serif text-2xl text-navy mb-2">Hanna & Tristan</p>
          <p className="text-dusty text-sm">
            31 Juli 2026 • Hoboken, België
          </p>
          <p className="text-dusty-light text-xs mt-8">
            Made with ♥ by a 🤓
          </p>
        </motion.div>
      </footer>
    </div>
  );
}

export default App;
