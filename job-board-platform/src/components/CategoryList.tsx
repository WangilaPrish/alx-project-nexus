import CategoryCard from '../components/CategoryCard';
import { Briefcase, Code, PenTool, Users } from 'lucide-react';

const CategoryList = () => {
    const categories = [
        { icon: <Briefcase />, title: 'Software Developer', count: 121 },
        { icon: <Code />, title: 'Software Tester', count: 104 },
        { icon: <PenTool />, title: 'UX Designer', count: 96, isHighlighted: true },
        { icon: <Users />, title: 'Project Manager', count: 78 },
        { icon: <Briefcase />, title: 'Graphic Designer', count: 58 },
        { icon: <Briefcase />, title: 'UI Designer', count: 64 },
    ];

    return (
        <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Popular Categories</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((cat, index) => (
                    <CategoryCard
                        key={index}
                        icon={cat.icon}
                        title={cat.title}
                        count={cat.count}
                        isHighlighted={cat.isHighlighted}
                    />
                ))}
            </div>
        </section>
    );
};

export default CategoryList;
