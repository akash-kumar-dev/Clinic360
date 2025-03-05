import React, { useState } from 'react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'doctor' | 'patient'>('patient');
  
  // Doctor-specific fields
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState({ city: '', state: '' });
  const [experience, setExperience] = useState(0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/register/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          specialty: role === 'doctor' ? specialty : undefined,
          location: role === 'doctor' ? location : undefined,
          experience: role === 'doctor' ? experience : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as 'doctor' | 'patient');
                if (e.target.value === 'patient') {
                  setSpecialty('');
                  setLocation({ city: '', state: '' });
                  setExperience(0);
                }
              }}
              className="border border-gray-300 p-2 rounded-lg w-full"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {role === 'doctor' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specialty</label>
                <input
                  type="text"
                  placeholder="Enter your specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  placeholder="Enter your city"
                  value={location.city}
                  onChange={(e) => setLocation({ ...location, city: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  placeholder="Enter your state"
                  value={location.state}
                  onChange={(e) => setLocation({ ...location, state: e.target.value })}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience (in years)</label>
                <input
                  type="number"
                  placeholder="Enter your experience"
                  value={experience}
                  onChange={(e) => setExperience(Number(e.target.value))}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 