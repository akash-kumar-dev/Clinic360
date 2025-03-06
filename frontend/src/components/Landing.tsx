import { Link } from "react-router-dom";


const Landing: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Healthcare Platform
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Connect with doctors and manage your healthcare journey
          </p>
          
          {!token && (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-500 px-6 py-3 rounded-lg border border-blue-500 hover:bg-blue-50"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;