import { Router } from "express";
import { signupHandler, loginHandler, getUserBalance } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();


router.post("/signup", signupHandler);
router.post("/login", loginHandler);
router.get('/get-user-balance', authMiddleware, getUserBalance )

export default router;
