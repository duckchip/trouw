import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Engagement/proposal photos - the real deal! 💍
const images = [
  '/images/proposal-1.jpg',
  '/images/proposal-2.jpg',
  '/images/proposal-3.jpg',
  '/images/proposal-4.jpg',
  '/images/proposal-5.jpg',
  '/images/proposal-6.jpg',
  '/images/proposal-7.jpg',
];

// Triple the images for seamless looping
const duplicatedImages = [...images, ...images, ...images];

// Lightbox component
function Lightbox({ src, onClose }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        onClick={onClose}
      >
        <X className="w-8 h-8 text-white" />
      </button>

      {/* Image */}
      <motion.img
        src={src}
        alt="Enlarged photo"
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}

export default function InfiniteGallery() {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const animationRef = useRef(null);

  // Calculate single set width (7 images * (288px + 24px gap))
  const singleSetWidth = images.length * (288 + 24);

  // Start auto-scroll animation
  const startAutoScroll = () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }

    const currentX = x.get();
    const targetX = currentX - singleSetWidth;
    const remainingDistance = Math.abs(targetX - currentX);
    const duration = remainingDistance / 50;

    animationRef.current = animate(x, targetX, {
      duration,
      ease: 'linear',
      onComplete: () => {
        x.set(currentX % singleSetWidth || 0);
        if (!isInteracting) {
          startAutoScroll();
        }
      },
    });
  };

  const stopAutoScroll = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  };

  useEffect(() => {
    if (isInteracting || selectedImage) {
      stopAutoScroll();
    } else {
      const timeout = setTimeout(() => {
        startAutoScroll();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isInteracting, selectedImage]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startAutoScroll();
    }, 1000);
    return () => {
      clearTimeout(timeout);
      stopAutoScroll();
    };
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
    setIsInteracting(true);
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX > 0) {
      x.set(currentX - singleSetWidth);
    } else if (currentX < -singleSetWidth * 2) {
      x.set(currentX + singleSetWidth);
    }
    
    setTimeout(() => {
      setIsDragging(false);
      setIsInteracting(false);
    }, 100);
  };

  const handleImageClick = (src) => {
    // Only open lightbox if not dragging
    if (!isDragging) {
      setSelectedImage(src);
    }
  };

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox src={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden py-12 bg-cream-dark/50"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setTimeout(() => setIsInteracting(false), 100)}
      >
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />
        
        {/* Drag hint */}
        <motion.p 
          className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-dusty-light z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          ← Swipe om te bladeren →
        </motion.p>

        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -singleSetWidth * 2, right: singleSetWidth }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {duplicatedImages.map((src, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-72 h-48 md:w-96 md:h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(src)}
            >
              <img
                src={src}
                alt={`Moment ${(index % images.length) + 1}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
                draggable={false}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}
