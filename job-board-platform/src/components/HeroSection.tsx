import { useEffect, useState } from 'react';
import {
    HiArrowRight,
    HiBriefcase,
    HiLocationMarker,
    HiPlay,
    HiSearch,
    HiSparkles,
    HiTrendingUp,
    HiUsers
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import heroImg from '../assets/hero.png';

const HeroSection = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleJobseekerClick = () => {
        navigate('/jobs');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/jobs?search=${searchTerm}&location=${location}`);
    };

    // Animated text rotation
    const rotatingTexts = [
        "Dream Job",
        "Perfect Career",
        "Next Adventure",
        "Future Role"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [rotatingTexts.length]);

    // Stats data
    const stats = [
        { icon: HiBriefcase, value: "50K+", label: "Jobs Available" },
        { icon: HiUsers, value: "25K+", label: "Happy Users" },
        { icon: HiTrendingUp, value: "98%", label: "Success Rate" }
    ];

    // Popular job categories
    const popularCategories = [
        "Frontend Developer",
        "Data Scientist",
        "Product Manager",
        "UI/UX Designer"
    ];

    return (
        <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                {/* Gradient Orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl opacity-30" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl opacity-30" />

                {/* Floating Icons */}
                <div className="absolute top-32 right-20 text-blue-400/30">
                    <HiSparkles className="w-8 h-8" />
                </div>
                <div className="absolute bottom-40 left-20 text-purple-400/30">
                    <HiBriefcase className="w-6 h-6" />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 min-h-screen flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">

                    {/* Left Content */}
                    <div className="text-center lg:text-left space-y-8">



                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                Find Your{' '}
                                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {rotatingTexts[currentIndex]}
                                </span>
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
                            Connect with top companies and discover opportunities that match your skills,
                            passion, and career goals. Your perfect job is just one search away.
                        </p>

                        {/* Search Form */}
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Job title or keywords"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <HiLocationMarker className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <span>Search Jobs</span>
                                    <HiArrowRight className="w-4 h-4" />
                                </button>
                            </form>

                            {/* Popular Categories */}
                            <div className="mt-6">
                                <p className="text-sm text-gray-600 mb-3">Popular searches:</p>
                                <div className="flex flex-wrap gap-2">
                                    {popularCategories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSearchTerm(category);
                                                navigate(`/jobs?search=${category}`);
                                            }}
                                            className="px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:scale-105 text-gray-700 hover:text-blue-700 rounded-lg text-sm transition-all duration-200"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={handleJobseekerClick}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 justify-center shadow-lg hover:shadow-xl"
                            >
                                <HiBriefcase className="w-5 h-5" />
                                Browse All Jobs
                            </button>

                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 pt-8">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-2">
                                        <div className="p-3 bg-blue-100 rounded-xl">
                                            <stat.icon className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <div className="relative flex justify-center lg:justify-end">
                        {/* Main Image Container */}
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl scale-110" />

                            {/* Hero Image */}
                            <div className="relative z-10">
                                <img
                                    src={heroImg}
                                    alt="Find your dream job"
                                    className="w-full max-w-lg rounded-3xl shadow-2xl"
                                />
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20">

                            </div>

                            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/20">

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 w-full">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-16 fill-white"
                >
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                        opacity=".25"
                    />
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                        opacity=".5"
                    />
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
                </svg>
            </div>
        </section>
    );
};

export default HeroSection;
