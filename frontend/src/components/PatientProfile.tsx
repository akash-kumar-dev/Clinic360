import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaNotesMedical, FaCalendarCheck, FaClock, FaHospital } from 'react-icons/fa';

interface Appointment {
  _id: string;
  doctorName: string;
  date: string;
  status: 'scheduled' | 'cancelled';
}

const PatientAppointments: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  const handleCancelAppointment = async (appointmentId: string, slot: string) => {
    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/appointments/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: decoded.id,
          appointmentId,
          slot
        })
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  return (
    <div className="transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
        <FaCalendarCheck className="mr-3 text-purple-500" />
        Your Appointments
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appointment) => (
          <div key={appointment._id} 
               className="bg-purple-50 p-6 rounded-xl hover:bg-purple-100 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <FaHospital className="text-purple-500 mr-2" />
                  <span className="font-semibold">{appointment.doctorName}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="text-purple-500 mr-2" />
                  <span>{new Date(appointment.date).toLocaleString()}</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                  appointment.status === 'scheduled' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
              {appointment.status === 'scheduled' && (
                <button
                  onClick={() => handleCancelAppointment(appointment._id, appointment.date)}
                  className="text-red-500 hover:text-red-700 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <FaUser className="text-4xl text-purple-500" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">{patient.name}</h1>
              <div className="flex items-center text-purple-100 mt-2">
                <FaEnvelope className="mr-2" />
                <span>{patient.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Medical History Section */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
              <FaNotesMedical className="mr-3 text-purple-500" />
              Medical History
            </h2>
            <div className="bg-purple-50 p-6 rounded-xl">
              {patient.medicalHistory?.length ? (
                <ul className="space-y-2">
                  {patient.medicalHistory.map((history: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {history}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No medical history available</p>
              )}
            </div>
          </div>
          {/* Appointments Section */}
          {patient.appointments && patient.appointments.length > 0 && (
            <PatientAppointments appointments={patient.appointments} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;