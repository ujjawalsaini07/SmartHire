import User from "../../models/User.model.js";
import Job from "../../models/Job.model.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const toggleBlockUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
  });
};

export const getAdminStats = async (req, res) => {
  const usersCount = await User.countDocuments();
  const jobsCount = await Job.countDocuments();

  res.json({
    usersCount,
    jobsCount,
  });
};
