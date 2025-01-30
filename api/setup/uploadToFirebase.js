const admin = require("firebase-admin");
const serviceAccount = require("./api/clean-skincare-app-firebase-adminsdk-fbsvc-a738c9eba9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com/",
});

// reference to Firestore
const db = admin.firestore();
const productsRef = db.collection("products");

// load the JSON data
const jsonData = require("./output.json"); // path to the JSON file generated from CSV

// upload data to Firebase Firestore
const uploadData = async () => {
  for (let product of jsonData) {
    try {
      await productsRef.add(product); // upload product data to Firestore
      console.log(`Added product: ${product.name}`);
    } catch (error) {
      console.error(`Error adding product: ${product.name}`, error);
    }
  }
  console.log("Data upload complete!");
};

// run the upload function
uploadData();

// run the script with node uploadToFirebase.js
