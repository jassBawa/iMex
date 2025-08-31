import { Router } from "express";
import { signupHandler, loginHandler } from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authMiddleware } from "../middlewares/authMiddleware"

const router = Router();

// auth routes
router.post("/signup", asyncHandler(signupHandler));
router.post("/login", asyncHandler(loginHandler));


export default router;
