import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import SearchBar from "./SearchBar";
import ProductList from "./ProductList";
import ProductOpen from "./ProductPopup";
import Login from "../authorization/Login";

const HomePage = ({ token, fetchProducts, handleLogout, setToken }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const productsPerPage = 16;
  const navigate = useNavigate();

  // Fetch products on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts();
        console.log("API Response:", data); // Debugging
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (error) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Fetch products regardless of authentication
  }, [fetchProducts]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const nextPage = () => {
    if (indexOfLastProduct < filteredProducts.length)
      setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Search handler function
  const handleSearch = (query) => {
    console.log("Search Query:", query); // Debugging
    if (query) {
      const filtered = products.filter((product) =>
        product?.product_name?.toLowerCase().includes(query.toLowerCase())
      );
      console.log("Filtered Products:", filtered); // Debugging
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Reset to all products if query is empty
    }
    setCurrentPage(1); // Reset to first page when search changes
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100">
      <Header token={token} onLogout={handleLogout} setToken={setToken} />
      <SearchBar onSearch={handleSearch} />
      <main className="w-full flex-grow px-4 mt-10">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            {/* Product List */}
            {currentProducts.length > 0 ? (
              <ProductList
                products={currentProducts}
                onProductClick={setSelectedProduct}
              />
            ) : (
              <div className="text-center text-gray-500">
                No products found.
              </div>
            )}

            {/* Product Popup */}
            {selectedProduct && (
              <ProductOpen
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
              />
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col items-center space-y-4 mt-8">
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-[#D1C7B7] text-[#333333] rounded-lg hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200 ease-in-out disabled:bg-gray-200 disabled:text-gray-400"
                >
                  Prev
                </button>
                <button
                  className="px-4 py-2 text-sm border border-transparent text-[#333333] bg-gray-100 hover:bg-[#F7F7F7] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200 ease-in-out"
                  disabled
                >
                  Page {currentPage}
                </button>
                <button
                  onClick={nextPage}
                  disabled={indexOfLastProduct >= filteredProducts.length}
                  className="px-4 py-2 text-sm border border-[#D1C7B7] text-[#333333] rounded-lg hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200 ease-in-out disabled:bg-gray-200 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
