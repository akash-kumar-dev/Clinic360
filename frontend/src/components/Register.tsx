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
      // Handle successful registration (e.g., redirect to login)
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded"
          required
        />
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
          className="border border-gray-300 p-2 rounded"
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>

        {/* Doctor-specific fields */}
        {role === 'doctor' && (
          <>
            <input
              type="text"
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={location.city}
              onChange={(e) => setLocation({ ...location, city: e.target.value })}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={location.state}
              onChange={(e) => setLocation({ ...location, state: e.target.value })}
              className="border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="number"
              placeholder="Experience (in years)"
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="border border-gray-300 p-2 rounded"
              required
            />
          </>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register; 