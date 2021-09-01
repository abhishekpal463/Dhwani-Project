const mongoose = require('mongoose');
const schema = mongoose.Schema;

const childSchema = new schema({
    name:{
        type:String,
        required:true
    },
    sex:{
        type:String
    },
    dob:{
        type:Date
    },
    fname:{
        type:String
    },
    mname:{
        type:String
    },
    state:{
        type:String
    },
    district:{
        type:String
    },
    image:{
        type:String
    }
},
{timestamps:true}
);

const Chlid = mongoose.model('Child',childSchema);

module.exports = Chlid;

