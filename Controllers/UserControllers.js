const Product = require("../model/product");
const product = require("../model/product");
const WishList = require("../model/userModels/WishListModel");
const CartList = require("../model/userModels/CartModel");
const User = require("../model/authModel");
const Address = require("../model/userModels/AddressModel");
const fs = require("fs");
const path = require("path");

//Get Product List
const getProductList = async (req, res, next) => {
  try {
    const products = await Product.find();
    console.log(products);
    res.json(products);
  } catch (err) {
    res.status(500).send({ message: "err while data fetching", errore: err });
  }
};

//POST WISHLIST CONTROLLER
const postLikeProduct = async (req, res) => {
  const { productId } = req.body;

  const userId = req.user.id;

  let List = await WishList.findOne({ userId: userId });

  if (List) {
    for (const item of List.productIds) {
      console.log(item.toString());
      if (item.toString() === productId.toString()) {
        const filteredList = List.productIds.filter(
          (item) => item.toString() !== productId.toString(),
        );
        List.productIds = filteredList;
        console.log(List);
        try {
          await List.save();
          return res.json({
            success: true,
            message: "Product removed successfully from WishList",
            WishListProducts,
          });
        } catch (err) {
          console.log("Errore While Product remove from WishList", err);
          return res.json({
            success: false,
            message: "Errore While Product remove from WishList",
          });
        }
      }
    }

    List.productIds.push(productId);
    try {
      await List.save();
    } catch (err) {
      console.log("Errore while wishlist update with product id");
    }
    return res.json({
      success: true,
      message: "Product Added in the WishList",
    });
  }

  const newProductId = [productId];

  const newWishList = new WishList({
    userId,
    productIds: newProductId,
  });

  try {
    await newWishList.save();
    res.json({
      success: true,
      message: " Product Added in Wishlist",
    });
  } catch (err) {
    console.log("Errore While WishList save in DB", err);
  }
};

//HANDLE GET WISHLIST REQUEST
const getWishList = async (req, res) => {
  const user = req.user;
  let WishListObj = {};

  try {
    WishListObj = await WishList.findOne({ userId: user.id });
  } catch (err) {
    console.log("ERRORE WHILE FETCHING WISHLIST OBJ FROM DB");
    return res.status(500).json({
      success: false,
      message: "Error while fetching wishlist",
    });
  }

  const userWishList = WishListObj.productIds;

  try {
    const WishListProducts = await Product.find({
      _id: { $in: userWishList },
    });

    return res.status(401).json({
      success: true,
      WishListProducts,
    });
  } catch (err) {
    res.status(500).json({
      message: "Errore while WishListed products fetching ",
      success: true,
    });
  }
};

//HANDE GET ONLY WISHLIST REQUEST
const getOnlyWishList = async (req, res) => {
  const user = req.user.id;

  try {
    const WishListObj = await WishList.findOne({ userId: user });
    return res.status(200).json({
      success: true,
      message: "Only wishlist found sucssefully",
      onlyWishList: WishListObj.productIds,
    });
  } catch (err) {
    res.json({
      success: false,
      messages: "ERRORE WHILE FETHCING ONLY WISHLIST",
    });
  }
};

//HANDLE ADD TO CART REQUEST
const getAddToCart = async (req, res) => {
  const user = req.user.id;
  const { productId, quantity } = req.body;

  try {
    const List = await CartList.findOne({ userId: user });

    //if user cartlist does not  exist
    if (!List) {
      const newCartList = new CartList({
        userId: user,
        cartProducts: [
          {
            productId: productId,
            quantity: quantity,
          },
        ],
      });

      try {
        await newCartList.save();
        return res.status(200).json({
          success: true,
          message: "Cartlist created successfully",
        });
      } catch (err) {
        console.log("ERRORE WHILE CARTLIST CREATING IN DB", err);
        return res.json({
          success: false,
          message: "Errore While new cartlist creating",
        });
      }
    }

    // when user exist already
    const exist = List.cartProducts.some(
      (item) => item.productId.toString() === productId.toString(),
    );

    console.log(exist);
    if (exist) {
      List.cartProducts = List.cartProducts.map((item) => {
        if (item.productId.toString() === productId.toString()) {
          item.quantity += 1;
        }
        return item;
      });
    } else {
      List.cartProducts = [...List.cartProducts, { productId, quantity }];
    }

    try {
      await List.save();
      return res.status(200).json({
        success: true,
        message: "new product save successfully in db",
      });
    } catch (err) {
      console.log(
        "ERRORE WHILE NEW PRODUCT SAVE IN EXISTING CARTLIST ---->",
        err,
      );
      return res.json({
        success: false,
        message: "ERRORE WHILE NEW PRODUCT SAVE IN EXISTING CARTLIST ---->",
      });
    }
  } catch (err) {
    console.log(
      "ERRORE WHILE EXISTING CART LIST FETCHING FROM DB, performing any other operation---> ",
      err,
    );
  }
};

