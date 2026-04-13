import { Calendar, MapPin, ChevronDown, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import InfiniteGallery from './components/InfiniteGallery';
import RSVPForm from './components/RSVPForm';
import VenueMap from './components/VenueMap';

// Dark to light page entrance overlay
function PageEntranceOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] pointer-events-none bg-[#2d181c]"
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

// Small disco ball – pulse only (no spin), reusable
function SmallDiscoBall({ className = '' }) {
  return (
    <motion.div
      className={`inline-flex justify-center items-center drop-shadow-md ${className}`}
      style={{ width: 32, height: 32 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
    >
      <img src="/images/discoball.png" alt="" className="w-full h-full object-contain" />
    </motion.div>
  );
}

// Muted animated gradient – soft tints only
function AnimatedGradient() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{
        background: [
          'radial-gradient(ellipse 120% 80% at 20% 10%, rgba(213, 75, 131, 0.1) 0%, transparent 45%), radial-gradient(ellipse 80% 100% at 85% 85%, rgba(177, 73, 74, 0.08) 0%, transparent 45%), radial-gradient(ellipse 90% 70% at 50% 60%, rgba(242, 217, 209, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(254, 248, 246, 0.95) 0%, rgba(252, 238, 233, 1) 100%)',
          'radial-gradient(ellipse 100% 90% at 75% 15%, rgba(177, 73, 74, 0.09) 0%, transparent 45%), radial-gradient(ellipse 90% 90% at 15% 80%, rgba(213, 75, 131, 0.08) 0%, transparent 45%), radial-gradient(ellipse 80% 120% at 60% 40%, rgba(242, 217, 209, 0.45) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(254, 248, 246, 0.92) 0%, rgba(252, 236, 232, 1) 100%)',
          'radial-gradient(ellipse 110% 85% at 30% 20%, rgba(213, 75, 131, 0.08) 0%, transparent 45%), radial-gradient(ellipse 85% 95% at 80% 70%, rgba(177, 73, 74, 0.07) 0%, transparent 45%), radial-gradient(ellipse 95% 80% at 20% 70%, rgba(242, 217, 209, 0.48) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255, 250, 248, 0.94) 0%, rgba(252, 239, 234, 1) 100%)',
          'radial-gradient(ellipse 120% 80% at 20% 10%, rgba(213, 75, 131, 0.1) 0%, transparent 45%), radial-gradient(ellipse 80% 100% at 85% 85%, rgba(177, 73, 74, 0.08) 0%, transparent 45%), radial-gradient(ellipse 90% 70% at 50% 60%, rgba(242, 217, 209, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(254, 248, 246, 0.95) 0%, rgba(252, 238, 233, 1) 100%)',
        ],
      }}
      transition={{
        duration: 18,
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
        <div className="flex justify-center mb-3">
          <SmallDiscoBall />
        </div>
        <p className="text-dusty text-sm mb-2">
          💌 Vrijblijvende cadeautip
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="font-mono text-sm text-navy">
            {bankNumber}
          </span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-burgundy/10 rounded transition-colors"
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
  return (
    <div className="min-h-screen bg-transparent">
      {/* Dark to light page entrance */}
      <PageEntranceOverlay />

      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#B1494A',
            color: '#fff',
            fontFamily: 'DM Sans, sans-serif',
          },
          success: {
            iconTheme: { primary: '#fff', secondary: '#B1494A' },
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

        <motion.div 
          className="relative z-10 text-center px-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Pre-heading */}
          <motion.p 
            variants={fadeInUp}
            className="text-magenta font-medium tracking-[0.35em] uppercase text-xs sm:text-sm mb-5"
          >
            Wij gaan trouwen!
          </motion.p>
          
          {/* Names with disco ball behind */}
          <motion.div 
            variants={fadeInUp}
            className="relative mb-6"
          >
            {/* Disco ball - behind names, spinning */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[28rem] lg:w-[520px] pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <motion.img
                src="/images/discoball.png"
                alt=""
                className="disco-ball-sparkle w-full h-auto opacity-90 object-contain"
                animate={{ y: [0, -5, 0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
            
            <h1 className="relative z-10 font-headline text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-[0.95] opacity-95">
              <span className="text-magenta">Hanna</span>
              <span className="block font-sans font-light text-magenta text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-[0.25em] my-6 md:my-10 normal-case">&</span>
              <span className="text-burgundy">Tristan</span>
            </h1>
          </motion.div>

          {/* Disco ball icon */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-center mb-8"
          >
            <motion.div
              className="w-8 h-8 drop-shadow-md"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <img src="/images/discoball.png" alt="" className="w-full h-full object-contain" />
            </motion.div>
          </motion.div>

          {/* Date */}
          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 text-navy mb-8"
          >
            <Calendar className="w-5 h-5 text-magenta shrink-0" aria-hidden />
            <span className="font-card-detail text-sm md:text-base">
              31 Juli 2026
            </span>
          </motion.div>

          {/* RSVP Button */}
          <motion.a
            variants={fadeInUp}
            href="#rsvp"
            className="inline-flex items-center gap-2 bg-burgundy text-white py-4 px-10 rounded-full font-medium text-lg hover:bg-burgundy-dark transition-all hover:shadow-xl shadow-lg"
          >
            Bevestig je komst
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          aria-label="Scroll naar RSVP"
        >
          <ChevronDown className="w-8 h-8 text-dusty-light" />
        </motion.button>
      </section>

      {/* RSVP – directly under hero / Bevestig je komst */}
      <section 
        id="rsvp" 
        className="relative py-16 md:py-24 px-6 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(254, 248, 246, 0.9) 0%, rgba(252, 236, 240, 0.5) 100%)',
        }}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-4">
              <SmallDiscoBall />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-burgundy mb-4">RSVP</h2>
            <p className="text-dusty max-w-xl mx-auto">
              Kom je deze mooie dag met ons meevieren?
            </p>
          </motion.div>

          <motion.div 
            className="bg-white/95 rounded-2xl p-8 md:p-12 border-2 border-burgundy/15 shadow-[4px_6px_0_rgba(177,73,74,0.18)]"
            style={{ transform: 'rotate(-0.5deg)' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <RSVPForm />
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - Proposal photos */}
      <section 
        id="gallery"
        className="py-16 md:py-24"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(242, 217, 209, 0.35) 50%, rgba(252, 230, 236, 0.25) 100%)',
        }}
      >
        <motion.div 
          className="text-center mb-8 px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-3">
            <SmallDiscoBall />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl text-burgundy mb-3">
            En toen zei ze ja! 💍
          </h2>
          <p className="text-magenta/90 text-sm font-medium tracking-wide uppercase mb-1">Pukkelpop</p>
          <p className="text-dusty text-base">15 augustus 2025</p>
        </motion.div>
        
        <InfiniteGallery />
      </section>

      {/* Location Section */}
      <section 
        id="location" 
        className="py-16 md:py-24 px-6"
        style={{
          background: 'linear-gradient(180deg, rgba(242, 217, 209, 0.25) 0%, rgba(254, 248, 246, 0.6) 50%, rgba(252, 230, 236, 0.2) 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center gap-4 items-center mb-6">
              <SmallDiscoBall />
              <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy/10 rounded-full">
                <MapPin className="w-8 h-8 text-burgundy" />
              </div>
              <SmallDiscoBall />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-burgundy mb-4">Locatie</h2>
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
          <div className="flex items-center justify-center gap-2 mb-4 w-5 h-5">
            <img src="/images/discoball.png" alt="" className="w-full h-full object-contain" />
          </div>
          <p className="font-serif text-2xl text-burgundy mb-2">Hanna & Tristan</p>
          <p className="font-card-detail text-navy text-xs md:text-sm">
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
