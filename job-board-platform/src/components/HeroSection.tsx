import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const HeroSection = () => {
    const navigate = useNavigate();

    const handleJobseekerClick = () => {
        navigate('/jobs'); // 👈 Update this path if your job page is different
    };

    return (
        <section className="bg-blue-50 py-16 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-center md:text-left">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        Your Future Starts with <span className="text-blue-600">Opportuna!</span>
                    </h2>
                    <p className="text-gray-600 mb-6 max-w-xl">
                        Discover jobs that match your skills and passion. Choose your path and explore opportunities!
                    </p>

                    {/* Single Role Button */}
                    <div className="flex justify-center md:justify-start gap-4 mb-6">
                        <button
                            onClick={handleJobseekerClick}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            I'm a Jobseeker
                        </button>
                    </div>

                    {/* Stat */}
                    <p className="text-sm mt-4 text-gray-500">
                        Over <strong>99k</strong> jobseekers are successfully hired
                    </p>
                </div>

                {/* Hero Image */}
                <div className="hidden md:block">
                    <img src={heroImg} alt="Hero" className="w-full max-w-md mx-auto rounded-3xl" />
                </div>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-[-40px] left-[-40px] w-48 h-48 bg-blue-100 rounded-full opacity-30" />
            <div className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-blue-100 rounded-full opacity-30" />
        </section>
    );
};

export default HeroSection;
