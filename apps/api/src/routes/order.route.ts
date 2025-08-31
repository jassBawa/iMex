
import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.get("/trade", asyncHandler(createOrder));

export default router;
