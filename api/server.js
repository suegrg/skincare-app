import express from "express";
import cors from "cors";
import firebaseAdmin from "firebase-admin";
import fs from "fs";

const app = express();
app.use(express.json());

// ✅ FIX: Correct frontend origin without a subdirectory
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend access
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Firebase Admin SDK Initialization
const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    ...config,
    private_key: privateKey,
  }),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com",
});

// ✅ FIX: Always return JSON, even on the root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Skincare App API" });
});

// ✅ FIX: Products API - Always return JSON
app.get("/products", async (req, res) => {
  try {
    const query = req.query.query ? req.query.query.toLowerCase() : ""; // Default to empty string
    console.log("Received query:", query);

    const db = firebaseAdmin.database();
    const productsRef = db.ref("products");
    const snapshot = await productsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({ products: [], total: 0 });
    }

    const products = snapshot.val();
    console.log("Fetched Products:", products);

    let filteredProducts = Object.keys(products)
      .map((key) => {
        let product = { id: key, ...products[key] };

        return {
          id: product.id || "",
          product_name: product.product_name || "",
          product_type: product.product_type || "",
          price: product.price || "",
          product_url: product.product_url || "",
          clean_ingreds: product.clean_ingreds || "",
        };
      })
      .filter((product) => product.product_name.toLowerCase().includes(query));

    console.log(
      "Final Response:",
      JSON.stringify(
        { products: filteredProducts, total: filteredProducts.length },
        null,
        2
      )
    );

    res
      .status(200)
      .json({ products: filteredProducts, total: filteredProducts.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products." });
  }
});



// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
