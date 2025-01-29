import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { auth } from "./firebaseConfig"; 
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList"; 
import ProductOpen from "./components/ProductPopup";
import SignIn from "./components/SignIn";

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [token, setToken] = useState(null);

  const fetchProducts = async (query) => {
    try {
      const response = await fetch(
        `http://localhost:4000/products?query=${query}`
      );
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();

    console.log("Review Submitted:", { username, rating, comment });
    alert("Thank you for your review!");

    // clear the form
    setUsername("");
    setRating("");
    setComment("");
  };

  useEffect(() => {
    // check if the user is already logged in 
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          setToken(idToken);
        });
      } else {
        setToken(null); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <Router> {/* Add Router wrapper */}
      <div className="h-screen flex flex-col items-center">
        {/* Show SignIn if there's no token (user not logged in) */}
        {!token ? (
          <SignIn setToken={setToken} />
        ) : (
          <>
            <Header />
            <SearchBar onSearch={() => fetchProducts()} />
            <Routes>
              <Route
                path="/"
                element={
                  <ProductList
                    products={products}
                    onProductClick={setSelectedProduct} 
                  />
                }
              />
              <Route
                path="/product/:id" 
                element={
                  <ProductOpen
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                  />
                }
              />
            </Routes>
            <form
              id="reviewForm"
              className="mt-8 p-4 border rounded-lg shadow-md max-w-md"
              onSubmit={handleReviewSubmit}
            >
              <h2 className="text-2xl font-semibold mb-4">Submit Your Review</h2>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full p-2 border rounded-lg"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium mb-1"
                >
                  Rating
                </label>
                <select
                  id="rating"
                  className="w-full p-2 border rounded-lg"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                >
                  <option value="">Select a rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium mb-1"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
              >
                Submit Review
              </button>
            </form>
          </>
        )}
      </div>
    </Router>
  );
}
