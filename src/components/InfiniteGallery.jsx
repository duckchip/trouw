import { motion, useMotionValue, animate } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

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

export default function InfiniteGallery() {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
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
    // Calculate remaining distance to complete one loop
    const targetX = currentX - singleSetWidth;
    // Calculate duration based on remaining distance (consistent speed)
    const remainingDistance = Math.abs(targetX - currentX);
    const duration = remainingDistance / 50; // pixels per second

    animationRef.current = animate(x, targetX, {
      duration,
      ease: 'linear',
      onComplete: () => {
        // Reset position and restart
        x.set(currentX % singleSetWidth || 0);
        if (!isInteracting) {
          startAutoScroll();
        }
      },
    });
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  };

  // Handle interaction state changes
  useEffect(() => {
    if (isInteracting) {
      stopAutoScroll();
    } else {
      // Small delay before restarting auto-scroll
      const timeout = setTimeout(() => {
        startAutoScroll();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isInteracting]);

  // Initial auto-scroll
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
    setIsInteracting(true);
  };

  const handleDragEnd = () => {
    // Normalize position to prevent drifting too far
    const currentX = x.get();
    if (currentX > 0) {
      x.set(currentX - singleSetWidth);
    } else if (currentX < -singleSetWidth * 2) {
      x.set(currentX + singleSetWidth);
    }
    
    // Resume auto-scroll after a delay
    setTimeout(() => {
      setIsInteracting(false);
    }, 100);
  };

  return (
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
            className="flex-shrink-0 w-72 h-48 md:w-96 md:h-64 rounded-xl overflow-hidden shadow-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
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
  );
}
