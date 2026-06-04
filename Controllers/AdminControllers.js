const Product = require("../model/product");

// GET PRODUCT UPLOAD FORM PAGE

// const getCreateProduct = (req, res) => {
//   res.send(`
//     <h2>Create Product</h2>

//     <form method="POST" action="/admin/create-product" enctype="multipart/form-data">

//       <!-- Basic Info -->
//       <input type="text" name="title" placeholder="Title" required />
//       <br/><br/>

//       <textarea name="description" placeholder="Description"></textarea>
//       <br/><br/>

//       <input type="text" name="brand" placeholder="Brand (Pedigree, Drools)" />
//       <br/><br/>

//       <input type="text" name="category" placeholder="Category (dog/cat/bird)" required />
//       <br/><br/>

//       <!-- Pricing -->
//       <input type="number" name="price" placeholder="Price" required />
//       <br/><br/>

//       <input type="number" name="discount" placeholder="Discount (%)" />
//       <br/><br/>

//       <input type="text" name="currency" placeholder="Currency (INR)" />
//       <br/><br/>

//       <!-- Images -->
//       <input type="file" name="images" accept="image/*" multiple required />
//       <small>Hold Ctrl (Windows) / Cmd (Mac) to select multiple images</small>
//       <br/><br/>

//       <!-- Inventory -->
//       <input type="number" name="stock" placeholder="Stock" />
//       <br/><br/>

//       <input type="number" step="0.1" name="rating" placeholder="Rating (1-5)" />
//       <br/><br/>

//       <!-- Status -->
//       <label>
//         Featured:
//         <input type="checkbox" name="isFeatured" />
//       </label>
//       <br/><br/>

//       <label>
//         Active:
//         <input type="checkbox" name="isActive" checked />
//       </label>
//       <br/><br/>

//       <!-- Extra -->
//       <input type="text" name="highlight" placeholder="Highlight (Best Seller, Sale)" />
//       <br/><br/>

//       <input type="text" name="size" placeholder="Size (S, M, L)" />
//       <br/><br/>

//       <input type="text" name="color" placeholder="Color" />
//       <br/><br/>

//       <input type="number" name="weight" placeholder="Weight (kg/g)" />
//       <br/><br/>

//       <button type="submit">Add Product</button>

//     </form>
//   `);
// };

