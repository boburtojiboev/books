const express = require("express");
const router = express.Router();
const memberController = require("./controller/memberController");
const productController = require("./controller/productController");
const uploader_product = require("./utils/upload-multer")("products");
// const uploader_product = require("./utils/upload-multer")("products");

// memberga dahldor
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);

router.post(
  "/createpro",
  memberController.validateAuthShop,
  uploader_product.array("product_image", 1),
  productController.addNewProduct
);

router.post(
  "/edit/:id",
  memberController.validateAuthShop,
  productController.updateChosenProduct
);

router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

router.get(
  "/products/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

router.delete(
  "/delete/:id",
  memberController.validateAuthShop, // Validate authentication and authorization
  productController.deleteChosenProduct
);

module.exports = router;
