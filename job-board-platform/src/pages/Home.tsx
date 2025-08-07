import CategoryList from '../components/CategoryList';
import Contact from '../components/Contact';
import HeroSection from '../components/HeroSection';
import JobList from '../components/JobList';

const Home = () => {
    return (
        <>
            <HeroSection />
            <CategoryList />
            <hr style={{ borderColor: 'black', margin: '2rem 0' }} />
            <JobList limit={3} random showIntro />
            <Contact />
        </>
    );
};

export default Home;
