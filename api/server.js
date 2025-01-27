import express from "express";
import cors from "cors";
import firebaseAdmin from "firebase-admin";
import axios from "axios";
import fs from "fs";
import path from "path";

const app = express();

const API_URL = "http://localhost:4000/products";

export const fetchProducts = async (query) => {
  try {
    const response = await axios.get(API_URL, {
      params: { query },
    });
    return response;
  } catch (error) {
    console.error("Error in fetchProducts:", error);
    throw new Error("Error fetching products.");
  }
};

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"], // allow methods you want
    allowedHeaders: ["Content-Type", "Authorization"], // allow headers that you need
  })
);

app.use(express.json());

const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.resolve(
      "clean-skincare-app-firebase-adminsdk-fbsvc-6ea8ccd935.json"
    )
  )
);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com",
});

app.get("/", (req, res) => {
  res.send("Welcome to the Skincare App API");
});

app.get("/products", async (req, res) => {
  try {
    const { query } = req.query; // set search query
    console.log("Search Query:", query); // log query for debugging
    const db = firebaseAdmin.database();
    const productsRef = db.ref("products");

    const snapshot = await productsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send("No products found");
    }

    const products = snapshot.val();
    console.log("Fetched Products:", products); // log products for debugging

    let filteredProducts = Object.keys(products)
      .map((key) => ({
        id: key,
        ...products[key],
      }))
      .filter((product) => {
        const fieldsToSearch = [
          product.product_name || "",
          product.clean_ingreds || "",
          product.product_type || "",
        ];
        const combinedFields = fieldsToSearch.join(" ").toLowerCase();
        return query ? combinedFields.includes(query.toLowerCase()) : true;
      });

    console.log("Filtered Products:", filteredProducts); // log filtered products

    res.status(200).json({
      products: filteredProducts,
      total: filteredProducts.length, // total count of filtered products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products: " + error.message);
  }
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
