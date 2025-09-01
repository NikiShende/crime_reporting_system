const PoliceStation = require("../models/policestation");

const getNearestStations = async (req, res) => {
    try {
        const { latitude, longitude } = req.query; // user’s location from frontend

        const stations = await PoliceStation.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: 5000 // in meters (5 km radius)
                }
            }
        }).limit(5); // return top 5

        res.status(200).json(stations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching nearest police stations", error });
    }
};

module.exports = { getNearestStations };