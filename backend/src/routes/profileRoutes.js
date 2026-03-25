import { Router } from "express";
import { getMyProfile, upsertProfile } from "../controllers/profileController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/me", authRequired, getMyProfile);
router.put("/me", authRequired, upsertProfile);

export default router;

