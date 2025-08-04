import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import JobList from '../components/JobList';

const Home = () => {
    return (
        <>
            <HeroSection />
            <CategoryList />
            <hr style={{ borderColor: 'black', margin: '2rem 0' }} />
            <JobList limit={3} random showIntro />

        </>
    );
};

export default Home;
