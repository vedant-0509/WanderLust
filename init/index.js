// require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

// const mongoose = require("mongoose");
// const Listing = require("../models/listing.js");
// const data = require("./data.js");
// const axios = require("axios");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// async function connectDB() {
//     try {
//         await mongoose.connect(MONGO_URL);
//         console.log("✅ Connected to DB");
//     } catch (err) {
//         console.log("❌ DB Connection Error:", err);
//     }
// }

// async function getCoordinates(location) {
//     try {
//         if (!location) throw new Error("Empty location");

//         const clean = location
//             .replace(/in/gi, "")
//             .replace(/\s+/g, " ")
//             .trim();

//         const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(clean)}.json?key=${process.env.MAPTILER_API_KEY}`;

//         const res = await axios.get(url);

//         const feature = res.data?.features?.[0];

//         if (!feature) {
//             console.log("⚠️ No match found for:", location);
//             return [72.8777, 19.0760]; // fallback Mumbai
//         }

//         return feature.geometry.coordinates;

//     } catch (err) {
//         console.log("❌ Geocoding failed for:", location);
//         return [72.8777, 19.0760];
//     }
// }

// const initDB = async () => {
//     try {
//         await Listing.deleteMany({});
//         console.log("🧹 Old data cleared");

//         const updatedData = [];

//         for (let obj of data.data) {
//             let location = obj.location || obj.title || "Mumbai";

//             let cleanLocation = location
//                 .replace(/in/gi, "")
//                 .replace(/-/g, " ")
//                 .trim();

//             const coordinates = await getCoordinates(cleanLocation);

//             updatedData.push({
//                 ...obj,
//                 owner: "69cab1429a738f0e8e633d2e",
//                 geometry: {
//                     type: "Point",
//                     coordinates
//                 }
//             });
//         }

//         await Listing.insertMany(updatedData);

//         console.log("🚀 Database Initialized with GeoJSON");

//     } catch (err) {
//         console.log("❌ Init Error:", err);
//     } finally {
//         mongoose.connection.close();
//     }
// };
// connectDB().then(initDB);







require("dotenv").config({
  path: require("path").join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const data = require("./data");
const axios = require("axios");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err);
  }
}

async function getCoordinates(location, country) {
  try {
    const query = `${location}, ${country}`;

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(
      query
    )}.json?key=${process.env.MAPTILER_API_KEY}`;

    const res = await axios.get(url);

    const feature = res.data?.features?.[0];

    if (!feature) {
      console.log("⚠️ No coordinates found for:", query);

      // Mumbai fallback
      return [72.8777, 19.076];
    }

    return feature.geometry.coordinates;
  } catch (err) {
    console.log("❌ Geocoding Error:", location, err.message);

    return [72.8777, 19.076];
  }
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    console.log("🧹 Old listings removed");

    const updatedData = [];

    for (let obj of data.data) {
      const coordinates = await getCoordinates(
        obj.location,
        obj.country
      );

      updatedData.push({
        ...obj,

        owner: "69cab1429a738f0e8e633d2e",

        image: {
          url: obj.image.url,
          filename: obj.image.filename || "WanderLust",
        },

        geometry: {
          type: "Point",
          coordinates,
        },
      });
    }

    await Listing.insertMany(updatedData);

    console.log("🚀 Database Initialized Successfully");
  } catch (err) {
    console.log("❌ Initialization Error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB Connection Closed");
  }
}

connectDB().then(initDB);