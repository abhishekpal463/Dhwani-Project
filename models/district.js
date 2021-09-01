const mongoose = require("mongoose");
const schema = mongoose.Schema;

const districtSchema = new schema(
  {
    district: {
      type: String,
      required: true,
    },
  },
  { timestams: true }
);

const District = mongoose.model("District", districtSchema);

module.exports = District;
