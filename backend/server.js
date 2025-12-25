import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import geocodeRoutes from "./routes/geocode.route.js";
import floodRoutes from "./routes/flood.route.js";
import routeRoutes from "./routes/route.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/geocode", geocodeRoutes);
app.use("/api/flood-roads", floodRoutes);
app.use("/api/route", routeRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
