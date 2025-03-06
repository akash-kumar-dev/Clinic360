import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{doctor.name}</h1>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Professional Information</h2>
            <p className="text-gray-700">Specialty: {doctor.specialty}</p>
            <p className="text-gray-700">Experience: {doctor.experience} years</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            <p className="text-gray-700">{doctor.location?.city}, {doctor.location?.state}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p className="text-gray-700">Email: {doctor.email}</p>
          </div>
        </div>
        
        {isOwnProfile && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleEditProfile}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate(`/doctor/availability/${id}`)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Set Availability
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DoctorProfile;