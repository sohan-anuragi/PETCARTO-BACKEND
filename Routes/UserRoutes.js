//External modules
const express = require("express");
const userRouter = express.Router();

//INTERNAL MODULES
const UserControllers = require("../Controllers/UserControllers");
const AuthControllers = require("../Controllers/AuthControllers");
const authModel = require("../model/authModel");
const { upload } = require("../multer");

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

//HANDLE PATCH PRODUCT QUANTITY IN CARTLIST
userRouter.patch(
  "/product-quantity",
  AuthControllers.authenticated,
  UserControllers.patchQuantity,
);

//HANDLE DELETE CART PRODUCT FROM CARTLIST
userRouter.delete(
  "/remove-cart-product",
  AuthControllers.authenticated,
  UserControllers.removeCartProduct,
);

//HANDLE FETCH USER REQUEST LOGGED IN OR NOT
userRouter.get("/user", AuthControllers.authenticated, UserControllers.getUser);

//HANDLE PROFILE PIC SAVE
userRouter.post(
  "/user-profilepic",
  AuthControllers.authenticated,
  upload.single("profilePic"),
  UserControllers.postProfilePic,
);

//HANDLE ADDRESS SAVE REQUEST
userRouter.post(
  "/save-address",
  AuthControllers.authenticated,
  UserControllers.saveAddress,
);

//FETCH ADDRESS API
userRouter.get(
  "/user-address",
  AuthControllers.authenticated,
  UserControllers.fetchUserAddress,
);

module.exports = userRouter;
