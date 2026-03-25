import { Profile } from "../models/Profile.js";

export const upsertProfile = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      payload,
      { new: true, upsert: true, runValidators: true }
    );

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};

export const getMyProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    return res.json(profile);
  } catch (error) {
    return next(error);
  }
};
