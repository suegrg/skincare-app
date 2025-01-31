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
import "./tailwind-base.css"; 
import "./tailwind-utilities.css"; 

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [token, setToken] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const fetchProducts = async (query = "") => {
    try {
      console.log("Fetching products for query:", query);

      const response = await fetch(
        `http://localhost:4000/products?query=${query}`
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("Parsed Data:", data);

      setProducts(data.products || []);
      setCurrentPage(1); // reset to first page on new search
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // fetch all products when user logs in
  useEffect(() => {
    if (token) fetchProducts();
  }, [token]);

  // listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          setToken(idToken);
          console.log("Token fetched:", idToken);
        });
      } else {
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToken(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // pagination logic
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
    <Router basename="/my-heroui-app/">
      <div className="flex flex-col items-center w-full min-h-screen">
        {/* This will stack all the components vertically */}
        {!token ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Header onLogout={handleLogout} />
            <SearchBar onSearch={fetchProducts} />
            <main className="w-full flex-grow px-4">
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
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="text-gray-700">
                          Page {currentPage}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={indexOfLastProduct >= products.length}
                          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
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
