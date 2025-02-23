import React, { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products, onProductClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16; // 4 rows of 4 cards (16 total products per page)

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const nextPage = () => {
    if (indexOfLastProduct < products.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-4 gap-4">
        {" "}
        {/* 4 columns per row */}{" "}
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="p-4">
              <ProductCard product={product} onClick={onProductClick} />
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-gray-500">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
