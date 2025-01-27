const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./clean-skincare-app-firebase-adminsdk-fbsvc-a738c9eba9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com/",
});

const db = admin.database();

const productData = JSON.parse(fs.readFileSync("output.json", "utf8"));

const productsRef = db.ref("products");

productsRef.set(productData, (error) => {
  if (error) {
    console.error("Data could not be saved:", error.message);
  } else {
    console.log("Data saved successfully!");
  }
});
