import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImg from '../assets/hero.png';

const HeroSection = () => {
    const navigate = useNavigate();

    const handleJobseekerClick = () => {
        navigate('/jobs');
    };

    return (
        <section className="bg-blue-50 py-22 px-6 md:px-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="text-center md:text-left">
                    <motion.h2
                        initial={{ y: 40, scale: 0.95, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
                    >
                        Your Future Starts with <span className="text-blue-600">Opportuna!</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-gray-600 mb-6 max-w-xl"
                    >
                        Discover jobs that match your skills and passion. Choose your path and explore opportunities!
                    </motion.p>

                    {/* Button */}
                    <motion.div
                        className="flex justify-center md:justify-start gap-4 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            onClick={handleJobseekerClick}
                            className="px-6 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            I'm a Jobseeker
                        </motion.button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-sm mt-4 text-gray-500"
                    >
                        Over <strong>99k</strong> jobseekers are successfully hired
                    </motion.p>
                </div>

                {/* Hero Image */}
                <motion.div
                    className="hidden md:block"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <motion.img
                        src={heroImg}
                        alt="Hero"
                        className="w-full max-w-md mx-auto rounded-3xl"
                        animate={{ y: [0, -10, 0] }}
                        transition={{
                            repeat: Infinity,
                            repeatType: 'mirror',
                            duration: 3,
                            ease: 'easeInOut'
                        }}
                    />
                </motion.div>
            </div>

            {/* Decorative Circles */}
            <motion.div
                className="absolute top-[-40px] left-[-40px] w-48 h-48 bg-blue-100 rounded-full opacity-30"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-[-40px] right-[-40px] w-48 h-48 bg-blue-100 rounded-full opacity-30"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            />
        </section>
    );
};

export default HeroSection;
