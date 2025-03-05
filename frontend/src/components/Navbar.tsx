import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userName = token ? JSON.parse(atob(token.split('.')[1])).name : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Clinic360
        </Link>
        <div className="flex items-center">
          <Link to="/doctors" className="text-white px-4 hover:underline">Browse Doctors</Link>
          {token ? (
            <div className="flex items-center">
              <div className="bg-white text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">
                {userName.split(' ').map(name => name.charAt(0).toUpperCase()).join('')} {/* Display the initials of the user's name */}
              </div>
              <span className="text-white mr-4">{userName}</span>
              <button onClick={handleLogout} className="text-white hover:underline">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/register" className="text-white px-4 hover:underline">Register</Link>
              <Link to="/login" className="text-white px-4 hover:underline">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 