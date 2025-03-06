import React from 'react';
import { FaCalendar, FaTimes } from 'react-icons/fa';

const PatientAppointments: React.FC<{ appointments: any[] }> = ({ appointments }) => {
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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold flex items-center">
        <FaCalendar className="mr-2 text-blue-500" />
        Your Appointments
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((appointment) => (
          <div key={appointment._id} 
               className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                <p className="text-gray-600">{new Date(appointment.date).toLocaleString()}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
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
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientAppointments;
