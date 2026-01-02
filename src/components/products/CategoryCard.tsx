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
            className="group"
        >
            <Link
                to={`/categories?category=${category.slug}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                className="block"
            >
                <div className="bg-card rounded-xl overflow-hidden border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img
                            src={category.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600'}
                            alt={name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4">
                        <h3 className="font-display font-semibold text-foreground text-sm md:text-base lg:text-lg group-hover:text-primary transition-colors">
                            {name}
                        </h3>

                        <div className="flex items-center justify-between mt-2">
                            <span className="text-muted-foreground text-xs md:text-sm">
                                {locale === 'zh' ? '查看产品' : 'View Products'}
                            </span>
                            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