//HANDLE GET CART LIST REQUEST
const getCartList = async (req, res) => {
  const user = req.user.id;
  try {
    const cartListObj = await CartList.findOne({ userId: user });
    const cartListOnly = cartListObj.cartProducts;
    const cartProductsIds = cartListOnly.map((item) => {
      return item.productId;
    });
    const CartProducts = await Product.find({ _id: { $in: cartProductsIds } });
    // console.log(CartProducts);
    return res.status(200).json({
      success: true,
      message: "CartList found successfully",
      cartList: CartProducts,
      cartProductsIds: cartListOnly,
    });
  } catch (err) {
    console.log("ERRORE WHILE CARTLIST FETCHING FROM DB -->", err);
    res.status(401).json({
      success: false,
      message: "ERRORE WHILE CARTLIST FETCHING FROM DB",
    });
  }
};

//HANDLE PATHC QUANTITY OF CARTPRODUCTSa
const patchQuantity = async (req, res) => {
  const user = req.user.id;
  const { productId, action } = req.body;

  try {
    if (action === "increase") {
      await CartList.updateOne(
        { userId: user, "cartProducts.productId": productId },
        { $inc: { "cartProducts.$.quantity": 1 } },
      );
      return res.json({
        success: true,
        message: "Product quanitity increase successfully",
      });
    } else {
      await CartList.updateOne(
        { userId: user, "cartProducts.productId": productId },
        { $inc: { "cartProducts.$.quantity": -1 } },
      );
      return res.json({
        success: true,
        message: "Product quanitity decrease successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      success: false,
      message: "ERRORE WHILE QUANTITY INCREASE OR DECREASE IN DB",
    });
  }
};

//HANDLE DELETE CART PRODUCT REQUEST
const removeCartProduct = async (req, res) => {
  const { productId } = req.body;
  const user = req.user.id;
  console.log(productId);

  try {
    await CartList.updateOne(
      { userId: user },
      {
        $pull: {
          cartProducts: {
            productId: productId,
          },
        },
      },
    );
    res.json({
      success: true,
      message: "product remove from cartList successfully",
    });
  } catch (err) {
    console.log("ERRORE WHILE REMOVE PRODUCT FORM CARTLIST", err);
    res.json({
      success: false,
      message: "Errore while remove product from CartList",
    });
  }
};

//HANDLE FETCH USER REQUEST
const getUser = async (req, res) => {
  try {
    const loggedUser = await User.findById(req.user.id);
    const loggedUserObj = {
      firstName: loggedUser.firstName,
      lastName: loggedUser.lastName,
      email: loggedUser.email,
      profilePic: loggedUser.profilePic,
    };
    res.json({
      success: true,
      loggedUserObj,
    });
  } catch (err) {
    console.log("ERRORE WHILE USER FETCH FROME DB", err);
    res.json({
      success: false,
      messege: "Errore while user fetch from db",
    });
  }
};

//HANDLE POST PROFILEPIC
const postProfilePic = async (req, res) => {
  const userId = req.user.id;
  const profilePic = req.file;
  const { firstName, lastName, remove } = req.body;
  console.log("in the Bakcned------>", req.body);
  console.log("profile pic in backend--> ", profilePic);
  let userObj = {};
  try {
    userObj = await User.findById(userId);
    console.log("userObj-->", userObj);
  } catch (err) {
    console.log("ERRORE WHILE USER FETCH FROM DB", err);
    return res.json({
      messgae: "ERRORE WHILE USER FETCH FROM DB IN PROFILEPIC BLOCK",
      succes: false,
    });
  }

  if (remove === "remove") {
    const oldProfilePic = userObj.profilePic;
    const imagePath = path.join("uploads", oldProfilePic);

    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log("Image deleted successfully");
      } catch (err) {
        console.log("Error while deleting image:", err);
      }
    }

    userObj.profilePic = null;
  }

  if (profilePic) {
    userObj.profilePic = profilePic.filename;
  }

  userObj.firstName = firstName;
  userObj.lastName = lastName;

  console.log("modified userObj--> ", userObj);
  try {
    await userObj.save();
    return res.json({
      message: "user Profile Update Successfully",
      success: true,
    });
    console.log("userObj save succeslfully");
  } catch (err) {
    console.log("errore while profilePic save in db".err);
    return res.json({
      success: false,
      message: "errore while profilePic save in db",
    });
  }
};

//HANDLE SAVE ADDRESS REQUEST
const saveAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Address saved successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// FETCH USER ADDRESS
const fetchUserAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUser,
  fetchUserAddress,
  saveAddress,
  postProfilePic,
  getProductList,
  postLikeProduct,
  getWishList,
  getOnlyWishList,
  getAddToCart,
  getCartList,
  patchQuantity,
  removeCartProduct,
};
