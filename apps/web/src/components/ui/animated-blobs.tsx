import { motion } from 'motion/react';

export const AnimatedBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blob 1 */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          top: '10%',
          left: '10%',
        }}
      />

      {/* Blob 2 */}
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-success/15 to-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 120, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        style={{
          top: '60%',
          right: '15%',
        }}
      />

      {/* Blob 3 */}
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-r from-accent/20 to-success/15 rounded-full blur-2xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -60, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          bottom: '20%',
          left: '20%',
        }}
      />
    </div>
  );
};
