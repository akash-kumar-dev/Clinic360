import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 className="text-5xl font-bold mb-4">Welcome to Clinic360</h1>
        <p className="text-lg mb-8 text-center">
          Your one-stop solution for finding doctors and booking appointments.
        </p>
        <div className="flex space-x-4">
          <a href="/register" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
            Register
          </a>
          <a href="/login" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 