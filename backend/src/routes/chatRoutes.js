import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/chatController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/:matchId/messages", authRequired, getMessages);
router.post("/:matchId/messages", authRequired, sendMessage);

export default router;

