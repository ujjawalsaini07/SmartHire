import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import { generateToken ,generateRefreshToken} from "../utils/jwt.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role
  });

  const accesstoken = generateToken({
    userId: user._id,
    role: user.role
  });


  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    accesstoken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};






export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: "User is blocked" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  
const refreshToken = generateRefreshToken({
    userId: user._id,
    role: user.role
  });

  const accesstoken = generateToken({
    userId: user._id,
    role: user.role
  });


  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    accesstoken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};


export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });

  res.json({ message: "Logged out" });
};

