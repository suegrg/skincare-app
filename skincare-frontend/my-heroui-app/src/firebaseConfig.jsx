import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDBsIZbIi39dfgCLER9mUHKux5yj-K0EIs",
  authDomain: "clean-skincare-app.firebaseapp.com",
  databaseURL: "https://clean-skincare-app-default-rtdb.firebaseio.com",
  projectId: "clean-skincare-app",
  storageBucket: "clean-skincare-app.firebasestorage.app",
  messagingSenderId: "276844869532",
  appId: "1:276844869532:web:eed9c5b5172a848435ba59",
  measurementId: "G-4Y9QGH9YD9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Auth instance
export const auth = getAuth(app);
export default App; // Exports app as the default export
