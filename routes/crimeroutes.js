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
const { forgotPassword, resetPassword ,verifyResetToken} = require("../controllers/forgot-password");

router.post("/forgot-password", forgotPassword);
app.get("/reset-password/:token", (req, res) => {
  res.send(`
    <h2>Reset Password</h2>
    <form action="/api/reset-password/${req.params.token}" method="POST">
      <input type="password" name="password" placeholder="Enter new password" required />
      <button type="submit">Reset</button>
    </form>
  `);
});

router.post("/reset-password/:token", resetPassword);
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
