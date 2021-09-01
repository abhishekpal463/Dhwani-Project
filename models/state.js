const mongoose = require("mongoose");
const schema = mongoose.Schema;

const stateSchema = new schema(
  {
    state: {
      type: String,
      required: true,
    },
    district: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "District",
      },
    ],
  },
  { timestams: true }
);

stateSchema.pre(/^find/,function (next){
  this.populate({
      path:'district'
  });
  next();
});

const State = mongoose.model("State", stateSchema);

module.exports = State;
