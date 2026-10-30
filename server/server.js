const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();
const { notFound, errorHandler } = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Smart Property Tax Portal API running" });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/taxpayer", require("./routes/taxpayerRoutes"));
app.use("/api/taxpayers", require("./routes/taxpayerRoutes"));
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));