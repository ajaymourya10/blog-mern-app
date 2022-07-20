const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//schema

const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First Name is Required"],
      type: String,
    },
    lastName: {
      required: [true, "Last Name is Required"],
      type: String,
    },
    email: {
      required: [true, "Email is Required"],
      type: String,
    },
    password: {
      required: [true, "Password is Required"],
      type: String,
    },
    profilePic: {
      default:
        "https://cdn.pixabay.com/photo/2017/08/10/03/47/guy-2617866_960_720.jpg",
      type: String,
    },
    postCount: {
      default: 0,
      type: Number,
    },
    bio: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Blogger"],
    },
    isFollowing: {
      type: Boolean,
      default: false,
    },
    isUnfollowing: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  //another object
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//convert passwordResetExpires
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  //hashing the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//matching passowrd
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Compile schema into model
const User = mongoose.model("User", userSchema);

module.exports = User;
