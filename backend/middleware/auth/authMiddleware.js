const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer"))
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded?.id).select("-password");
        req.user = user;
      } else {
        throw new Error(`No Token attached,please attach a valid Token`);
      }
      next();
    } catch (error) {
      throw new Error(`Token Expired or not found, login again`);
    }else{
      throw new Error(`No Token, please attach a valid Token`)
    }
});

module.exports = authMiddleware;
