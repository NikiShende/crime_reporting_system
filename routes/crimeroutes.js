// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');  // adjust the path based on your folder structure
const { reportCrime, getCrimes } = require("../controllers/crimecontroller");
const { registerUser } = require("../controllers/register");
const { loginUser } = require("../controllers/login");
const { getNearestStations } = require("../controllers/getnearestpolice");
const { getEmergencyContacts } = require("../controllers/getemergencycontact");

router.get("/emergency-contacts", getEmergencyContacts);

router.get("/nearby-police", getNearestStations);

// These must be actual functions
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reportCrime", reportCrime);

// GET → Fetch all reported crimes
router.get("/crimes", getCrimes);

module.exports = router;
