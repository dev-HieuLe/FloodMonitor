import express from "express";
import { getFloodedRoadSegments } from "../controllers/floodRoad.controller.js";

const router = express.Router();

router.get("/", getFloodedRoadSegments);

export default router;
