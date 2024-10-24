// const assert = require("assert");
// const { shapeIntoMongooseObjectId } = require("../lib/config");
// const Definer = require("../lib/mistake");
// const OrderModel = require("../schema/order.model");
// const OrderItemModel = require("../schema/order_item.model");
// const memberModel = require("../schema/member.model");

// class Order {
//   constructor() {
//     this.ordermodel = OrderModel;
//     this.orderItemModel = OrderItemModel;
//   }

//   async createOrderData(member, data) {
//     try {
//       let order_total_amount = 0,
//         delivery_cost = 0;
//       const mb_id = shapeIntoMongooseObjectId(member._id);
//       data.map((item) => {
//         order_total_amount += item.quantity * item.price;
//       });

//       if (order_total_amount < 100) {
//         delivery_cost = 2;
//         order_total_amount += delivery_cost;
//       }

//       const order_id = await this.saveOrderData(
//         order_total_amount,
//         delivery_cost,
//         mb_id
//       );
//       console.log("order_id:::", order_id);

//       // order items creation
//       await this.recordOrderItemsData(order_id, data);

//       return order_id;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async saveOrderData(order_total_amount, delivery_cost, mb_id) {
//     try {
//       const new_order = new this.ordermodel({
//         order_total_amount: order_total_amount,
//         order_delivery_cost: delivery_cost,
//         mb_id: mb_id,
//       });
//       const result = await new_order.save();
//       assert.ok(result, Definer.order_err1);
//       console.log("result:::", result);

//       return result._id;
//     } catch (err) {
//       console.log(err);
//       throw new Error(Definer.order_err1);
//     }
//   }

//   async recordOrderItemsData(order_id, data) {
//     try {
//       const pro_list = data.map(async (item) => {
//         return await this.saveItemsOrderData(item, order_id);
//       });
//       const results = await Promise.all(pro_list);
//       console.log("results:::", results);
//       return true;
//     } catch (err) {
//       throw err;
//     }
//   }

  
//   async saveItemsOrderData(item, order_id) {
//     try {
//       order_id = shapeIntoMongooseObjectId(order_id);
//       item._id = shapeIntoMongooseObjectId(item._id);

//       const order_item = new this.orderItemModel({
//         item_quantity: item.quantity,
//         item_price: item.price,
//         order_id: order_id,
//         product_id: item._id,
//       });

//       const result = await order_item.save();
//       assert.ok(result, Definer.order_err2);
//       return "inserted";
//     } catch (err) {
//       throw new Error(Definer.order_err2);
//     }
//   }

//   async getMyOrdersData(member, query) {
//     try {
//       const mb_id = shapeIntoMongooseObjectId(member._id),
//         order_status = query.status.toUpperCase(),
//         matches = { mb_id: mb_id, order_status: order_status };

//       const result = await this.ordermodel
//         .aggregate([
//           { $match: matches },
//           { $sort: { createdAt: -1 } },
//           {
//             $lookup: {
//               from: "orderitems",
//               localField: "_id",
//               foreignField: "order_id",
//               as: "order_items",
//             },
//           },
//           {
//             $lookup: {
//               from: "products",
//               localField: "order_items.product_id",
//               foreignField: "_id",
//               as: "product_data",
//             },
//           },
//         ])
//         .exec();

//       console.log("result::", result);
//       assert.ok(result, Definer.order_err1);

//       return result;
//     } catch (err) {
//       throw err;
//     }
//   }

//   async editChosenOrderData(member, data) {
//     try {
//       const mb_id = shapeIntoMongooseObjectId(member._id),
//         order_id = shapeIntoMongooseObjectId(data.order_id),
//         order_status = data.order_status.toUpperCase();

//       const result = await this.ordermodel.findOneAndUpdate(
//         { mb_id: mb_id, _id: order_id },
//         { order_status: order_status },
//         { runValidators: true, lean: true, returnDocument: "after" }
//       );
//       console.log(result);

//       assert.ok(result, Definer.order_err3);
//       return result;
//     } catch (err) {
//       throw err;
//     }
//   }
// }

// module.exports = Order;
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const OrderModel = require("../schema/order.model");
const OrderItemModel = require("../schema/order_item.model");
const ProductModel = require("../schema/product.model"); // Import the Product model

class Order {
  constructor() {
    this.ordermodel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.productModel = ProductModel; // Initialize ProductModel for product operations
  }

  async createOrderData(member, data) {
    try {
      let order_total_amount = 0,
        delivery_cost = 0;
      const mb_id = shapeIntoMongooseObjectId(member._id);

      // Calculate total amount for the order
      data.map((item) => {
        order_total_amount += item.quantity * item.price;
      });

      // Add delivery cost if order total is below a threshold
      if (order_total_amount < 100) {
        delivery_cost = 2;
        order_total_amount += delivery_cost;
      }

      // Save the order and get order ID
      const order_id = await this.saveOrderData(
        order_total_amount,
        delivery_cost,
        mb_id
      );
      console.log("order_id:::", order_id);

      // Create order items and update product_sold_cnt
      await this.recordOrderItemsData(order_id, data);

      return order_id;
    } catch (err) {
      console.log("Error in createOrderData:", err.message);
      throw err;
    }
  }

  async saveOrderData(order_total_amount, delivery_cost, mb_id) {
    try {
      const new_order = new this.ordermodel({
        order_total_amount: order_total_amount,
        order_delivery_cost: delivery_cost,
        mb_id: mb_id,
      });
      const result = await new_order.save();
      assert.ok(result, Definer.order_err1);
      console.log("result:::", result);

      return result._id;
    } catch (err) {
      console.log("Error in saveOrderData:", err.message);
      throw new Error(Definer.order_err1);
    }
  }

  async saveItemsOrderData(item, order_id) {
    try {
      const new_order_item = new this.orderItemModel({
        order_id: shapeIntoMongooseObjectId(order_id), // ensure order_id is passed correctly
        product_id: shapeIntoMongooseObjectId(item._id), // ensure product_id is passed correctly
        item_price: item.price, // ensure item_price is passed correctly
        item_quantity: item.quantity, // ensure item_quantity is passed correctly
      });

      const result = await new_order_item.save();
      assert.ok(result, Definer.order_item_err1);
      console.log("Order item saved::", result);

      // Update the product_sold_cnt for the product
      await this.productModel.findByIdAndUpdate(
        shapeIntoMongooseObjectId(item._id),
        { $inc: { product_sold_cnt: item.quantity } }, // Increment product_sold_cnt by the quantity
        { new: true }
      );
      console.log(`Updated product_sold_cnt for product: ${item._id}`);
      return result;
    } catch (err) {
      console.log("Error in saveItemsOrderData:", err.message);
      throw err;
    }
  }

  // Record order items and update the product_sold_cnt for each item
  async recordOrderItemsData(order_id, data) {
    try {
      const pro_list = data.map(async (item) => {
        return await this.saveItemsOrderData(item, order_id);
      });
      const results = await Promise.all(pro_list);
      console.log("Order items saved:::", results);
      return true;
    } catch (err) {
      console.log("Error in recordOrderItemsData:", err.message);
      throw err;
    }
  }
}

module.exports = Order;