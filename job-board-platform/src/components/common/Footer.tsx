const Footer = () => {
    return (
        <footer className="bg-gray-100 text-gray-700 mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                    <h4 className="font-semibold text-lg mb-3 text-blue-600">Opportuna</h4>
                    <p>
                        Empowering job seekers to find their path. Your future begins with the right opportunity.
                    </p>
                </div>

                <div>
                    <h5 className="font-semibold mb-2">Explore</h5>
                    <ul className="space-y-1">
                        <li><a href="#" className="hover:text-blue-600">Home</a></li>
                        <li><a href="#" className="hover:text-blue-600">Jobs</a></li>
                        <li><a href="#" className="hover:text-blue-600">Categories</a></li>
                        <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-semibold mb-2">Stay Connected</h5>
                    <p className="mb-2">Join our newsletter for job updates.</p>
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="px-3 py-2 border rounded-l-md w-full text-sm"
                        />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            <div className="border-t border-gray-200 text-center text-xs py-4">
                © {new Date().getFullYear()} Opportuna. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
