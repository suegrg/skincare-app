import React, { useState, useEffect } from "react";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import ProductOpen from "./components/ProductPopup";
import Login from "./authorization/Login";
import "./index.css";

// firebase initialization
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  
  const fetchProducts = async (query = "") => {
    const production = true;

    try {
      console.log("Using token:", token);
      const response = await fetch(
        !production ? `http://localhost:4000/products?query=${query}` : `https://api-xi-black.vercel.app/products?query=${query}`,
        {
          method: "GET",
          headers: { 
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "", 
          },
        }
      );
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error(
          `HTTP error! Status: ${response.status}, Details: ${errorDetails}`
        );
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);  
    }
  };

  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user
          .getIdToken()
          .then((idToken) => {
            setToken(idToken); 
            console.log("Token fetched:", idToken);
          })
          .catch((error) => {
            console.error("Error fetching token:", error);
            setToken(null);
          });
      } else {
        setToken(null);
      }
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToken(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const nextPage = () => {
    if (indexOfLastProduct < products.length) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <Router>
      <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
        {!token ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Header onLogout={handleLogout} />
            <SearchBar onSearch={fetchProducts} />
            <main className="w-full flex-grow px-4 mt-10">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <ProductList
                        products={currentProducts}
                        onProductClick={setSelectedProduct}
                      />
                      {selectedProduct && (
                        <ProductOpen
                          product={selectedProduct}
                          onClose={() => setSelectedProduct(null)}
                        />
                      )}
                      {/* Pagination Controls */}
                      <div className="flex items-center justify-center space-x-2 mt-4">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs"
                        >
                          Prev
                        </button>
                        <span className="text-gray-700 text-xs">
                          Page {currentPage}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={indexOfLastProduct >= products.length}
                          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 text-xs"
                        >
                          Next
                        </button>
                      </div>
                    </>
                  }
                />
              </Routes>
            </main>
          </>
        )}
      </div>
    </Router>
  );
}
