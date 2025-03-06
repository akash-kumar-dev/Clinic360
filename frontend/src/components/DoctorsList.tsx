import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  FaMapMarkerAlt, FaStethoscope, FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    specialty: '',
    availableDate: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/doctors`);
        const data = await response.json();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = [...doctors];

    if (filters.city) {
      filtered = filtered.filter(doctor => 
        doctor._doc.location?.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.state) {
      filtered = filtered.filter(doctor => 
        doctor._doc.location?.state.toLowerCase().includes(filters.state.toLowerCase())
      );
    }

    if (filters.specialty) {
      filtered = filtered.filter(doctor => 
        doctor._doc.specialty.toLowerCase().includes(filters.specialty.toLowerCase())
      );
    }

    if (filters.availableDate) {
      filtered = filtered.filter(doctor => 
        doctor._doc.availabilitySlots?.some((slot: any) => 
          new Date(slot.time).toISOString().split('T')[0] === filters.availableDate
        )
      );
    }

    setFilteredDoctors(filtered);
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      state: '',
      specialty: '',
      availableDate: ''
    });
    setFilteredDoctors(doctors);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Modern Sidebar */}
      <div className="w-80 bg-white p-6 shadow-xl border-r border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          <FaFilter className="text-blue-500 text-xl" />
        </div>
        
        <div className="space-y-6">
          <div className="relative">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              City
            </label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Search by city..."
            />
          </div>

          <div className="relative">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaMapMarkerAlt className="mr-2 text-blue-500" />
              State
            </label>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Search by state..."
            />
          </div>

          <div className="relative">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaStethoscope className="mr-2 text-blue-500" />
              Specialization
            </label>
            <input
              type="text"
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="Search specialty..."
            />
          </div>

          <div className="relative">
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <FaCalendarAlt className="mr-2 text-blue-500" />
              Available Date
            </label>
            <input
              type="date"
              name="availableDate"
              value={filters.availableDate}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <button
            onClick={resetFilters}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
          >
            <FaTimes />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor._doc._id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate(`/doctor/${doctor._doc._id}`)}
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h2 className="text-xl font-bold text-white">{doctor._doc.name}</h2>
                <p className="text-blue-100">{doctor._doc.specialty || 'Not specified'}</p>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-center text-gray-700">
                  <FaStethoscope className="mr-2 text-blue-500" />
                  <p>Experience: {doctor._doc.experience || 0} years</p>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-2 text-blue-500" />
                  <p>{doctor._doc.location?.city || 'N/A'}, {doctor._doc.location?.state || 'N/A'}</p>
                </div>

                <div className="border-t pt-3">
                  <p className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    Next Available Slots:
                  </p>
                  <div className="space-y-1">
                    {doctor._doc.availabilitySlots?.slice(0, 3).map((slot: any, index: number) => (
                      <div key={index} 
                           className={`bg-blue-50 p-2 rounded ${slot.status === 'booked' ? 'opacity-50' : ''}`}>
                        <p className="text-sm text-gray-700">
                          {new Date(slot.time).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(slot.time).toLocaleTimeString()}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          slot.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>    </div>
  );
};

export default DoctorsList;