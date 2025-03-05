"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDoctors = exports.getPatientProfile = exports.getDoctorProfile = exports.setAvailabilitySlots = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Doctor_1 = __importDefault(require("../models/Doctor"));
const Patient_1 = __importDefault(require("../models/Patient"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role, specialty, location, experience } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        if (role === 'doctor') {
            const newDoctor = new Doctor_1.default({ name, email, password: hashedPassword, specialty, location, experience });
            yield newDoctor.save();
        }
        else if (role === 'patient') {
            const newPatient = new Patient_1.default({ name, email, password: hashedPassword, role });
            yield newPatient.save();
        }
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = req.body;
    try {
        let user;
        if (role === 'doctor') {
            user = (yield Doctor_1.default.findOne({ email }));
        }
        else if (role === 'patient') {
            user = (yield Patient_1.default.findOne({ email }));
        }
        else {
            res.status(400).json({ message: 'Invalid role specified' });
            return;
        }
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role, name: user.name, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.loginUser = loginUser;
const setAvailabilitySlots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { availabilitySlots } = req.body;
    try {
        const doctor = yield Doctor_1.default.findById(id);
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        doctor.availabilitySlots = availabilitySlots;
        yield doctor.save();
        res.status(200).json({ message: 'Availability slots updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating availability slots', error });
    }
});
exports.setAvailabilitySlots = setAvailabilitySlots;
const getDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const doctor = yield Doctor_1.default.findById(id);
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' });
            return;
        }
        // Exclude the password from the response
        console.log('Doctor:', doctor);
        const _a = doctor.toObject(), { password } = _a, doctorProfile = __rest(_a, ["password"]);
        res.status(200).json(doctorProfile);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctor profile', error });
    }
});
exports.getDoctorProfile = getDoctorProfile;
const getPatientProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const patient = yield Patient_1.default.findById(id);
        if (!patient) {
            res.status(404).json({ message: 'Patient not found' });
            return;
        }
        // Exclude the password from the response
        const _a = patient.toObject(), { password } = _a, patientProfile = __rest(_a, ["password"]);
        res.status(200).json(patientProfile);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching patient profile', error });
    }
});
exports.getPatientProfile = getPatientProfile;
const getAllDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield Doctor_1.default.find();
        // Exclude passwords from the response
        const doctorProfiles = doctors.map((_a) => {
            var { password } = _a, doctorProfile = __rest(_a, ["password"]);
            return doctorProfile;
        });
        res.status(200).json(doctorProfiles);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
});
exports.getAllDoctors = getAllDoctors;
