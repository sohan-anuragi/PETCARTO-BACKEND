//External modules
const express = require("express");
const userRouter = express.Router();

//INTERNAL MODULES
const UserControllers = require("../Controllers/UserControllers");
const AuthControllers = require("../Controllers/AuthControllers");
const authModel = require("../model/authModel");

//GET PRODUCTS LIST FOR USERS
userRouter.get("/product-list", UserControllers.getProductList);

//HANDLE POST LIKE PRODUCT REQUEST
userRouter.post(
  "/wish-list",
  AuthControllers.authenticated,
  UserControllers.postLikeProduct,
);

//HANDLE GET WISHLIST REQUEST
userRouter.get(
  "/wish-list",
  AuthControllers.authenticated,
  UserControllers.getWishList,
);

//HANDLE GET ONLY WISHLIST REQUEST
userRouter.get(
  "/only-wishlist",
  AuthControllers.authenticated,
  UserControllers.getOnlyWishList,
);

//HANDLE ADD TO CART REQUEST
userRouter.post(
  "/add-to-cart",
  AuthControllers.authenticated,
  UserControllers.getAddToCart,
);

//HANDLE GET CARTLIST REQUEST
userRouter.get(
  "/cart-list",
  AuthControllers.authenticated,
  UserControllers.getCartList,
);

module.exports = userRouter;
