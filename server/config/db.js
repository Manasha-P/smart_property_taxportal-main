const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri || (uri.includes("127.0.0.1") && process.env.NODE_ENV === "production")) {
    console.warn("⚠️  No remote MONGO_URI configured for production. Server will run in resilient standalone mode.");
    return false;
  }
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.warn(`⚠️ MongoDB connection notice: ${err.message}. Operating in resilient fallback mode.`);
    return false;
  }
};

module.exports = connectDB;