import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface CategoryCardProps {
  title: string;
  description: string;
  count: number;
  imageUrl: string;
  delay?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  description,
  count,
  imageUrl,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="h-80 sm:h-96 w-full"
    >
      <Link
        to={`/shop?category=${encodeURIComponent(title)}`}
        aria-label={`Explore ${title} collection, ${count} products`}
        className="group relative flex flex-col h-full w-full rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background block"
      >
        {/* Background Image with Zoom Effect */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          {/* Dark overlay for text readability, shifts on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
          <div className="absolute inset-0 bg-accent/0 mix-blend-overlay transition-colors duration-500 group-hover:bg-accent/20" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-8">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-1 group-hover:text-accent transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm text-white/70 line-clamp-1 group-hover:text-white/90 transition-colors duration-300">
                {description}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:border-white">
              <ArrowUpRight className="w-5 h-5 text-white transition-all duration-300 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>

          {/* Count Badge */}
          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md border border-white/10 text-white">
              {count} Products
            </span>
          </div>
        </div>

        {/* Glow Border Effect */}
        <div className="absolute inset-0 z-20 rounded-3xl border border-white/10 transition-colors duration-500 group-hover:border-white/30 pointer-events-none" />
      </Link>
    </motion.div>
  );
};
