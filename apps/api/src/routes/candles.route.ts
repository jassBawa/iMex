import { Router } from "express";
import { candlesHandler } from "../controllers/candles.controller";

const router = Router();

// todo: authmiddleware here
router.get("/", candlesHandler);

export default router;
