import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) as any : null;

  const handleProfileClick = () => {
    if (!decoded) return;
    
    if (decoded.role === 'doctor') {
      navigate(`/doctor/${decoded.id}`);
    } else if (decoded.role === 'patient') {
      navigate(`/patient/${decoded.id}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-blue-600 text-2xl font-bold">
              Clinic360
            </Link>
          </div>
          
          <div className="flex items-center">
            <Link to="/doctors" className="text-gray-700 px-4 hover:underline">Browse Doctors</Link>
            {token ? (
              <div className="flex items-center">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded-md"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{decoded?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-gray-700">{decoded?.name}</span>
                </button>
                <button onClick={handleLogout} className="text-gray-700 px-4 hover:underline">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/register" className="text-gray-700 px-4 hover:underline">Register</Link>
                <Link to="/login" className="text-gray-700 px-4 hover:underline">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;