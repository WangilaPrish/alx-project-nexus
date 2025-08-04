const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                {/* Add your form here */}
                <form className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded" />
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded" />
                    <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
