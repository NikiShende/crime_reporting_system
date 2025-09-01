const Crime = require("../models/crime");

// Report a new crime
const reportCrime = async (req, res) => {
    try {
        const { title, description, location, latitude, longitude, reportedBy } = req.body;

        if (!title || !description || !location || !reportedBy) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const crime = new Crime({
            title,
            description,
            location,
            latitude,
            longitude,
            reportedBy
        });

        await crime.save();
        res.status(201).json({ message: "Crime reported successfully", crime });
    } catch (error) {
        res.status(500).json({ message: "Error reporting crime", error });
    }
};

// Get all crime reports
const getCrimes = async (req, res) => {
    try {
        const crimes = await Crime.find().populate("reportedBy", "name email");
        res.status(200).json(crimes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching crimes", error });
    }
};

module.exports = { reportCrime, getCrimes };
