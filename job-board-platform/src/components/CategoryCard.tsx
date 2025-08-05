import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
    icon: ReactNode;
    title: string;
    count: number;
    isHighlighted?: boolean;
}

const CategoryCard = ({ icon, title, count, isHighlighted = false }: CategoryCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={{ once: true }}
            className={`flex items-start gap-4 p-6 rounded-xl border shadow-sm hover:shadow-md transition
                ${isHighlighted ? 'bg-blue-50 border-blue-400' : 'bg-white'}`}
        >
            <div className="text-3xl text-blue-600">{icon}</div>
            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{count} job{count !== 1 ? 's' : ''} available</p>
            </div>
        </motion.div>
    );
};

export default CategoryCard;
