# Clinic360
## Doctor Search & Appointment Booking System

**This project was completed by me as part of the Arogo AI MERN Developer Intern Assignment.**

## Overview
This is a **Doctor Search & Appointment Booking System** developed using the **MERN (MongoDB, Express.js, React.js, Node.js) stack**. The system enables:

- **Patients** to search for doctors and book appointments.
- **Doctors** to set their availability and manage appointments.

## Features
### 1. User Authentication & Role Management
- JWT-based authentication for **Doctors** and **Patients**.
- Patients can **register/login** and manage appointments.
- Doctors can **register/login** and set availability.
- Secure **password hashing using bcrypt.js**.

### 2. Doctor Search & Profile Management
- Patients can **search for doctors** using:
  - **Specialty** (e.g., Cardiologist, Dermatologist).
  - **Location** (City, State).
  - **Doctor’s Name** (partial match search).
- **Doctor Profile Page** displays:
  - Name, Specialty, Experience, Location, and Availability Slots.

### 3. Appointment Booking System
- **Doctors set availability** (working hours and consultation locations).
- Patients can **book an available slot** with a doctor.
- **Concurrency handling** prevents double booking.
- Patients can **cancel an appointment**.

### 4. Web Interface (Frontend)
- **Responsive UI** using **React.js + Tailwind CSS**.
- **Patient Portal:**
  - Search for doctors.
  - Book or cancel appointments.
- **Doctor Dashboard:**
  - Set up consultation locations.
  - Define and update availability.
  - View upcoming appointments.
- **State management using Context API**.


## Tech Stack
- **Backend:** TypeScript, Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, TypeScript, Tailwind CSS, Context API
- **Authentication:** JWT, bcrypt.js
- **Database:** MongoDB

## Installation & Setup
### 1. Start Backend
```sh
cd backend
npm i   # Install dependencies
cp .env.example .env  # Copy .env file and add MongoDB connection string
tsc -b  # Build the project
node dist/index.js  # Start the server (Runs on port 5000)
```

### 2. Start Frontend (React + TypeScript + Tailwind)
```sh
cd frontend
npm i  # Install dependencies
cp .env.example .env  # Set backend URL
# Example: VITE_BACKEND_URL=http://localhost:5000/api
npm run dev -- --host  # Start the development server
```

