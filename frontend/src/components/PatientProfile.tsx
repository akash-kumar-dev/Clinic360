import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PatientProfile: React.FC = () => {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/patient/${id}`);
        const data = await response.json();
        setPatient(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient profile:', error);
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
            <p className="text-gray-700">Email: {patient.email}</p>
          </div>
          
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Medical History</h2>
            <p className="text-gray-700">
              {patient.medicalHistory?.length ? 
                patient.medicalHistory.join(', ') : 
                'No medical history available'}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Appointments</h2>
            {patient.appointments?.length ? (
              <ul className="list-disc pl-5">
                {patient.appointments.map((appointment: any) => (
                  <li key={appointment._id} className="text-gray-700">
                    {new Date(appointment.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No appointments scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
