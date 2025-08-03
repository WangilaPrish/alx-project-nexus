import HeroSection from '../components/HeroSection';
import CategoryList from '../components/CategoryList';
import JobCard from '../components/JobCard';

const Home = () => {
    return (
        <>
            <HeroSection />
            <CategoryList />
            <JobCard job={{
                id: 1,
                title: 'Frontend Developer',
                company: 'TechCorp',
                location: 'Remote',
                type: 'Full-time',
                experienceLevel: 'Mid-Level',
            }} />

        </>
    );
};

export default Home;
