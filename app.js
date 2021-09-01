const express = require("express");
const mongoose = require("mongoose");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb+srv://abhishekpal463:Abhipal123@cluster0-wlpqz.mongodb.net/ProductDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const userRouter = require("./routes/child");
const adminRouter = require("./routes/admin");
 
app.use("/admin",adminRouter);
app.use("/child",userRouter);

app.listen(3000,()=>{
    console.log("Listening on port 3000");
});
