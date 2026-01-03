import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DbCategory } from '@/lib/supabase';

interface CategoryCardProps {
    category: DbCategory;
    index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
    const { locale } = useLanguage();
    const name = locale === 'zh' ? category.name_zh : category.name_en;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="group h-full"
        >
            <Link
                to={`/categories?category=${category.slug}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="block h-full"
            >
                <div className="h-full bg-card rounded-xl overflow-hidden border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 flex flex-col">
                    {/* Image - Fixed aspect ratio */}
                    <div className="aspect-[4/3] overflow-hidden bg-muted flex-shrink-0">
                        <img
                            src={category.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
                            alt={name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Content - Fixed height with flex layout */}
                    <div className="p-3 md:p-4 flex flex-col flex-1">
                        {/* Title - Single line with ellipsis */}
                        <h3 className="font-display font-semibold text-foreground text-sm md:text-base lg:text-lg group-hover:text-primary transition-colors line-clamp-1">
                            {name}
                        </h3>

                        {/* CTA Button - Pushed to bottom */}
                        <div className="mt-auto pt-2">
                            <div
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium transition-all duration-300 group-hover:gap-1.5"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid transparent',
                                    backgroundImage: 'linear-gradient(hsl(222,47%,11%), hsl(222,47%,11%)), linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)',
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'padding-box, border-box'
                                }}
                            >
                                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f97316 100%)' }}>
                                    {locale === 'zh' ? '探索' : 'Explore'}
                                </span>
                                <ArrowRight className="w-3 h-3 text-primary transition-transform group-hover:translate-x-0.5" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
