import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

// Lightbox component with navigation
function Lightbox({ imageIndex, onClose, onPrev, onNext }) {
  const [direction, setDirection] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setDirection(-1);
        onPrev();
      }
      if (e.key === 'ArrowRight') {
        setDirection(1);
        onNext();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
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

      {/* Previous button */}
      <button
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        onClick={handlePrev}
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Next button */}
      <button
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        onClick={handleNext}
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </button>

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {imageIndex + 1} / {images.length}
      </div>

      {/* Image with animation */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.img
          key={imageIndex}
          src={images[imageIndex]}
          alt={`Photo ${imageIndex + 1}`}
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
    if (isInteracting || selectedIndex !== null) {
      stopAutoScroll();
    } else {
      const timeout = setTimeout(() => {
        startAutoScroll();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isInteracting, selectedIndex]);

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

  const handleImageClick = (index) => {
    // Only open lightbox if not dragging
    if (!isDragging) {
      // Normalize index to original images array
      setSelectedIndex(index % images.length);
    }
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

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
              onClick={() => handleImageClick(index)}
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
