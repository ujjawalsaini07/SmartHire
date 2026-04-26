import mongoose from "mongoose";

const SystemSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "global",
      unique: true,
      immutable: true,
      trim: true,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    autoModerateJobs: {
      type: Boolean,
      default: true,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

SystemSettingsSchema.statics.getSingleton = async function () {
  return this.findOneAndUpdate(
    { key: "global" },
    { $setOnInsert: { key: "global" } },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
};

export default mongoose.model("SystemSettings", SystemSettingsSchema);
