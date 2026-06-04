const Product = require("../model/product");
const product = require("../model/product");
const WishList = require("../model/userModels/WishListModel");
const CartList = require("../model/userModels/CartModel");

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
      List.cartProducts = List.cartProducts.filter(
        (item) => item.productId.toString() !== productId.toString(),
      );
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
    const cartList = cartListObj.cartProducts;
    return res.status(200).json({
      success: true,
      message: "CartList found successfully",
      cartList,
    });
  } catch (err) {
    console.log("ERRORE WHILE CARTLIST FETCHING FROM DB -->", err);
    res.status(401).json({
      success: false,
      message: "ERRORE WHILE CARTLIST FETCHING FROM DB",
    });
  }
};

module.exports = {
  getProductList,
  postLikeProduct,
  getWishList,
  getOnlyWishList,
  getAddToCart,
};
