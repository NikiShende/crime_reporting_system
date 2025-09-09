const mongoose = require("mongoose");
const EmergencyContact = require("../models/emergencycontact");

mongoose.connect("mongodb+srv://nikitashende:qKQrubMRnYyepbbt@cluster2.t93xuus.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedContacts() {
  const contacts = [
    { name: "Police", phone: "100" },
    { name: "Ambulance", phone: "108" },
    { name: "Fire Department", phone: "101" },
    { name: "Women Helpline", phone: "1091" },
    { name: "Disaster Management", phone: "1070" }
  ];

  await EmergencyContact.deleteMany(); // clear old
  await EmergencyContact.insertMany(contacts);
  console.log("✅ Emergency contacts seeded!");
  mongoose.connection.close();
}

seedContacts();
