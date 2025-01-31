import cors from "cors";
import firebaseAdmin from "firebase-admin";
import fs from "fs/promises";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4174",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


const config = JSON.parse(
  await fs.readFile(path.join(__dirname, "..", "config.json")),
  "utf8"
);
const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    ...config,
    private_key: privateKey,
  }),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com",
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Skincare App API" });
});

const GBP_TO_USD_RATE = 1.36; // Conversion rate (you can update it dynamically using an API if needed)

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

        // Remove the currency symbol and keep only the numeric value
        const priceInGBP = product.price
          ? product.price.replace(/[^\d.-]/g, "")
          : "0";

        return {
          id: product.id || "",
          product_name: product.product_name || "",
          product_type: product.product_type || "",
          price: parseFloat(priceInGBP), // Store only numeric value
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

export default app;
