import { motion } from 'framer-motion';
import {
    Briefcase,
    Camera,
    Code,
    Database,
    Globe,
    Mic,
    Monitor,
    Palette,
    PenTool,
    Shield,
    Smartphone,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiViewGrid, HiViewList } from 'react-icons/hi';
import CategoryCard from '../components/CategoryCard';

const CategoryList = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showAll, setShowAll] = useState(false);

    const allCategories = [
        {
            icon: <Code />,
            title: 'Software Developer',
            count: 1245,
            isHighlighted: true,
            trend: 'up' as const,
            growthRate: 15
        },
        {
            icon: <Database />,
            title: 'Data Scientist',
            count: 856,
            trend: 'up' as const,
            growthRate: 23
        },
        {
            icon: <PenTool />,
            title: 'UX Designer',
            count: 743,
            trend: 'up' as const,
            growthRate: 12
        },
        {
            icon: <Users />,
            title: 'Project Manager',
            count: 634,
            trend: 'stable' as const,
            growthRate: 5
        },
        {
            icon: <Palette />,
            title: 'Graphic Designer',
            count: 567,
            trend: 'up' as const,
            growthRate: 8
        },
        {
            icon: <Monitor />,
            title: 'UI Designer',
            count: 489,
            isHighlighted: true,
            trend: 'up' as const,
            growthRate: 18
        },
        {
            icon: <Smartphone />,
            title: 'Mobile Developer',
            count: 423,
            trend: 'up' as const,
            growthRate: 25
        },
        {
            icon: <Globe />,
            title: 'Full Stack Developer',
            count: 398,
            trend: 'up' as const,
            growthRate: 20
        },
        {
            icon: <Shield />,
            title: 'Cybersecurity Specialist',
            count: 345,
            trend: 'up' as const,
            growthRate: 30
        },
        {
            icon: <Camera />,
            title: 'Digital Marketing',
            count: 312,
            trend: 'stable' as const,
            growthRate: 3
        },
        {
            icon: <Briefcase />,
            title: 'Business Analyst',
            count: 289,
            trend: 'up' as const,
            growthRate: 10
        },
        {
            icon: <Mic />,
            title: 'Content Creator',
            count: 267,
            trend: 'up' as const,
            growthRate: 35
        }
    ];

    const itemsPerPage = 6;
    const displayedCategories = showAll ? allCategories : allCategories.slice(0, itemsPerPage);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >


                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Explore Career Opportunities
                    </h2>

                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover thousands of job opportunities across various industries and skill levels.
                        Find the perfect role that matches your expertise and career aspirations.
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12"
                >
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'grid'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            <HiViewGrid className="w-4 h-4" />
                            <span className="text-sm font-medium">Grid</span>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${viewMode === 'list'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            <HiViewList className="w-4 h-4" />
                            <span className="text-sm font-medium">List</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{allCategories.length} Categories</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{allCategories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()} Total Jobs</span>
                        </div>
                    </div>
                </motion.div>

                {/* Categories Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`grid gap-6 mb-12 ${viewMode === 'grid'
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                        : 'grid-cols-1 max-w-4xl mx-auto'
                        }`}
                >
                    {displayedCategories.map((category, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <CategoryCard
                                icon={category.icon}
                                title={category.title}
                                count={category.count}
                                isHighlighted={category.isHighlighted}
                                trend={category.trend}
                                growthRate={category.growthRate}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Load More / Show Less */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAll(!showAll)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                        {showAll ? (
                            <>
                                <HiChevronLeft className="w-5 h-5" />
                                Show Less Categories
                            </>
                        ) : (
                            <>
                                View All {allCategories.length} Categories
                                <HiChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {[
                        { label: 'Active Jobs', value: '12.5K+', color: 'text-blue-600' },
                        { label: 'Companies', value: '850+', color: 'text-purple-600' },
                        { label: 'Success Rate', value: '94%', color: 'text-green-600' },
                        { label: 'New This Week', value: '350+', color: 'text-orange-600' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                                {stat.value}
                            </div>
                            <div className="text-gray-600 text-sm">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CategoryList;
