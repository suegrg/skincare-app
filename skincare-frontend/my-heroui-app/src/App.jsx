import { useState, useEffect } from "react";
import { firebaseConfig } from "./firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList";
import ProductOpen from "./components/ProductPopup";
import Login from "./authorization/Login";


const app = initializeApp(firebaseConfig); 
const auth = getAuth(app); 

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [token, setToken] = useState(null);

  const fetchProducts = async (query) => {
    if (!query) {
      console.log("Query is empty or undefined");
      setProducts([]); 
      return;
    }

    console.log("Fetching products for query:", query);

    try {
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const requestUrl = `http://localhost:4000/products?query=${query}`;
      console.log("Requesting URL:", requestUrl);

      const response = await fetch(requestUrl, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); 

      const processedProducts = data.products.map((product) => ({
        ...product,
        clean_ingreds:
          typeof product.clean_ingreds === "string"
            ? JSON.parse(product.clean_ingreds.replace(/'/g, '"')) 
            : product.clean_ingreds,
      }));

      console.log("Processed Products:", processedProducts); 
      setProducts(processedProducts); 
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products. Check the console for details.");
    }
  };

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

  return (
    <Router basename="/my-heroui-app/">
      {" "}
      {/* Add base path for deployment */}
      <div className="h-screen flex flex-col items-center">
        {!token ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Header />
            <SearchBar onSearch={fetchProducts} />
            {/* Log products here to ensure they are passed */}
            {console.log("Products passed to ProductList:", products)}

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
          </>
        )}
      </div>
    </Router>
  );
}
