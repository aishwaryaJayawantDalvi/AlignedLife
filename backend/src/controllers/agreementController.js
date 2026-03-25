import { Agreement } from "../models/Agreement.js";
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";
import { generateAgreementPdf } from "../utils/pdf.js";

export const createAgreement = async (req, res, next) => {
  try {
    const { partnerId, ...payload } = req.body;

    const matched = await Match.findOne({ users: { $all: [req.user.id, partnerId] } });
    if (!matched) {
      return res.status(403).json({ message: "Agreement can only be created with a matched user" });
    }

    const agreement = await Agreement.create({
      ...payload,
      userA: req.user.id,
      userB: partnerId,
      createdBy: req.user.id
    });

    return res.status(201).json(agreement);
  } catch (error) {
    return next(error);
  }
};

export const getAgreementById = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    const isParticipant = [String(agreement.userA), String(agreement.userB)].includes(String(req.user.id));
    if (!isParticipant) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(agreement);
  } catch (error) {
    return next(error);
  }
};

export const getMyAgreements = async (req, res, next) => {
  try {
    const agreements = await Agreement.find({ $or: [{ userA: req.user.id }, { userB: req.user.id }] }).sort({ createdAt: -1 });
    return res.json(agreements);
  } catch (error) {
    return next(error);
  }
};

export const exportAgreementPdf = async (req, res, next) => {
  try {
    const agreement = await Agreement.findById(req.params.id);
    if (!agreement) {
      return res.status(404).json({ message: "Agreement not found" });
    }

    const isParticipant = [String(agreement.userA), String(agreement.userB)].includes(String(req.user.id));
    if (!isParticipant) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const [userA, userB] = await Promise.all([User.findById(agreement.userA), User.findById(agreement.userB)]);

    const buffer = await generateAgreementPdf(agreement, {
      userA: userA?.username || "User A",
      userB: userB?.username || "User B"
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=agreement-${agreement._id}.pdf`);
    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
};
