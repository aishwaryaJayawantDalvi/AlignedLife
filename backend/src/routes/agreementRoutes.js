import { Router } from "express";
import { createAgreement, exportAgreementPdf, getAgreementById, getMyAgreements } from "../controllers/agreementController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, getMyAgreements);
router.post("/", authRequired, createAgreement);
router.get("/:id", authRequired, getAgreementById);
router.get("/:id/export", authRequired, exportAgreementPdf);

export default router;

