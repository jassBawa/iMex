import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export const HeroContent = () => {
  return (
    <div className="text-center space-y-8 max-w-4xl mx-auto">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-5xl lg:text-7xl font-bold text-foreground leading-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Trade with{' '}
          <motion.span
            className="bg-gradient-primary bg-clip-text text-transparent block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Confidence
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Access global markets with ultra-fast execution, competitive spreads,
          and advanced trading tools.
        </motion.p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="text-lg px-8 py-6">
            Trade Now
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6">
            Demo Account
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
