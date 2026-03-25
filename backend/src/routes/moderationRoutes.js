import { Router } from "express";
import { blockUser, reportUser } from "../controllers/moderationController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/block/:userId", authRequired, blockUser);
router.post("/report/:userId", authRequired, reportUser);

export default router;

