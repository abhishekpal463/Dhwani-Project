const express = require("express");
const userRouter = express.Router();

const childRouter = require("../controller/child");
const {auth} =require("../controller/admin");
const manageVideoRouter = require("../controller/showImage");

userRouter.use("/deat",auth,childRouter);
userRouter.use("/image",manageVideoRouter);

module.exports = userRouter;  