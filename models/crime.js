const mongoose = require("mongoose");

const crimeSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g. Theft, Assault
    description: { type: String, required: true },
    location: { type: String, required: true }, // text-based location
    latitude: { type: Number }, // optional for map integration
    longitude: { type: Number },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "register", required: true },
    dateReported: { type: Date, default: Date.now }
});

const Crime = mongoose.model("Crime", crimeSchema);
module.exports = Crime;
