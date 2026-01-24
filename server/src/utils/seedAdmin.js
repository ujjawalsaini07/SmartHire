import User from "../models/User.model.js";

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@smartportal.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (!existingAdmin) {
      const admin = await User.create({
        name: "Super Admin",
        email: adminEmail,
        password: "Admin@123",
        role: "admin",
        isVerified: true,
        isActive: true,
      });

      console.log("✅ Admin user created successfully");
    } else {
      console.log("ℹ️  Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
    throw error;
  }
};

export default seedAdmin;
