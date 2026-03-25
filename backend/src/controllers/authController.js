import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "../models/User.js";

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const toAuthPayload = (user) => ({
  id: user._id,
  email: user.email,
  username: user.username,
  displayName: user.isAnonymous || !user.realName ? user.username : user.realName,
  isAnonymous: user.isAnonymous,
  acceptedRealityCheck: user.acceptedRealityCheck
});

const normalizeUsername = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 18) || "aligned_user";

const buildUniqueUsername = async (seed) => {
  const base = normalizeUsername(seed);
  let candidate = base;
  let i = 0;

  while (await User.exists({ username: candidate })) {
    i += 1;
    candidate = `${base}${i}`.slice(0, 24);
  }

  return candidate;
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, username, realName, isAnonymous } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Email, password, and username are required" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      username,
      realName: realName || "",
      isAnonymous: isAnonymous ?? true
    });

    const token = signToken(user._id);
    return res.status(201).json({ token, user: toAuthPayload(user) });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);
    return res.json({ token, user: toAuthPayload(user) });
  } catch (error) {
    return next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google auth is not configured" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      const usernameSeed = payload.given_name || payload.name || payload.email.split("@")[0];
      const username = await buildUniqueUsername(usernameSeed);
      const passwordHash = await bcrypt.hash(`${payload.sub}-${Date.now()}`, 10);

      user = await User.create({
        email: payload.email,
        passwordHash,
        username,
        googleId: payload.sub,
        realName: payload.name || "",
        isAnonymous: true
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const token = signToken(user._id);
    return res.json({ token, user: toAuthPayload(user) });
  } catch (error) {
    return next(error);
  }
};
