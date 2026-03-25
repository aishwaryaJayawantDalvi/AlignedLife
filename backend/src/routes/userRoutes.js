import { Router } from "express";
import { acceptRealityCheck, getMe } from "../controllers/userController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/me", authRequired, getMe);
router.post("/reality-check/accept", authRequired, acceptRealityCheck);

export default router;

