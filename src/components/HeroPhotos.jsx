import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

// Photos with positioning for scattered polaroid effect
const photos = [
  { src: '/images/proposal-1.jpg', x: '5%', y: '10%', rotate: -12, scale: 0.9, delay: 0 },
  { src: '/images/proposal-3.jpg', x: '75%', y: '5%', rotate: 8, scale: 0.85, delay: 0.1 },
  { src: '/images/proposal-5.jpg', x: '85%', y: '55%', rotate: -6, scale: 0.8, delay: 0.2 },
  { src: '/images/proposal-7.jpg', x: '2%', y: '60%', rotate: 10, scale: 0.85, delay: 0.3 },
  { src: '/images/proposal-6.jpg', x: '70%', y: '75%', rotate: -15, scale: 0.75, delay: 0.15 },
  { src: '/images/proposal-4.jpg', x: '15%', y: '80%', rotate: 5, scale: 0.7, delay: 0.25 },
];

function FloatingPhoto({ src, x, y, rotate, scale, delay, scrollProgress }) {
  // Parallax: photos move up faster than scroll for depth
  const yOffset = useTransform(scrollProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ 
        left: x, 
        top: y, 
        y: yOffset,
        opacity,
      }}
      initial={{ opacity: 0, scale: 0.5, rotate: rotate - 20 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={{ 
        duration: 1.2, 
        delay: delay + 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      {/* Polaroid frame */}
      <div 
        className="bg-white p-2 pb-8 shadow-2xl"
        style={{ transform: `scale(${scale})` }}
      >
        <img
          src={src}
          alt=""
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover grayscale"
          loading="eager"
        />
      </div>
    </motion.div>
  );
}

export default function HeroPhotos() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Soft overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/80 to-cream z-10" />
      
      {/* Floating photos */}
      <div className="absolute inset-0">
        {photos.map((photo, index) => (
          <FloatingPhoto
            key={index}
            {...photo}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

