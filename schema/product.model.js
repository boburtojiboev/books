const mongoose = require("mongoose");
const {
  product_collection_enums,
  product_status_enums,
  product_discount_enums,
  product_size_enums,
  product_colors_enums,
} = require("../lib/config");

const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_author: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_sold_cnt: {
      type: Number,
      required: false,
    },

    product_images: {
      type: Object,
      required: false,
    },

    mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
); //createAt, updateAt;

productSchema.index(
  { mb_id: 1, product_name: 1, },
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);
