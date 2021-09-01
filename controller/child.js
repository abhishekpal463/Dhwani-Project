const mongoose = require("mongoose");
const express = require("express");
const childRouter = express.Router();
const Child = require("../models/child");
const multer = require("multer");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const crypto = require("crypto");
const path = require("path");

childRouter.use(methodOverride('_method'));

const url ="mongodb+srv://abhishekpal463:Abhipal123@cluster0-wlpqz.mongodb.net/ProductDB";

let gfs;

const conn = mongoose.createConnection(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('gridimage');
});

const storage = new GridFsStorage({
  url: url,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'gridimage'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({storage});

childRouter.post("/adddetails",upload.single("file"),async function (req, res) {
    let filename = undefined;
    if(req.file){
      filename=req.file.filename;
    }
    const date = new Date(req.body.dob);
    const result = new Child({
    name: req.body.name,
    sex: req.body.sex,
    dob:date,
    fname:req.body.fname,
    mname:req.body.mname,
    state:req.body.state,
    district:req.body.district,
    image:filename,
    });

    await result.save(async function(err){
        if(!err){
            res.send(result);
        }
        else{
            res.send(err);
        }
        });  
});

childRouter.get("/showdetails" , async (req,res)=>{
    Child.find((err,children)=>{
      if(err){
        res.send(err);
      }
      else{
        res.send(children);
      }
    });  
});

module.exports = childRouter;