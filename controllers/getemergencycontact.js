const EmergencyContact = require("../models/emergencycontact");

// Get all emergency contacts
const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching emergency contacts", error });
  }
};

module.exports = { getEmergencyContacts };
