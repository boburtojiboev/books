const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN"];
exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
