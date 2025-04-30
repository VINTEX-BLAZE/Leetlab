// importing required Modules
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const UserSchema = new mongoose.Schema(
  {
    avatar: {
      type: {
        url: String,
        localPath: String,
      },
      default: {
        url: `https://via.placeholder.com/200x200.png`,
        localPath: "",
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpiery: {
      type: Date,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
  },
  { timestamp: true },
);

// configured pre hook to hash any modified password
UserSchema.pre( "save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 15);
  next();
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.GenerateAccessToken = async function () {
  return JWT.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

UserSchema.methods.GenerateTemporaryToken = async () => {
  // This token should be client facing
  // for example: for email verification unHashedToken should go into the user's mail
  const Token = crypto.randomBytes(8).toString("hex");

  // This should stay in the DB to compare at the time of verification
  const HashedToken = crypto.hash("sha256").update(Token).digest("hex");

  // This is the expiry time for the token (20 minutes)
  const TokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes;

  return { Token, HashedTokenashedToken, TokenExpiry };
};

const User = mongoose.model("User", UserSchema);
export default User;
