import { User } from "../models/User.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      displayName: user.isAnonymous || !user.realName ? user.username : user.realName,
      isAnonymous: user.isAnonymous,
      acceptedRealityCheck: user.acceptedRealityCheck
    });
  } catch (error) {
    return next(error);
  }
};

export const acceptRealityCheck = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { acceptedRealityCheck: true },
      { new: true }
    ).lean();

    return res.json({ acceptedRealityCheck: user.acceptedRealityCheck });
  } catch (error) {
    return next(error);
  }
};
