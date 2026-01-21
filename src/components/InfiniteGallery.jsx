import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Engagement/proposal photos
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

// Lightbox component with full accessibility
function Lightbox({ imageIndex, onClose, onPrev, onNext }) {
  const [direction, setDirection] = useState(0);
  const closeButtonRef = useRef(null);
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);

  // Focus trap and keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setDirection(-1);
        onPrev();
      } else if (e.key === 'ArrowRight') {
        setDirection(1);
        onNext();
      } else if (e.key === 'Tab') {
        // Trap focus within lightbox
        const focusableElements = [prevButtonRef.current, nextButtonRef.current, closeButtonRef.current];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    // Focus the close button on open
    closeButtonRef.current?.focus();

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Foto ${imageIndex + 1} van ${images.length}`;
    document.body.appendChild(announcement);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      announcement.remove();
    };
  }, [onClose, onPrev, onNext, imageIndex]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setDirection(-1);
    onPrev();
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setDirection(1);
    onNext();
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotogalerij, foto ${imageIndex + 1} van ${images.length}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 focus:bg-white/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        onClick={onClose}
        aria-label="Sluiten (Escape)"
      >
        <X className="w-8 h-8 text-white" aria-hidden="true" />
      </button>

      {/* Previous button */}
      <button
        ref={prevButtonRef}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 focus:bg-white/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        onClick={handlePrev}
        aria-label="Vorige foto (pijltje links)"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
      </button>

      {/* Next button */}
      <button
        ref={nextButtonRef}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 focus:bg-white/30 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
        onClick={handleNext}
        aria-label="Volgende foto (pijltje rechts)"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
      </button>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm" aria-hidden="true">
        {imageIndex + 1} / {images.length}
      </div>

      {/* Screen reader only live region for image changes */}
      <div className="sr-only" role="status" aria-live="polite">
        Foto {imageIndex + 1} van {images.length}
      </div>

      {/* Image with animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={imageIndex}
          src={images[imageIndex]}
          alt=""
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          draggable={false}
        />
      </AnimatePresence>
    </motion.div>
  );
}

export default function InfiniteGallery() {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const animationRef = useRef(null);

  // Calculate single set width (7 images * (288px + 24px gap))
  const singleSetWidth = images.length * (288 + 24);

  // Start auto-scroll animation
  const startAutoScroll = useCallback(() => {
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
  }, [isInteracting, singleSetWidth, x]);

  const stopAutoScroll = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isInteracting || selectedIndex !== null) {
      stopAutoScroll();
    } else {
      const timeout = setTimeout(() => {
        startAutoScroll();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isInteracting, selectedIndex, startAutoScroll, stopAutoScroll]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startAutoScroll();
    }, 1000);
    return () => {
      clearTimeout(timeout);
      stopAutoScroll();
    };
  }, [startAutoScroll, stopAutoScroll]);

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

  const handleImageClick = (index) => {
    if (!isDragging) {
      setSelectedIndex(index % images.length);
    }
  };

  const handleImageKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick(index);
    }
  };

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, []);

  return (
    <>
      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox 
            imageIndex={selectedIndex} 
            onClose={() => setSelectedIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden py-12 bg-cream-dark/50"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setTimeout(() => setIsInteracting(false), 100)}
        role="region"
        aria-label="Fotogalerij van de verloving"
      >
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" aria-hidden="true" />
        
        {/* Drag hint */}
        <motion.p 
          className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-dusty-light z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          aria-hidden="true"
        >
          ← Swipe om te bladeren →
        </motion.p>

        {/* Screen reader instructions */}
        <p className="sr-only">
          Fotogalerij met {images.length} foto's van de verloving. Gebruik Tab om door de foto's te navigeren, Enter om te vergroten.
        </p>

        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -singleSetWidth * 2, right: singleSetWidth }}
          dragElastic={0.05}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          role="list"
        >
          {duplicatedImages.map((src, index) => (
            <motion.div
              key={index}
              role="listitem"
              tabIndex={0}
              className="flex-shrink-0 w-72 h-48 md:w-96 md:h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-navy focus:ring-offset-2"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              onClick={() => handleImageClick(index)}
              onKeyDown={(e) => handleImageKeyDown(e, index)}
              aria-label={`Foto ${(index % images.length) + 1}. Druk Enter om te vergroten.`}
            >
              <img
                src={src}
                alt=""
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
