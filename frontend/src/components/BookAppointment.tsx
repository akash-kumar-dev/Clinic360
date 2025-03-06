import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendar, FaClock, FaCheck } from 'react-icons/fa';

const BookAppointment: React.FC = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/doctor/${doctorId}`);
        const data = await response.json();
        // Filter available slots only
        const availableSlots = data.availabilitySlots.filter(
          (slot: any) => slot.status === 'available'
        );
        setAvailableSlots(availableSlots);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
    };

    fetchAvailableSlots();
  }, [doctorId]);

  const handleBooking = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId,
          patientId: decoded.id,
          slot: selectedSlot
        })
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Appointment booked successfully!');
        setTimeout(() => navigate('/patient/appointments'), 2000);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      setError(err.message || 'Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaCalendar className="mr-2 text-blue-500" />
          Book Appointment
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaClock className="mr-2 text-blue-500" />
              Select Time Slot
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSlots.map((slot: any, index: number) => (
                <div 
                  key={index}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors duration-300 ${
                    selectedSlot === slot.time ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <p className="text-gray-700 font-medium">
                    {new Date(slot.time).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    {new Date(slot.time).toLocaleTimeString()}
                  </p>
                  <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    available
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading || !selectedSlot}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-lg ${
              loading || !selectedSlot
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors duration-300`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Booking...
              </div>
            ) : (
              <div className="flex items-center">
                <FaCheck className="mr-2" />
                Book Appointment
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;