const mongoose = require("mongoose");

const policeStationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"], // GeoJSON type
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
});

// Create geospatial index
policeStationSchema.index({ location: "2dsphere" });

const PoliceStation = mongoose.model("PoliceStation", policeStationSchema);
module.exports = PoliceStation;
