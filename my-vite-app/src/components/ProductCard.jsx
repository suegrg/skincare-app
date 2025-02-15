import React, { useState } from "react";
import { Chip } from "@heroui/react";
import ReviewForm from "./ReviewForm";

// Function to handle review submission
const submitReview = async (reviewData, productId) => {
  try {
    console.log(reviewData);

    if (reviewData.rating < 1 || reviewData.rating > 5 || !reviewData.review) {
      throw new Error(
        "Please provide a rating between 1 and 5, and a valid comment."
      );
    }

    const response = await fetch(`http://localhost:4000/reviews/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: reviewData.rating,
        comment: reviewData.review,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Backend error:", errorData);
      throw new Error(errorData.error || "Failed to submit review");
    }

    const result = await response.json();
    console.log("Backend response:", result);

    if (result.message) {
      alert("Review submitted successfully!");
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting review:", error);
    alert(error.message || "Failed to submit the review.");
  }
};

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 3, review: "", productId: product.id });
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Close modal if clicked outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setIsModalOpen(false);
      setIsReviewFormOpen(false);
    }
  };

  // Open review form inside modal
  const toggleReviewForm = () => {
    setIsReviewFormOpen(true);
  };

  // Handle review form submission
  const handleReviewSubmit = async (reviewData) => {
    await submitReview(reviewData, product.id);
    setIsReviewFormOpen(false);
  };

  return (
    <>
      {/* PRODUCT CARD */}
      <div
        className="product-card bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-transform transform hover:translate-y-[-5px] hover:shadow-lg border-2 border-[#D1C7B7] hover:border-[#B8A894] w-full sm:w-[240px] sm:min-h-[180px] flex flex-col justify-between text-center mb-4"
        onClick={toggleModal}
      >
        <h3 className="text-sm sm:text-md font-bold text-[#333333]">
          {product.product_name}
        </h3>

        <div className="flex justify-center mt-2">
          <Chip size="sm" className="text-[#333333] px-3 py-1 rounded-full">
            {product.product_type}
          </Chip>
        </div>

        <p className="mt-3 text-sm font-semibold text-[#333333]">
          ${product.price}
        </p>
      </div>

      {/* POP-UP MODAL */}
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full sm:w-[400px] relative border-2 border-[#D1C7B7] z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#333333] mb-4">
              PRODUCT DETAILS
            </h3>

            <div className="mt-4 space-y-3 text-left">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">
                  PRODUCT NAME:{" "}
                </span>
                {product.product_name}
              </p>

              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">
                  PRODUCT TYPE:{" "}
                </span>
                {product.product_type}
              </p>

              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">
                  INGREDIENTS:{" "}
                </span>
                {product.clean_ingreds}
              </p>

              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">PRICE: </span>$
                {product.price}
              </p>
            </div>

            {/* REVIEW BUTTON */}
            <button
              className="mt-5 border-2 border-[#D1C7B7] text-[#333333] font-semibold py-2 px-4 rounded-lg hover:bg-[#F7F7F7] transition-all w-full"
              onClick={toggleReviewForm}
            >
              Write Review
            </button>

            {isReviewFormOpen && (
              <ReviewForm
                onReviewSubmit={handleReviewSubmit}
                onClose={() => setIsReviewFormOpen(false)}
                reviewData={reviewData}
                setReviewData={setReviewData}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
