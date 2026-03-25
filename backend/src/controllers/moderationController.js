import { Report } from "../models/Report.js";
import { User } from "../models/User.js";

export const blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (String(userId) === String(req.user.id)) {
      return res.status(400).json({ message: "Cannot block yourself" });
    }

    await User.findByIdAndUpdate(req.user.id, { $addToSet: { blockedUsers: userId } });
    return res.json({ message: "User blocked" });
  } catch (error) {
    return next(error);
  }
};

export const reportUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason?.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    const report = await Report.create({
      reporterId: req.user.id,
      reportedUserId: userId,
      reason
    });

    return res.status(201).json(report);
  } catch (error) {
    return next(error);
  }
};
