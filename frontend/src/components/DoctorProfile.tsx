import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserMd, FaStethoscope, FaMapMarkerAlt, FaEnvelope, FaClock, FaEdit, FaCalendarPlus } from 'react-icons/fa';

const DoctorProfile: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      setIsOwnProfile(decoded.id === id);
    }

    const fetchDoctorProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/doctor/${id}`);
        const data = await response.json();
        setDoctor(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching doctor profile:', error);
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [id]);

  const handleEditProfile = () => {
    navigate(`/doctor/edit/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <FaUserMd className="text-4xl text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-white">{doctor.name}</h1>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Professional Information */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
              <FaStethoscope className="mr-3 text-blue-500" />
              Professional Information
            </h2>
            <div className="bg-blue-50 p-6 rounded-xl">
              <p className="text-gray-700">Specialty: {doctor.specialty}</p>
              <p className="text-gray-700">Experience: {doctor.experience} years</p>
            </div>
          </div>

          {/* Location */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
              <FaMapMarkerAlt className="mr-3 text-blue-500" />
              Location
            </h2>
            <div className="bg-blue-50 p-6 rounded-xl">
              <p className="text-gray-700">{doctor.location?.city}, {doctor.location?.state}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
              <FaEnvelope className="mr-3 text-blue-500" />
              Contact Information
            </h2>
            <div className="bg-blue-50 p-6 rounded-xl">
              <p className="text-gray-700">Email: {doctor.email}</p>
            </div>
          </div>

          {/* Available Slots */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
              <FaClock className="mr-3 text-blue-500" />
              Available Slots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctor.availabilitySlots && doctor.availabilitySlots.length > 0 ? (
                doctor.availabilitySlots.map((slot: any, index: number) => (
                  <div 
                    key={index}
                    className={`bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors duration-300 ${
                      slot.status === 'booked' ? 'opacity-50' : ''
                    }`}
                  >
                    <p className="text-gray-700 font-medium">
                      {new Date(slot.time).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      {new Date(slot.time).toLocaleTimeString()}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      slot.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No availability slots set</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isOwnProfile && (
          <div className="p-8 bg-gray-50 border-t">
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleEditProfile}
                className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => navigate(`/doctor/availability/${id}`)}
                className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
              >
                <FaCalendarPlus />
                <span>Set Availability</span>
              </button>
            </div>
          </div>
        )}
        {!isOwnProfile && (
          <button
            onClick={() => navigate(`/book-appointment/${id}`)}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
          >
            <FaCalendarPlus />
            <span>Book Appointment</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;