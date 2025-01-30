import express from "express";
import cors from "cors";
import firebaseAdmin from "firebase-admin";
import axios from "axios";
import fs from "fs";
import path from "path";

// Firebase Admin SDK Initialization
const app = express();

const API_URL = "http://localhost:4000/products";

// Your existing function to fetch products remains unchanged
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

// ✅ Fix CORS middleware: Remove incorrect URL
app.use(
  cors({
    origin: "http://localhost:5173", // Fixed frontend URL
    methods: ["GET", "POST", "OPTIONS"], // Allow OPTIONS for preflight
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Handle preflight OPTIONS requests globally
app.options("*", cors());

app.use(express.json());

const config = JSON.parse(fs.readFileSync("./config.json", "utf-8"));

// Firebase Admin initialization
const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
const serviceAccount = {
  type: config.type,
  project_id: config.project_id,
  private_key_id: config.private_key_id,
  private_key: privateKey,
  client_email: config.client_email,
  client_id: config.client_id,
  auth_uri: config.auth_uri,
  token_uri: config.token_uri,
  auth_provider_x509_cert_url: config.auth_provider_x509_cert_url,
  client_x509_cert_url: config.client_x509_cert_url,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com",
});

app.get("/", (req, res) => {
  res.send("Welcome to the Skincare App API");
});

app.get("/products", async (req, res) => {
  try {
    const { query } = req.query; // Get query parameter
    console.log("Search Query:", query); // Log query for debugging
    const db = firebaseAdmin.database();
    const productsRef = db.ref("products");

    const snapshot = await productsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).send("No products found");
    }

    const products = snapshot.val();
    console.log("Fetched Products:", products); // Log products for debugging

    let filteredProducts = Object.keys(products)
      .map((key) => {
        let product = { id: key, ...products[key] };

        // Ensure clean_ingreds is handled correctly
        if (typeof product.clean_ingreds === "string") {
          try {
            // Remove extra quotes or incorrect characters before parsing
            const cleanedString = product.clean_ingreds
              .replace(/^['"\[]+|['"\]]+$/g, "") // Remove leading/trailing quotes/brackets
              .replace(/'/g, '"'); // Replace single quotes with double quotes (valid JSON format)

            const ingredientsArray = JSON.parse(`[${cleanedString}]`); // Ensure it's parsed as an array
            product.clean_ingreds = ingredientsArray.join(" ").toLowerCase(); // Convert to space-separated string
          } catch (error) {
            console.error(
              "Error parsing clean_ingreds:",
              error,
              "Value:",
              product.clean_ingreds
            );
            product.clean_ingreds = ""; // Default to empty string if parsing fails
          }
        }

        return product;
      })
      .filter((product) => {
        const fieldsToSearch = [
          (product.product_name || "").toLowerCase(),
          (product.product_type || "").toLowerCase(),
          (product.clean_ingreds || "").toLowerCase(),
        ];

        const combinedFields = fieldsToSearch.join(" ");
        return query ? combinedFields.includes(query.toLowerCase()) : true;
      });

    console.log("Filtered Products:", filteredProducts); // Log filtered products

    res.status(200).json({
      products: filteredProducts,
      total: filteredProducts.length, // Total count of filtered products
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
