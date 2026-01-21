import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoveCounter() {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // First kiss at Pukkelpop: August 20, 2022
  const firstDate = new Date('2022-08-20T14:30:00');

  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date();
      const diff = now - firstDate;
      
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      setElapsed({
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
      });
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const TimeBlock = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-md border border-cream-dark px-2 py-1.5 md:px-4 md:py-2 min-w-[50px] md:min-w-[70px]">
        <span className="font-serif text-xl md:text-3xl text-navy font-medium tabular-nums">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-dusty text-[10px] md:text-xs mt-1.5 uppercase tracking-wider">{label}</span>
    </div>
  );

  const milestones = [
    { emoji: '🏠', title: 'Samen in Berchem', date: '1 juli 2023' },
    { emoji: '🐕', title: 'Pixie kwam erbij!', date: '26 maart 2025' },
  ];

  return (
    <section className="py-12 md:py-16 px-6 bg-gradient-to-b from-cream to-white">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Pukkelpop kiss photo */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative inline-block">
            <img 
              src="/images/pukkelpop2022.jpg" 
              alt="Onze eerste kus op Pukkelpop 2022"
              className="w-72 h-72 md:w-96 md:h-96 object-cover object-top rounded-full shadow-lg border-4 border-white"
            />
            <motion.div
              className="absolute -bottom-2 -right-2 text-3xl bg-white rounded-full p-2 shadow-md"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              💋
            </motion.div>
          </div>
        </motion.div>
        
        <h3 className="font-serif text-2xl md:text-3xl text-navy mb-1">
          Onze eerste kus
        </h3>
        <p className="text-dusty text-sm mb-5">Pukkelpop 2022</p>

        {/* Counter */}
        <div className="flex justify-center items-center gap-1 md:gap-3">
          <TimeBlock value={elapsed.days} label="dagen" />
          <span className="text-dusty text-xl md:text-2xl font-light mt-[-16px]">:</span>
          <TimeBlock value={elapsed.hours} label="uren" />
          <span className="text-dusty text-xl md:text-2xl font-light mt-[-16px]">:</span>
          <TimeBlock value={elapsed.minutes} label="min" />
          <span className="text-dusty text-xl md:text-2xl font-light mt-[-16px]">:</span>
          <TimeBlock value={elapsed.seconds} label="sec" />
        </div>

        {/* Tagline */}
        <p className="text-dusty/60 text-xs mt-4 italic mb-10">
          ...en we zijn nog lang niet uitgeteld 💕
        </p>

        {/* Milestones */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-cream-dark px-5 py-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <span className="text-2xl">{milestone.emoji}</span>
              <div className="text-left">
                <p className="font-medium text-navy text-sm">{milestone.title}</p>
                <p className="text-dusty text-xs">{milestone.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
