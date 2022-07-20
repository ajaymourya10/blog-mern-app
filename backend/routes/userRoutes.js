const express = require("express");
const {
  userRegisterController,
  userLoginController,
  fetchUsersController,
  deleteUserController,
  fetchSingleUserController,
  updateUserController,
  updateUserPasswordController,
  followingUserController,
  unFollowUserController,
  blockUserController,
  unBlockUserController,
  generateVerificationTokenController,
} = require("../controller/users/userController");
const authMiddleware = require("../middleware/auth/authMiddleware");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterController);
userRoutes.post("/login", userLoginController);
userRoutes.delete("/:id", deleteUserController);
userRoutes.get("/:id", fetchSingleUserController);
userRoutes.put("/password", authMiddleware, updateUserPasswordController);
userRoutes.put("/follow", authMiddleware, followingUserController);
userRoutes.put("/unfollow", authMiddleware, unFollowUserController);
userRoutes.put("/edit/:id", authMiddleware, updateUserController);
userRoutes.put("/block/:id", authMiddleware, blockUserController);
userRoutes.put("/unblock/:id", authMiddleware, unBlockUserController);
userRoutes.post("/send-email", authMiddleware, generateVerificationTokenController);
userRoutes.get("/", authMiddleware, fetchUsersController);

module.exports = userRoutes;
