import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { HiArrowRight, HiTrendingUp } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
    icon: ReactNode;
    title: string;
    count: number;
    isHighlighted?: boolean;
    trend?: 'up' | 'down' | 'stable';
    growthRate?: number;
    onClick?: () => void;
}

const CategoryCard = ({
    icon,
    title,
    count,
    isHighlighted = false,
    trend = 'stable',
    growthRate,
    onClick
}: CategoryCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(`/jobs?category=${encodeURIComponent(title)}`);
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'up': return 'text-green-500';
            case 'down': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    const getTrendIcon = () => {
        switch (trend) {
            case 'up': return '↗';
            case 'down': return '↘';
            default: return '→';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            viewport={{ once: true }}
            onClick={handleClick}
            className={`group relative cursor-pointer p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${isHighlighted
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-lg'
                    : 'bg-white border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200'
                }`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400 to-purple-400 rounded-full transform translate-x-16 -translate-y-16" />
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-2xl" />
            </div>

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                    {/* Icon Container */}
                    <motion.div
                        className={`p-3 rounded-xl transition-all duration-300 ${isHighlighted
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-blue-600 group-hover:bg-blue-100 group-hover:scale-110'
                            }`}
                        whileHover={{ rotate: 5 }}
                    >
                        <div className="text-2xl">{icon}</div>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                                {title}
                            </h3>
                            {isHighlighted && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-medium"
                                >
                                    Hot
                                </motion.span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">{count.toLocaleString()}</span> job{count !== 1 ? 's' : ''} available
                            </p>

                            {growthRate && (
                                <div className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
                                    <span>{getTrendIcon()}</span>
                                    <span className="font-medium">{growthRate}%</span>
                                </div>
                            )}
                        </div>

                        {/* Action Indicator */}
                        <motion.div
                            className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-200"
                            initial={{ x: -10 }}
                            whileInView={{ x: 0 }}
                        >
                            <span>Explore jobs</span>
                            <HiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Trending Indicator */}
            {trend === 'up' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-4 right-4"
                >
                    <div className="p-1.5 bg-green-100 rounded-full">
                        <HiTrendingUp className="w-3 h-3 text-green-600" />
                    </div>
                </motion.div>
            )}

            {/* Shimmer Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </div>
        </motion.div>
    );
};

export default CategoryCard;
