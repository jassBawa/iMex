
import { Router } from "express";
import { closeOrder, createOrder,  } from "../controllers/orders.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create-order",authMiddleware ,createOrder);
router.post('/close-order', authMiddleware, closeOrder )

export default router;
