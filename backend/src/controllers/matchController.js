import mongoose from "mongoose";
import { Match } from "../models/Match.js";
import { Profile } from "../models/Profile.js";
import { User } from "../models/User.js";
import { calculateCompatibility } from "../services/matchingService.js";

const sortedPair = (a, b) => [String(a), String(b)].sort();

export const refreshMatches = async (req, res, next) => {
  try {
    const meProfile = await Profile.findOne({ userId: req.user.id });
    const meUser = await User.findById(req.user.id).lean();

    if (!meProfile) {
      return res.status(400).json({ message: "Please complete onboarding first" });
    }

    const excluded = (meUser.blockedUsers || []).map((id) => new mongoose.Types.ObjectId(id));

    const profiles = await Profile.find({ userId: { $ne: req.user.id, $nin: excluded } }).lean();

    const operations = [];
    for (const profile of profiles) {
      const compatibility = calculateCompatibility(meProfile, profile);
      if (compatibility < 40) continue;

      const users = sortedPair(req.user.id, profile.userId);
      operations.push({
        updateOne: {
          filter: { users: users.map((id) => new mongoose.Types.ObjectId(id)) },
          update: { $set: { users: users.map((id) => new mongoose.Types.ObjectId(id)), compatibility } },
          upsert: true
        }
      });
    }

    if (operations.length) {
      await Match.bulkWrite(operations);
    }

    return res.json({ message: "Matches refreshed" });
  } catch (error) {
    return next(error);
  }
};

export const getMatches = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();
    const blockedSet = new Set((user.blockedUsers || []).map((id) => String(id)));

    const matches = await Match.find({ users: req.user.id })
      .sort({ compatibility: -1 })
      .limit(30)
      .populate({ path: "users", select: "username realName isAnonymous blockedUsers" })
      .lean();

    const filtered = matches
      .map((match) => {
        const partner = match.users.find((u) => String(u._id) !== String(req.user.id));
        if (!partner || blockedSet.has(String(partner._id))) return null;

        const meBlockedByPartner = (partner.blockedUsers || []).some((id) => String(id) === String(req.user.id));
        if (meBlockedByPartner) return null;
        return { ...match, partner };
      })
      .filter(Boolean);

    const partnerProfiles = await Profile.find({ userId: { $in: filtered.map((m) => m.partner._id) } }).lean();
    const profileMap = new Map(partnerProfiles.map((p) => [String(p.userId), p]));

    const data = filtered.map((match) => {
      const partnerProfile = profileMap.get(String(match.partner._id));
      const revealRequests = match.revealRequests || {};
      return {
        id: match._id,
        compatibility: match.compatibility,
        revealed: match.revealed,
        revealRequestedByMe: Boolean(revealRequests[String(req.user.id)]),
        partner: {
          id: match.partner._id,
          username: match.partner.username,
          displayName:
            match.revealed && !match.partner.isAnonymous && match.partner.realName
              ? match.partner.realName
              : match.partner.username,
          age: partnerProfile?.age,
          bio: partnerProfile?.bio || "",
          personalityTag: partnerProfile?.personalityTag || "Calm thinker",
          avatarStyle: partnerProfile?.avatarStyle || "lorelei-neutral",
          avatarSeed: partnerProfile?.avatarSeed || String(match.partner.username || "alignedlife")
        }
      };
    });

    return res.json(data);
  } catch (error) {
    return next(error);
  }
};

export const requestRevealIdentity = async (req, res, next) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findOne({ _id: matchId, users: req.user.id });
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    match.revealRequests.set(String(req.user.id), true);
    const [userA, userB] = match.users.map(String);
    const bothAccepted = Boolean(match.revealRequests.get(userA)) && Boolean(match.revealRequests.get(userB));
    if (bothAccepted) {
      match.revealed = true;
    }

    await match.save();
    return res.json({ revealed: match.revealed });
  } catch (error) {
    return next(error);
  }
};
