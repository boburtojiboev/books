const ProductModel = require("../schema/product.model");
const assert = require("assert");
const Definer = require("../lib/mistake");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async addNewProductData(data, member) {
    try {
      data.mb_id = shapeIntoMongooseObjectId(member._id);

      const new_product = new this.productModel(data);
      const result = await new_product.save();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenProductData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      console.log("shu", id);
      mb_id = shapeIntoMongooseObjectId(mb_id);
      const result = await this.productModel
        .findByIdAndUpdate({ _id: id, mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsData(member, data) {
    try {
      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: 1 };

      const result = await this.productModel
        .aggregate([
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
        ])
        .exec();
      console.log("result::", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      const result = await this.productModel
        .aggregate([{ $match: { _id: id} }])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteChosenProductData(id, mb_id) {
    try {
      // Convert id and mb_id to ObjectId
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);

      console.log("Deleting product with ID:", id, "and Member ID:", mb_id);

      // Delete the product by matching product ID and member ID
      const result = await this.productModel
        .findOneAndDelete({
          _id: id,
          mb_id: mb_id,
        })
        .exec();

      // Check if the product was found and deleted
      assert.ok(result, Definer.general_err1); // Throws an error if the delete failed

      return result;
    } catch (err) {
      console.log("Error during product delete:", err.message); // Log any errors during the delete
      throw err;
    }
  }
}
module.exports = Product;
