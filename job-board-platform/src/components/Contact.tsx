import { useState } from 'react';
import {
    FaCheckCircle,
    FaEnvelope,
    FaExclamationCircle,
    FaPaperPlane,
    FaUser
} from 'react-icons/fa';
import {
    HiLightningBolt,
    HiLocationMarker,
    HiMail,
    HiPhone,
    HiSparkles,
    HiX
} from 'react-icons/hi';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Validation functions
    const validateName = (name: string) => {
        if (!name.trim()) return 'Name is required';
        if (name.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) return 'Email is required';
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validateSubject = (subject: string) => {
        if (!subject.trim()) return 'Subject is required';
        if (subject.trim().length < 5) return 'Subject must be at least 5 characters';
        return '';
    };

    const validateMessage = (message: string) => {
        if (!message.trim()) return 'Message is required';
        if (message.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear errors when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (error) setError('');

        // Real-time validation
        let fieldError = '';
        switch (field) {
            case 'name':
                fieldError = validateName(value);
                break;
            case 'email':
                fieldError = validateEmail(value);
                break;
            case 'subject':
                fieldError = validateSubject(value);
                break;
            case 'message':
                fieldError = validateMessage(value);
                break;
        }
        setErrors(prev => ({ ...prev, [field]: fieldError }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const subjectError = validateSubject(formData.subject);
        const messageError = validateMessage(formData.message);

        setErrors({
            name: nameError,
            email: emailError,
            subject: subjectError,
            message: messageError
        });

        if (nameError || emailError || subjectError || messageError) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setErrors({ name: '', email: '', subject: '', message: '' });
            } else {
                setError(data.message || 'Failed to send message. Please try again.');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            setError('Failed to send message. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: HiMail,
            title: 'Email Us',
            value: 'contact@opportuna.com',
            description: 'Send us an email anytime'
        },
        {
            icon: HiPhone,
            title: 'Call Us',
            value: '+1 (555) 123-4567',
            description: 'Mon-Fri from 9am to 6pm'
        },
        {
            icon: HiLocationMarker,
            title: 'Visit Us',
            value: '123 Business Ave, Suite 100',
            description: 'New York, NY 10001'
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <HiSparkles className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Get in Touch
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Have questions about job opportunities or need support? We'd love to hear from you.
                        Reach out and let's start a conversation.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                Let's Connect
                            </h3>
                            <p className="text-gray-600 text-lg mb-8">
                                Whether you're a job seeker looking for your next opportunity or an employer
                                searching for talent, we're here to help you succeed.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <info.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                            {info.title}
                                        </h4>
                                        <p className="text-blue-600 font-medium mb-1">
                                            {info.value}
                                        </p>
                                        <p className="text-gray-600 text-sm">
                                            {info.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Social Stats */}
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
                            <h4 className="font-semibold text-lg mb-4">Why Choose Opportuna?</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">10K+</div>
                                    <div className="text-blue-100 text-sm">Jobs Posted</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">5K+</div>
                                    <div className="text-blue-100 text-sm">Companies</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">50K+</div>
                                    <div className="text-blue-100 text-sm">Job Seekers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold">95%</div>
                                    <div className="text-blue-100 text-sm">Success Rate</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-8">
                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                                <FaCheckCircle className="text-green-500 text-xl" />
                                <span className="text-green-700 font-medium">{success}</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                                <FaExclamationCircle className="text-red-500 text-xl" />
                                <div className="flex-1">
                                    <span className="text-red-700 font-medium">{error}</span>
                                    <button
                                        onClick={() => setError('')}
                                        className="ml-2 text-red-400 hover:text-red-600 hover:scale-110 transition-all duration-200"
                                    >
                                        <HiX className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${errors.name
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {formData.name && !errors.name && (
                                        <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${errors.email
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {formData.email && !errors.email && (
                                        <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Subject Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <div className="relative">
                                    <HiLightningBolt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="What's this about?"
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange('subject', e.target.value)}
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all ${errors.subject
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {formData.subject && !errors.subject && (
                                        <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                </div>
                                {errors.subject && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* Message Textarea */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <div className="relative">
                                    <textarea
                                        placeholder="Tell us more about your inquiry..."
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        rows={5}
                                        className={`w-full p-4 bg-gray-50 border-2 rounded-2xl focus:outline-none transition-all resize-none ${errors.message
                                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {formData.message && !errors.message && (
                                        <FaCheckCircle className="absolute right-4 top-4 text-green-500" />
                                    )}
                                </div>
                                {errors.message && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <FaExclamationCircle className="w-3 h-3" />
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || Object.values(errors).some(error => error !== '')}
                                className={`w-full py-4 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 hover:scale-105 ${isLoading || Object.values(errors).some(error => error !== '')
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending Message...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="w-5 h-5" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
