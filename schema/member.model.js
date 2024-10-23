const mongoose = require("mongoose");
const { member_type_enums} = require("../lib/config");

const memberSchema = new mongoose.Schema({
    mb_nick: {
        type: String,
        required: true,
        index: {unique: true, sparse: true}
    },
    mb_phone: {
        type: Number,
        required: true,
        index: {unique: true, sparse: true}
    },
    mb_password: {
        type: String,
        required: true,
        select: false

    },
    mb_type: {
        type: String,
        required: false,
        default: "USER",
        enum: {
            values: member_type_enums,
            message: "{VALUE} is not among permitted values"
        }
    },
    mb_image: {
        type: String,
        required: false,
    },    
}, 
    {timestamps: true}
);

module.exports = mongoose.model("Member", memberSchema);