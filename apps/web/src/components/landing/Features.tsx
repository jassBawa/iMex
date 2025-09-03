import { motion } from 'motion/react';
import { FeatureCard } from '@/components/landing/feature-card';
import { Smartphone, BarChart3, Shield, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Mobile Trading',
      description: 'Trade anywhere with our mobile app',
    },
    {
      icon: BarChart3,
      title: 'Advanced Charts',
      description: 'Professional tools and indicators',
    },
    {
      icon: Shield,
      title: 'Secure & Regulated',
      description: 'Your funds are protected',
    },
    {
      icon: Zap,
      title: 'Fast Execution',
      description: 'Lightning-fast order processing',
    },
  ];

  return (
    <section
      className="py-20 bg-muted/10 relative overflow-hidden"
      id="features"
    >
      {/* Background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Why Choose TradePro
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Professional trading platform built for modern traders
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
