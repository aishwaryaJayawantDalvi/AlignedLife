import { Router } from "express";
import { getMatches, refreshMatches, requestRevealIdentity } from "../controllers/matchController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/refresh", authRequired, refreshMatches);
router.get("/", authRequired, getMatches);
router.post("/:matchId/reveal", authRequired, requestRevealIdentity);

export default router;

