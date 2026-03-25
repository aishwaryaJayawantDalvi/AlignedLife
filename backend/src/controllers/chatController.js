import { Chat } from "../models/Chat.js";
import { Match } from "../models/Match.js";
import { User } from "../models/User.js";
import { hasSensitiveContactInfo } from "../services/moderationService.js";

const ensureChat = async (match) => {
  const chat = await Chat.findOneAndUpdate(
    { matchId: match._id },
    { $setOnInsert: { participants: match.users } },
    { new: true, upsert: true }
  );
  return chat;
};

export const getMessages = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const match = await Match.findOne({ _id: matchId, users: req.user.id });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const chat = await ensureChat(match);
    return res.json(chat.messages);
  } catch (error) {
    return next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const match = await Match.findOne({ _id: matchId, users: req.user.id });
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    const me = await User.findById(req.user.id).lean();
    const partnerId = match.users.find((u) => String(u) !== String(req.user.id));

    if ((me.blockedUsers || []).some((id) => String(id) === String(partnerId))) {
      return res.status(403).json({ message: "You blocked this user" });
    }

    const flagged = hasSensitiveContactInfo(content);
    const chat = await ensureChat(match);

    const message = {
      senderId: req.user.id,
      content,
      moderationFlag: flagged
    };

    chat.messages.push(message);
    await chat.save();

    const saved = chat.messages[chat.messages.length - 1];
    return res.status(201).json({ ...saved.toObject(), warning: flagged ? "Avoid sharing personal contact info this early." : null });
  } catch (error) {
    return next(error);
  }
};
