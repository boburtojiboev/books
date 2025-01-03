const Product = require("../models/Product");
const assert = require("assert");
const Definer = require("../lib/mistake");
const jwt = require("jsonwebtoken");

let productController = module.exports;

productController.addNewProduct = async (req, res) => {
  try {
    console.log("POST: cont/addNewProduct");
    assert.ok(req.files, Definer.general_err3);

    const product = new Product();
    let data = req.body;

    data.product_images = req.files.map((ele) => {
      return ele.path;
    });

    const result = await product.addNewProductData(data, req.member);

     const html = `<script>
                       alert("new product added succesfully");
                       window.location.replace('/shop/products/menu');
                       </script>`;
     res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewProduct, ${err.message}`);
  }
};

productController.updateChosenProduct = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenProduct");
    const product = new Product();
    const id = req.params.id;
    const result = await product.updateChosenProductData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getAllProducts = async (req, res) => {
  try {
    console.log("POST: cont/getAllProducts");
    const product = new Product();
    const result = await product.getAllProductsData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllProducts, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

productController.getChosenProduct = async (req, res) => {
  try {
    console.log("GET: cont/getChosenProduct");
    const product = new Product();
    const id = req.params.id;
    const result = await product.getChosenProductData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};




productController.deleteChosenProduct = async (req, res) => {
  try {
    console.log("DELETE: cont/deleteChosenProduct");

    const product = new Product();
    const id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error("Invalid product ID format");
    }

    const result = await product.deleteChosenProductData(id, req.member._id);

    if (!result) {
      throw new Error(
        "Product not found or you don't have permission to delete this product"
      );
    }

    console.log("Deleted product:", result); // Log the result of the delete
    res.json({
      state: "success",
      message: "Product deleted successfully",
      data: result,
    });
  } catch (err) {
    console.log(`ERROR, cont/deleteChosenProduct, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};