// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');  // adjust the path based on your folder structure
const { reportCrime, getCrimes } = require("../controllers/crimecontroller");
const { registerUser } = require("../controllers/register");
const { loginUser } = require("../controllers/login");
const { getNearestStations } = require("../controllers/getnearestpolice");
const { getEmergencyContacts } = require("../controllers/getemergencycontact");
const { getCrimeCategoryStats, getCrimeMonthlyStats } = require("../controllers/crimestatscontroller");
const { getProfile }= require("../controllers/profilecontroller");
const { forgotPassword, resetPassword } = require("../controllers/forgot-password");

router.post("/forgot-password", forgotPassword);
// in your routes file
router.get("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  res.send(`Your reset token is: ${token}. Please send a POST request with a new password to this endpoint.`);
});

router.get("/emergency-contacts", getEmergencyContacts);

router.get("/profile/:userId", getProfile);

router.get("/nearby-police", getNearestStations);
router.get("/stats/category", getCrimeCategoryStats); // [{crime_type:"Robbery", count:40},...]
router.get("/stats/monthly", getCrimeMonthlyStats);  // [{month:"Jan", count:30},...]

// These must be actual functions
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reportCrime", reportCrime);

// GET → Fetch all reported crimes
router.get("/crimes", getCrimes);

module.exports = router;
