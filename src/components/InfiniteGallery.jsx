import { motion } from 'framer-motion';

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

// Double the images for seamless looping
const duplicatedImages = [...images, ...images];

export default function InfiniteGallery() {
  return (
    <div className="relative w-full overflow-hidden py-12 bg-cream-dark/50">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-6"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {duplicatedImages.map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-72 h-48 md:w-96 md:h-64 rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={src}
              alt={`Wedding moment ${(index % images.length) + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

