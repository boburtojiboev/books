const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN"];

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
