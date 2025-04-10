import mongoose, { Document, Schema, Model } from "mongoose";
import { password } from "bun";
import shortid from "shortid";

// Interface for User document
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  profilePicture?: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User model (static methods)
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// User schema definition
const userSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
      default: () => shortid.generate(),
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash the password using Bun's password utility
    const hashedPassword = await password.hash(this.password, {
      algorithm: "bcrypt",
      cost: 10, // equivalent to bcrypt saltRounds
    });

    this.password = hashedPassword;
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (password: string) {
  const user = await User.findById(this._id).select("+password");

  if (!user) {
    throw new Error("User not found");
  }
  return Bun.password.verifySync(password, user.password);
};

// Static method to find a user by email
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email }).select("-password");
};

// Create and export the User model
const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
