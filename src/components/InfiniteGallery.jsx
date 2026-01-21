import { motion } from 'framer-motion';

// Unsplash placeholder images for wedding theme
const images = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop', // wedding couple
  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop', // wedding venue
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=400&fit=crop', // wedding flowers
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=400&fit=crop', // wedding rings
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', // wedding cake
  'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=600&h=400&fit=crop', // wedding celebration
  'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=400&fit=crop', // wedding dance
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=400&fit=crop', // wedding bouquet
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

