//EXTERNAL MODULES
const express = require("express");

//CONTROLLERS
const AdminControllers = require("../Controllers/AdminControllers");

//EXPORT ROUTE FACTORY
module.exports = (upload) => {
  const adminRouter = express.Router();

  //POST - CREATE NEW PRODUCT WITH IMAGE UPLOAD
  adminRouter.post(
    "/admin/product-upload",
    upload.array("images", 6),
    AdminControllers.postCreateProduct,
  );

  //GET PRODUCTS LIST
  adminRouter.get("/admin/products-list", AdminControllers.getProductsList);

  //GET PRODUCT BY ID
  adminRouter.get("/product/:id", AdminControllers.getProductById);

  //POST- UPDATE PRODUCT BY ID
  adminRouter.put(
    "/admin/product-update/:id",
    upload.array("images", 6),
    AdminControllers.putProductUpdate,
  );

  //DELETE PRODUCT BY ID
  adminRouter.delete(
    "/admin/delete-product/:id",
    AdminControllers.deleteProductById,
  );

  return adminRouter;
};
