import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import { Chip } from "@heroui/react"; 

export default function ProductCard({ product, onClick }) {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const toggleReviewForm = (e) => {
    e.stopPropagation();
    setShowReviewForm((prevState) => !prevState);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 hover:shadow-2xl transition duration-300 cursor-pointer flex flex-col items-center"
      onClick={() => onClick(product)}
    >
      {/* Product Name */}
      <h3 className="text-lg font-bold text-teal-600 text-center">
        {product.product_name}
      </h3>

      {/* Product Type as a Chip */}
      <Chip size="sm" className="bg-teal-200 text-teal-700 mt-2">
        {product.product_type}
      </Chip>

      {/* Product Ingredients */}
      <p className="text-gray-500 text-xs text-center mt-2">
        {product.clean_ingreds}
      </p>

      {/* Price */}
      <p className="mt-3 text-md font-semibold text-teal-700">
        ${product.price}
      </p>

      {/* Write Review Button */}
      <button
        onClick={toggleReviewForm}
        className="mt-3 bg-teal-500 text-black px-4 py-2 rounded-lg hover:bg-teal-600"
      >
        {showReviewForm ? "Close Review Form" : "Write Review"}
      </button>

      {/* Conditionally Render the Review Form */}
      {showReviewForm && (
        <div className="mt-4 w-full">
          <ReviewForm /> {/* Display the review form */}
        </div>
      )}
    </div>
  );
}
