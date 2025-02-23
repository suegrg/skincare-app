import React, { useState, useEffect } from "react";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage"; // Import HomePage
import Login from "./authorization/Login"; // Import Login page

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [token, setToken] = useState(null);

  // Fetch products from the server
  const fetchProducts = async (query = "") => {
    const production = true;
    try {
      const response = await fetch(
        !production
          ? `http://localhost:4000/products?query=${query}`
          : `https://api-xi-black.vercel.app/products?query=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [] };
    }
  };

  useEffect(() => {
    // Track user authentication state and get token if logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user
          .getIdToken()
          .then((idToken) => setToken(idToken))
          .catch(() => setToken(null));
      } else {
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToken(null); // Clear token when user logs out
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              token={token}
              fetchProducts={fetchProducts}
              handleLogout={handleLogout}
              setToken={setToken}
            />
          }
        />
        <Route path="/login" element={<Login setToken={setToken} />} />{" "}
        {/* Login route */}
      </Routes>
    </Router>
  );
}
