import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  lastLogin: { type: Date },
  lastLogout: { type: Date },
});

// Pre-save hook to hash the password
UserSchema.pre("save", async function (next) {
  const user = this as any;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Pre-update hook to hash the password
UserSchema.pre("updateOne", async function (next) {
  const user = this as any;

  if (!user._update.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user._update.password = await bcrypt.hash(user._update.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

export default User;
