// IMPORTS

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// ROUTERS

const adminRouter = require("./Routes/AdminRoutes");
const userRouter = require("./Routes/UserRoutes");
const authRouter = require("./Routes/AuthRoutes");

// MIDDLEWARE SETUP

// ENABLE CORS FOR REACT FRONTEND TO COMMUNICATE WITH BACKEND
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// PARSE JSON REQUEST BODIES FOR API REQUESTS
app.use(express.json({ limit: "10mb" }));

// PARSE FORM-ENCODED REQUEST BODIES FOR TRADITIONAL FORMS
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
app.use(cookieParser());

// MULTER SETUP

// CONFIGURE WHERE AND HOW TO STORE UPLOADED FILES
const storage = multer.diskStorage({
  // SET DESTINATION FOLDER FOR UPLOADS
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  // SET FILENAME FORMAT (TIMESTAMP + ORIGINAL NAME FOR UNIQUENESS)
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// CONFIGURE FILE FILTER TO ONLY ALLOW IMAGE FILES
const fileFilter = (req, file, cb) => {
  // ALLOWED IMAGE EXTENSIONS
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  // ALLOW ONLY VALID IMAGE FILES
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("ONLY IMAGE FILES ARE ALLOWED"));
  }
};

// CREATE MULTER INSTANCE WITH STORAGE, FILTER, AND FILE SIZE LIMITS
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // SET MAXIMUM FILE SIZE TO 2MB PER IMAGE
    fileSize: 2 * 1024 * 1024,
  },
});

// LOGGING MIDDLEWARE

// LOG ALL INCOMING REQUESTS (METHOD AND URL)
app.use("/", (req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// STATIC FILES

// SERVE UPLOADED IMAGES AS STATIC FILES
app.use("/uploads", express.static("uploads"));

// ROUTES

// BASIC HOME PAGE ROUTE
app.use("/home", (req, res) => {
  res.send(`
    <h2>Admin Panel</h2>
    <a href="/admin/create-product">
      <button>Create Product</button>
    </a>
  `);
});

// ADMIN ROUTES (PASS UPLOAD MIDDLEWARE TO ROUTER)
app.use(adminRouter(upload));
// USER ROUTES
app.use(userRouter);
//AUTH ROUTES
app.use(authRouter);

// ERROR HANDLING

// HANDLE MULTER FILE UPLOAD ERRORS
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // HANDLE SPECIFIC MULTER ERRORS
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "FILE SIZE EXCEEDS LIMIT (MAX 2MB)",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "TOO MANY FILES (MAX 6 IMAGES)",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // HANDLE OTHER ERRORS
  if (err) {
    console.error("ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "INTERNAL SERVER ERROR",
    });
  }

  next();
});

// 404 NOT FOUND ROUTE
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "ROUTE NOT FOUND",
  });
});

// STARTUP

const PORT = process.env.PORT || 5000;
const DB_PATH =
  "mongodb+srv://root:marroooo81ratan@sohananuragi.2mws5gy.mongodb.net/petCart";

// CONNECT TO MONGODB AND START SERVER
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
    app.listen(PORT, () => {
      console.log(`✅ SERVER STARTED ON http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ ERROR CONNECTING TO DATABASE:", err.message);
    process.exit(1);
  });
