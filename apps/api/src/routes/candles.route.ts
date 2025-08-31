import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { candlesHandler } from "../controllers/candles.controller";

const router = Router();

router.get("/candles", asyncHandler(candlesHandler));

export default router;
