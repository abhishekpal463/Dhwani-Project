const express = require("express");
const imageRouter = express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require("crypto");
const path = require('path');
const mongoose = require("mongoose");
const url = "mongodb+srv://abhishekpal463:Abhipal123@cluster0-wlpqz.mongodb.net/ProductDB";

imageRouter.use(methodOverride('_method'));
let gfs;

const conn = mongoose.createConnection(url, {
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
  
// Create storage engine
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

imageRouter.get("/show/:filename" , (req,res) => {
    const filename=req.params.filename;
    gfs.files.findOne({filename:filename},(err,file)=>{
        if(!file || file.length === 0){
            return res.status(404).json({
              err:"No files"
            });
          }
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else{
            res.status(404).json({
                err:"Not a Image"
            })
        }
         
    });
});

module.exports = imageRouter;