import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import JobList from '../components/JobList';


const Home = () => {
    return (
        <>
            <HeroSection />
            <CategoryList />
            <hr style={{ borderColor: 'black', padding: '1rem 0' }} /> {/* Tailwind's gray-200 */}
            <JobList />

        </>
    );
};

export default Home;
