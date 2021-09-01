const express = require("express");
const adminRouter = express.Router();

//const userRouter = express.Router();
const { auth,
        signin,
        signup,
        addState, 
        addDistrict,
        getState,
        getDistrict
        } = require("../controller/admin");

adminRouter.post("/signup",signup);
adminRouter.post("/signin",signin);
adminRouter.post("/addstate",auth,addState);
adminRouter.post("/:stateid/adddistrict",auth,addDistrict);
adminRouter.get("/getstate",auth,getState);
adminRouter.get("/getdistrict",auth,getDistrict)

module.exports = adminRouter;  