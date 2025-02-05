import cors from "cors";
import firebaseAdmin from "firebase-admin";
import fs from "fs/promises";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";

// Setup path for the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize express app
const app = express();
app.use(express.json());

// CORS configuration (make sure this matches your frontend origin)
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000", // Or the URL of your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure Authorization header is allowed
  })
);


// Pre-flight OPTIONS request handler
app.options("*", cors());

// Load Firebase configuration from config.json
const config = JSON.parse(
  await fs.readFile(path.join(__dirname, "..", "config.json"), "utf8")
);

// Replace escaped newlines in the private key
const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    ...config,
    private_key: privateKey,
  }),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com", // Update to your Firebase Realtime Database URL
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Skincare App API" });
});

// Route to get products from Firebase
app.get("/products", async (req, res) => {
  try {
    const query = req.query.query ? req.query.query.toLowerCase() : ""; // Default to empty string if no query is provided
    console.log("Received query:", query);

    const db = firebaseAdmin.database();
    const productsRef = db.ref("products");
    const snapshot = await productsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({ products: [], total: 0 });
    }

    const products = snapshot.val();
    console.log("Fetched Products:", products);

    // Map and filter products based on the query
    let filteredProducts = Object.keys(products)
      .map((key) => {
        let product = { id: key, ...products[key] };

        const priceInGBP = product.price
          ? product.price.replace(/[^\d.-]/g, "")
          : "0";

        return {
          id: product.id || "",
          product_name: product.product_name || "",
          product_type: product.product_type || "",
          price: parseFloat(priceInGBP), // Ensure price is a number
          product_url: product.product_url || "",
          clean_ingreds: product.clean_ingreds || "",
        };
      })
      .filter((product) => product.product_name.toLowerCase().includes(query)); // Filter based on query

    console.log("Filtered Products:", filteredProducts);

    res
      .status(200)
      .json({ products: filteredProducts, total: filteredProducts.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products." });
  }
});

// Export the app
export default app;
