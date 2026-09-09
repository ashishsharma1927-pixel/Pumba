import { Section } from '../layout/Section';
import { Container } from '../ui/Container';
import { CategoryCard, type CategoryCardProps } from '../components/CategoryCard';
import { motion } from 'framer-motion';

const CATEGORIES: CategoryCardProps[] = [
  {
    title: 'Tech',
    description: 'Next-gen devices and smart gadgets.',
    count: 142,
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop', // Abstract tech/electronics
    delay: 0.1,
  },
  {
    title: 'Fashion',
    description: 'Minimalist futuristic apparel.',
    count: 89,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', // Fashion
    delay: 0.2,
  },
  {
    title: 'Accessories',
    description: 'Precision crafted everyday carries.',
    count: 215,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', // Watch/Accessory
    delay: 0.3,
  },
  {
    title: 'Lifestyle',
    description: 'Elevate your living space.',
    count: 64,
    imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800&auto=format&fit=crop', // Minimal interior
    delay: 0.4,
  },
  {
    title: 'Gaming',
    description: 'High-performance rigs and gear.',
    count: 112,
    imageUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=800&auto=format&fit=crop', // Gaming setup
    delay: 0.5,
  },
  {
    title: 'Workspace',
    description: 'Tools for the modern creator.',
    count: 78,
    imageUrl: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=800&auto=format&fit=crop', // Clean desk
    delay: 0.6,
  },
];

export const Categories = () => {
  return (
    <Section className="relative z-10 bg-background border-t border-white/5 py-24">
      <Container>
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-4"
          >
            Explore the Collection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            Designed for the way you live, work and create.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.title}
              {...category}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};
