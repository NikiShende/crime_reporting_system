const Crime = require("../models/crime");

// Report a new crime
const reportCrime = async (req, res) => {
    try {
        const { title, category , description, location, latitude, longitude } = req.body;

        if (!title || !description || !location ) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const crime = new Crime({
            title,
            category ,
            description,
            location,
            latitude,
            longitude,
           
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
        const crimes = await Crime.find();
        res.status(200).json(crimes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching crimes", error: error.message });
    }
};


module.exports = { reportCrime, getCrimes };
