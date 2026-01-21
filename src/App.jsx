import { Heart, Calendar, MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HeroPhotos from './components/HeroPhotos';
import InfiniteGallery from './components/InfiniteGallery';
import RSVPForm from './components/RSVPForm';
import VenueMap from './components/VenueMap';

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
  
  return (
    <div className="min-h-screen bg-cream">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e3a8a',
            color: '#fff',
            fontFamily: 'Nunito Sans, sans-serif',
          },
          success: {
            iconTheme: { primary: '#fff', secondary: '#1e3a8a' },
          },
          error: {
            style: { background: '#dc2626' },
          },
        }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Floating polaroid photos in background */}
        <HeroPhotos />

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
          
          {/* Names */}
          <motion.h1 
            variants={fadeInUp}
            className="font-serif text-6xl md:text-8xl lg:text-9xl text-navy mb-6 leading-tight"
          >
            Tristan
            <span className="block text-3xl md:text-4xl lg:text-5xl text-dusty my-2 md:my-4">&</span>
            Hanna
          </motion.h1>

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

          {/* CTA Button */}
          <motion.a
            variants={fadeInUp}
            href="#rsvp"
            className="inline-flex items-center gap-2 bg-navy text-white py-4 px-10 rounded-full font-medium text-lg hover:bg-navy-dark transition-all hover:shadow-xl shadow-lg"
          >
            Bevestig je komst
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-8 h-8 text-dusty-light" />
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24">
        <motion.div 
          className="text-center mb-12 px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-navy mb-4">
            Die ene avond op Pukkelpop...
          </h2>
        </motion.div>
        
        <InfiniteGallery />
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-16 md:py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-navy mb-4">RSVP</h2>
            <p className="text-dusty max-w-xl mx-auto">
              Laat ons weten of je erbij bent op onze grote dag
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
              Waar de magie gaat gebeuren
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
          <p className="font-serif text-2xl text-navy mb-2">Tristan & Hanna</p>
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
