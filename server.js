require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const startNotReportedCron = require("./cron/notReportedCron");
const cors = require('cors');

const app = express();
app.use(cors());

connectDB();  
startNotReportedCron();
  

app.use(express.json());
const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
const criminalRoutes = require("./routes/criminalRoutes");
app.use("/api/criminal", criminalRoutes);
const areaRoutes = require("./routes/areaRoutes");
app.use("/api/area", areaRoutes);
const tadipaarRoutes = require("./routes/tadipaarRoutes");
app.use("/api/tadipaar", tadipaarRoutes);
const tadipaarOrderRoutes = require("./routes/tadipaarOrderRoutes");
app.use("/api/tadipaar-order", tadipaarOrderRoutes);



app.get("/", (req, res) => {
  res.send("Tadipaar API running 🚔");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
