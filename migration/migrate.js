const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Destinasi = require("../models/Destinasi");

// Ganti sesuai URL MongoDB Anda
const MONGODB_URI =
  "mongodb+srv://abidesign2002:1uqwcBCreTke01xl@cluster0.rtpcfqb.mongodb.net/tourist-app?retryWrites=true&w=majority&appName=Cluster0";

async function migrateData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const filePath = path.join(__dirname, "data.json");
    const rawData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Konversi $oid ke ObjectId (dan buang _id jika tidak perlu)
    const data = rawData.map((item) => {
      const newItem = { ...item };
      if (item._id && item._id.$oid) {
        newItem._id = new mongoose.Types.ObjectId(item._id.$oid);
      } else {
        delete newItem._id; // biarkan mongoose generate
      }
      return newItem;
    });

    // Optional: hapus data lama
    await Destinasi.deleteMany({});
    await Destinasi.insertMany(data);
    console.log("Migrasi data berhasil");
    console.log("Migrasi data berhasil");

    process.exit(0);
  } catch (err) {
    console.error("Gagal migrasi:", err);
    process.exit(1);
  }
}

migrateData();
