import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/doctors`);
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleCardClick = (doctorId: string) => {
    navigate(`/doctor/${doctorId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {doctors && doctors.length > 0 ? (
        doctors.map((doctor) => (
          <div 
            key={doctor._doc._id} 
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCardClick(doctor._doc._id)}
          >
            <h2 className="text-xl font-bold">{doctor._doc.name}</h2>
            <p>Specialty: {doctor._doc.specialty || 'Not specified'}</p>
            <p>Experience: {doctor._doc.experience || 0} years</p>
            <p>Location: {doctor._doc.location?.city || 'N/A'}, {doctor._doc.location?.state || 'N/A'}</p>
            <div className="mt-2">
              <p className="font-semibold">Next Available Slots:</p>
              {doctor._doc.availabilitySlots?.slice(0, 3).map((slot: string, index: number) => (
                <p key={index} className="text-sm text-gray-600">
                  {new Date(slot).toLocaleString()}
                </p>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>Loading doctors...</p>
      )}
    </div>
  );
};
export default DoctorsList;