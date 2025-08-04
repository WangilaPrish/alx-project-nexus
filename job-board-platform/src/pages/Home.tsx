import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import JobList from '../components/JobList';

import CategoryCard from '../components/CategoryCard';

const Home = () => {
    return (
        <>
            <HeroSection />
            <CategoryList />
            <CategoryCard icon="🔥" title="Popular Jobs" count={10} />
            <JobList />

        </>
    );
};

export default Home;
