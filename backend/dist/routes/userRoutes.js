"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Patient routes
router.post('/register/patient', userController_1.registerUser);
router.post('/login/patient', userController_1.loginUser);
// Doctor routes
router.post('/register/doctor', userController_1.registerUser);
router.post('/login/doctor', userController_1.loginUser);
exports.default = router;
