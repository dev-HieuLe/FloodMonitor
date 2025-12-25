import express from "express";
import { geocodeLocation } from "../controllers/geocode.controller.js";

const router = express.Router();

router.get("/", geocodeLocation);

export default router;
