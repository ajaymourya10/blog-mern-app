const expressAsyncHandler = require("express-async-handler");
const User = require("../../model/User");
const generateToken = require("../../config/token/generateToken");
const validateMongodbId = require("../../utils/validateMongodbID");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

/* Register User */
const userRegisterController = expressAsyncHandler(async (req, res) => {
  // console.log(req.body);
  try {
    //checking existance of user
    const isUserExist = await User.findOne({ email: req?.body?.email });
    if (isUserExist) {
      throw new Error(`User with email ${req?.body?.email} already exists!`);
    }
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
    // res.json("user Registered");
  } catch (err) {
    res.json(err.message);
  }
});

/* Login User */
const userLoginController = expressAsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: req?.body?.email });
    if (!user) {
      throw new Error(`Email Address: ${email} doesn't Exist`);
    } else {
      if (await user.isPasswordMatched(password)) {
        // res.json("user login");
        res.json({
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          profilePic: user?.profilePic,
          isAdmin: user?.isAdmin,
          token: generateToken(user?._id),
        });
      } else {
        throw new Error(`Wrong Password`);
      }
    }
  } catch (err) {
    res.json(err.message);
  }
});

/* Fetch all users */
const fetchUsersController = expressAsyncHandler(async (req, res) => {
  // console.log(req.headers);
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
});

/* Delete User */
const deleteUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error.message);
  }
});

/* Fetch single user detail */
const fetchSingleUserController = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error.message);
  }
});

/* Update User */
const updateUserController = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      bio: req?.body?.bio,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

/* Update User password */
const updateUserPasswordController = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  console.log(_id);
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
  console.log(password);
  console.log(user.password);
  res.json(user);
});

/* Following User*/
const followingUserController = expressAsyncHandler(async (req, res) => {
  //find user to follow and add his/her followers
  const { followId } = req.body;
  const { id } = req.user;
  console.log(id, followId);
  if (req.user.following.includes(followId)) {
    throw new Error(`Already followed this person`);
  }
  await User.findByIdAndUpdate(
    followId,
    { $push: { followers: id } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    id,
    { $push: { following: followId } },
    { new: true }
  );
  res.json(`You successfully followed ${followId}`);
});

/* unfollowing User*/
const unFollowUserController = expressAsyncHandler(async (req, res) => {
  const { unfollowId } = req.body;
  const userId = req.user.id;
  if (!req.user.following.includes(unfollowId)) {
    throw new Error(`You didn't follow this user`);
  }
  await User.findByIdAndUpdate(
    userId,
    { $pull: { following: unfollowId } },
    { new: true }
  );
  await User.findByIdAndUpdate(
    unfollowId,
    { $pull: { followers: userId } },
    { new: true }
  );
  res.json(`you successfully unfollowed ${unfollowId}`);
});

/*block user */
const blockUserController = expressAsyncHandler(async (req, res) => {
  const blockUserId = req.params.id;
  validateMongodbId(blockUserId);
  if (!req.user.isAdmin) {
    throw new Error(
      `You have no permission to block anyone, because you're not an Admin`
    );
  }
  const userToBlock = await User.findById(blockUserId);
  if (userToBlock.isBlocked) {
    throw new Error(`User is already Blocked`);
  }
  await User.findByIdAndUpdate(blockUserId, { isBlocked: true }, { new: true });
  res.json(`you successfully blocked user with id ${blockUserId}`);
});

/*unblock user */
const unBlockUserController = expressAsyncHandler(async (req, res) => {
  const unBloclkUserId = req.params.id;
  validateMongodbId(unBloclkUserId);
  if (!req.user.isAdmin) {
    throw new Error(
      `You have no permission to unblock anyone, because you're not an Admin`
    );
  }
  const userToUnblock = await User.findById(unBloclkUserId);
  if (!userToUnblock.isBlocked) {
    throw new Error(`User is already Unblocked`);
  }
  await User.findByIdAndUpdate(
    unBloclkUserId,
    { isBlocked: false },
    { new: true }
  );
  res.json(`you successfully unblocked user with id ${unBloclkUserId}`);
});

/*send email ===> verify user*/
const generateVerificationTokenController = expressAsyncHandler(
  async (req, res) => {
    try {
      //build message
      const msg = {
        to: "udit.gour1998@gmail.com",
        from: "ajaybly7890@gmail.com",
        subject: "First Mail",
        text: "Hey Man Whatsapp?",
        html:"<h1>Hiii</H1>"
      };
      await sgMail.send(msg);
      res.json("email sent");
    } catch (error) {
      throw new Error(error);
    }
  }
);

module.exports = {
  userLoginController,
  userRegisterController,
  fetchUsersController,
  deleteUserController,
  fetchSingleUserController,
  updateUserController,
  generateVerificationTokenController,
  updateUserPasswordController,
  followingUserController,
  unFollowUserController,
  blockUserController,
  unBlockUserController,
};
