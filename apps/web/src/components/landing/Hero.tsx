import { motion } from 'framer-motion';
import { HeroContent } from '@/components/landing/hero-content';
import { AnimatedBlobs } from '@/components/ui/animated-blobs';
import { FloatingElements } from '@/components/ui/floating-elements';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-primary-light/50 to-accent/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Animated blobs */}
      <AnimatedBlobs />

      {/* Floating elements */}
      <FloatingElements />

      {/* Grid pattern overlay */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 1 }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <HeroContent />
      </div>
    </section>
  );
};

export default Hero;