//CREATE PRODUCT ROUTE
const postCreateProduct = async (req, res) => {
  try {
    // VALIDATE REQUIRED FIELDS
    const {
      title,
      description,
      price,
      discount,
      currency,
      category,
      subCategory,
      brand,
      stock,
      rating,
      highlight,
      size,
      color,
      weight,
      ram,
      isFeatured,
      isActive,
      slug,
      oldPrice,

      // NEW TECHNICAL FIELDS
      pattern,
      finishType,
      itemWeight,
      productCareInstructions,
      isMicrowaveable,
      numberOfPieces,
      manufacturer,
      itemModelNumber,
      asin,
    } = req.body;

    // VALIDATE REQUIRED FIELDS ARE PROVIDED
    if (!title || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "MISSING REQUIRED FIELDS: TITLE, DESCRIPTION, PRICE, CATEGORY",
      });
    }

    // VALIDATE PRODUCT NAME LENGTH
    if (title.length < 3 || title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "PRODUCT NAME MUST BE BETWEEN 3 AND 100 CHARACTERS",
      });
    }

    // VALIDATE PRICE IS POSITIVE NUMBER
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "PRICE MUST BE A POSITIVE NUMBER",
      });
    }

    // VALIDATE DISCOUNT RANGE (0-100)
    if (discount && (isNaN(discount) || discount < 0 || discount > 100)) {
      return res.status(400).json({
        success: false,
        message: "DISCOUNT MUST BE BETWEEN 0 AND 100",
      });
    }

    // VALIDATE RATING RANGE (0-5)
    if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "RATING MUST BE BETWEEN 0 AND 5",
      });
    }

    // VALIDATE IMAGE FILES

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "AT LEAST ONE PRODUCT IMAGE IS REQUIRED",
      });
    }

    // VALIDATE MAXIMUM 6 IMAGES
    if (req.files.length > 6) {
      return res.status(400).json({
        success: false,
        message: "MAXIMUM 6 IMAGES ARE ALLOWED",
      });
    }

    // EXTRACT IMAGE FILENAMES
    const imageNames = req.files.map((file) => file.filename);

    console.log("IMAGES UPLOADED:", imageNames);
    // CREATE PRODUCT DOCUMENT
    const newProduct = new Product({
      title: title.trim(),
      description: description.trim(),

      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : 0,
      discount: discount ? parseFloat(discount) : 0,
      currency: currency || "INR",
      category: category.trim(),
      subCategory: subCategory && subCategory !== "None" ? subCategory : null,
      brand: brand ? brand.trim() : null,
      stock: stock ? parseInt(stock) : 0,
      rating: rating ? parseFloat(rating) : 0,
      highlight: highlight && highlight !== "None" ? highlight : null,
      size: size ? size.trim() : null,
      color: color ? color.trim() : null,
      weight: weight ? parseFloat(weight) : 0,
      ram: ram ? ram.trim() : null,

      // BOOLEAN FIELDS
      isFeatured:
        isFeatured === "true" || isFeatured === true || isFeatured === "on",
      isActive: isActive === "true" || isActive === true || isActive === "on",

      // IMAGES
      images: imageNames,

      // ===================================================================
      // NEW TECHNICAL FIELDS
      // ===================================================================

      pattern: pattern ? pattern.trim() : null,
      finishType: finishType ? finishType.trim() : null,
      itemWeight: itemWeight ? itemWeight.trim() : null,
      productCareInstructions: productCareInstructions
        ? productCareInstructions.trim()
        : null,

      isMicrowaveable:
        isMicrowaveable === "true" ||
        isMicrowaveable === true ||
        isMicrowaveable === "on",

      numberOfPieces: numberOfPieces ? parseInt(numberOfPieces) : 0,
      manufacturer: manufacturer ? manufacturer.trim() : null,
      itemModelNumber: itemModelNumber ? itemModelNumber.trim() : null,
      asin: asin ? asin.trim() : null,
    });

    // SAVE PRODUCT
    const savedProduct = await newProduct.save();

    console.log("PRODUCT SAVED SUCCESSFULLY IN DATABASE:", savedProduct._id);

    // SUCCESS RESPONSE
    return res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product: savedProduct,
    });
  } catch (error) {
    // HANDLE ERRORS

    console.error("ERROR WHILE CREATING PRODUCT:", error);

    // CHECK IF ERROR IS DUPLICATE KEY ERROR
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "PRODUCT ALREADY EXISTS",
      });
    }

    // RETURN GENERIC ERROR RESPONSE
    return res.status(500).json({
      success: false,
      message: "ERROR WHILE CREATING PRODUCT",
      error: error.message,
    });
  }
};

//GET PRODUCTS LIST CONTROLLER
const getProductsList = async (req, res) => {
  try {
    //FETCHING PRODUCTS FROM DB
    const products = await Product.find().sort({ createdAt: -1 });
    //SENDING RESPONSE
    res.status(200).json({
      success: true,
      products: products,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "ERRORE WHILE FETCHING PRODUCTS FROM DB",
    });
  }
};

// FETCHING PRODUCT BY ID
const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "ERRORE WHILE FETCHING PRODUCT BY ID",
    });
  }
};

// UPDATE PRODUCT BY ID CONTROLLER
const putProductUpdate = async (req, res) => {
  const imagesName = req.files.map((image) => image.fileName);
  const updatedData = { ...req.body };
  if (req.body && req.files.length > 0) {
    updatedData.images = req.files.map((image) => image.filename);
    console.log("check krne ke lie ----> ", updatedData);
  }

  const productId = req.params.id;
  console.log(productId);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { returnDocument: "after" },
    );
    console.log("Product update ke end tak db call ke baad tak chala");
    res.status(200).json({
      success: true,
      message: "YOUR PRODUCT UPDATE SUCCESSFULLY",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "ERRORE WHILE PRODUCT UPDATE BY ID",
    });
  }
};

const deleteProductById = async (req, res) => {
  const productId = req.params.id;
  try {
    await Product.findByIdAndDelete(productId);
    res.json({
      success: true,
      message: "PRODUCT DELETED",
    });
  } catch (err) {
    res.json({
      success: false,
      message: "ERROE WHILE DELETE PRODUCT IN DB",
    });
  }
};

// EXPORTS
module.exports = {
  // getCreateProduct,
  deleteProductById,
  putProductUpdate,
  postCreateProduct,
  getProductsList,
  getProductById,
};
