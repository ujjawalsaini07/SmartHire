import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      unique: true,
      trim: true,
      lowercase: true, // Store skills in lowercase for consistency
      maxlength: [100, "Skill name cannot exceed 100 characters"],
      index: true,
    },

    category: {
      type: String,
      enum: {
        values: ["technical", "soft-skill", "tool", "language", "framework", "other"],
        message: "{VALUE} is not a valid skill category",
      },
      default: "other",
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // Cannot be changed after creation
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt (updatedAt will track modifications)
  }
);

// Compound index for filtering active skills by category
SkillSchema.index({ category: 1, isActive: 1 });

// Text index for search functionality
SkillSchema.index({ name: "text" });

// Virtual for display name (capitalized)
SkillSchema.virtual("displayName").get(function () {
  return this.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
});

// Method to deactivate skill
SkillSchema.methods.deactivate = async function () {
  this.isActive = false;
  return this.save();
};

// Method to activate skill
SkillSchema.methods.activate = async function () {
  this.isActive = true;
  return this.save();
};

// Method to toggle active status
SkillSchema.methods.toggleActive = async function () {
  this.isActive = !this.isActive;
  return this.save();
};

// Static method to get all active skills
SkillSchema.statics.getActiveSkills = function (filters = {}) {
  return this.find({ isActive: true, ...filters }).sort({ name: 1 });
};

// Static method to get skills by category
SkillSchema.statics.getByCategory = function (category, activeOnly = true) {
  const query = { category };
  if (activeOnly) {
    query.isActive = true;
  }
  return this.find(query).sort({ name: 1 });
};

// Static method to search skills
SkillSchema.statics.searchSkills = function (searchTerm, activeOnly = true) {
  const query = {
    $text: { $search: searchTerm },
  };

  if (activeOnly) {
    query.isActive = true;
  }

  return this.find(query, { score: { $meta: "textScore" } }).sort({
    score: { $meta: "textScore" },
  });
};

// Static method to find or create skill
SkillSchema.statics.findOrCreate = async function (skillName, category = "other") {
  const normalizedName = skillName.trim().toLowerCase();

  let skill = await this.findOne({ name: normalizedName });

  if (!skill) {
    skill = await this.create({
      name: normalizedName,
      category,
    });
  }

  return skill;
};

// Static method to bulk find or create skills
SkillSchema.statics.bulkFindOrCreate = async function (skillNames, category = "other") {
  const skills = [];

  for (const skillName of skillNames) {
    const skill = await this.findOrCreate(skillName, category);
    skills.push(skill);
  }

  return skills;
};

// Static method to get skill statistics
SkillSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        activeCount: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const totalStats = await this.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ["$isActive", true] }, 1, 0] },
        },
      },
    },
  ]);

  return {
    byCategory: stats,
    total: totalStats[0]?.total || 0,
    active: totalStats[0]?.active || 0,
  };
};

// Pre-save middleware to normalize skill name
SkillSchema.pre("save", function () {
  // Ensure name is always lowercase and trimmed
  if (this.isModified("name")) {
    this.name = this.name.trim().toLowerCase();
  }
});

// Ensure virtuals are included in JSON output
SkillSchema.set("toJSON", { virtuals: true });
SkillSchema.set("toObject", { virtuals: true });

export default mongoose.model("Skill", SkillSchema);