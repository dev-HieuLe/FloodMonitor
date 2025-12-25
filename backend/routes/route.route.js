import express from "express";
import { getBestFloodSafeRoute } from "../controllers/route.controller.js";

const router = express.Router();
router.get("/", getBestFloodSafeRoute);

export default router;
