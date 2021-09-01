const mongoose = require("mongoose");
const Admin = require("../models/admin");
const State =  require("../models/state");
const District = require("../models/district");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtSecret = "jhkhkljlkjhkhjghf";

exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    jwt.verify(token, JwtSecret, (err, user) => {
      if (err) return res.send("Invalid Token, Please Login!");
      req.user = user;
      next();
    });
  } catch (error) {
    res.send("Invalid Credentials");
  }
};

exports.signup = (req, res) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then((admin) => {
      if (admin.length >= 1) {
        return res.status(409).json({
          message: "Mail Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const admin = new Admin({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            admin
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "Admin Created",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.signin = (req, res) => {
  Admin.find({ email: req.body.email })
    .exec()
    .then((admin) => {
      if (admin.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: admin[0].email,
              adminId: admin[0]._id,
            },
            JwtSecret,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Signin Successfully",
            token: token,
            email: req.body.email,
            adminId:admin[0]._id
          });
        }
        res.status(401).json({
          message: "AUth Failed",
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.addState = async (req,res)=>{
    const newState = new State({
        state:req.body.state
    });
    console.log(newState);
    
    newState.save(async function(err){
        if(err){
            res.send(err);
        }
        else{
            res.send(newState);
        }
    });
}; 

exports.addDistrict = async (req,res)=>{
    State.findOne({_id:req.params.stateid}, async function(err,state){
        if(err){
          res.send(err)
        }
        else{
          const newDistrict = new District({
          district:req.body.district
        });
          await newDistrict.save(async function(err){
            if(!err){
              await state.district.push(newDistrict._id);
              await state.save();
              res.send(state);
            }
            else{
              res.send(err);
            }
          }); 
           
        }
    });
};

exports.getState = async(req,res)=>{
    State.find(async (err,states)=>{
        if(err)
            res.send(err);
        else
            res.send(states);
    });
}

exports.getDistrict = async(req,res)=>{
    District.find(async (err,districts)=>{
        if(err)
            res.send(err);
        else
            res.send(districts);
    });
}