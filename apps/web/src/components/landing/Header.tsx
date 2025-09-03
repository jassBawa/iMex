import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary-foreground font-bold text-lg">T</span>
          </motion.div>
          <span className="text-xl font-bold text-foreground">TradePro</span>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-8">
          {['Features', 'Instruments', 'Platforms', 'Education'].map(
            (item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.a>
            )
          )}
        </nav>

        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign In
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button>Trade Now</Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
