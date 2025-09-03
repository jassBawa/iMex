import { motion } from 'motion/react';

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Trading symbols floating */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10 font-mono text-sm"
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2,
            ease: 'easeOut',
          }}
          style={{
            left: `${20 + i * 15}%`,
            bottom: '10%',
          }}
        >
          {['EUR/USD', 'GBP/USD', 'USD/JPY', 'BTC/USD', 'ETH/USD', 'GOLD'][i]}
        </motion.div>
      ))}

      {/* Geometric shapes */}
      <motion.div
        className="absolute w-4 h-4 bg-primary/20 rounded-full"
        animate={{
          x: [0, 300],
          y: [0, -200],
          scale: [1, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        style={{
          top: '80%',
          left: '10%',
        }}
      />

      <motion.div
        className="absolute w-6 h-1 bg-success/30 rounded-full"
        animate={{
          x: [0, -200],
          y: [0, -150],
          rotate: [0, 360],
          scale: [1, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 3,
        }}
        style={{
          top: '70%',
          right: '20%',
        }}
      />
    </div>
  );
};
