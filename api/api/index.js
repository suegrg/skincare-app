import cors from "cors";
import firebaseAdmin from "firebase-admin";
import fs from "fs/promises";
import express from "express";
import { fileURLToPath } from "url";
import path, { parse } from "path";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 4000;
const production = false;

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

const config = JSON.parse(
  await fs.readFile(path.join(__dirname, "..", "config.json"), "utf8")
);

const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    ...config,
    private_key: privateKey,
  }),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com", // Update to your Firebase Realtime Database URL
});

// Route to fetch all products
app.get("/products", async (req, res) => {
  try {
    const query = req.query.query ? req.query.query.toLowerCase() : ""; // Default to empty string if no query is provided

    const db = firebaseAdmin.database();
    const productsRef = db.ref("products");
    const snapshot = await productsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({ products: [], total: 0 });
    }

    const products = snapshot.val();
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
          price: parseFloat(priceInGBP),
          product_url: product.product_url || "",
          clean_ingreds: product.clean_ingreds || "",
        };
      })
      .filter((product) => product.product_name.toLowerCase().includes(query));

    res
      .status(200)
      .json({ products: filteredProducts, total: filteredProducts.length });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Error fetching products." });
  }
});

// New Route: Get reviews for a specific product
app.get("/reviews", async (req, res) => {
  try {
    const productId = req.query.productId ? req.query.productId : "";
    const db = firebaseAdmin.database();
    const reviewsRef = db.ref(`reviews/${productId}`);
    const snapshot = await reviewsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({ reviews: [], total: 0 });
    }

    const reviews = snapshot.val();
    const reviewsList = Object.keys(reviews).map((key) => ({
      id: key,
      ...reviews[key],
    }));

    res.status(200).json({ reviews: reviewsList, total: reviewsList.length });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews." });
  }
});

// New Route: Submit a review for a specific product
app.post("/reviews/:productId", async (req, res) => {
  const productId = req.params.productId;
  const rating = parseInt(req.body.rating);
  const comment = req.body.comment; // a string

  if (!rating || !comment) {
    return res.status(400).json({ error: "Rating and comment are required" });
  } else if (rating < 1 || rating > 5) {
    return res.status(400).json({
      error: "Rating must be between 1 and 5",
    });
  }

  try {
    const db = firebaseAdmin.database();
    const reviewsRef = db.ref(`reviews/${productId}`).push(); // Push a new review

    await reviewsRef.set({
      rating,
      comment,
      timestamp: firebaseAdmin.database.ServerValue.TIMESTAMP,
    });

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Error submitting review." });
  }
});

if (!production) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
