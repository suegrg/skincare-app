import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

// Fetch reviews from the backend
const fetchReviews = async (productId, setReviews, setLoading) => {
  if (!productId) {
    console.error("Invalid product ID:", productId);
    return;
  }

  setLoading(true);
  try {
    const url = `https://api-xi-black.vercel.app/reviews?productId=${productId}`;
    console.log(`Requesting URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const responseText = await response.text(); // Get the error response as text
      console.error("Error fetching reviews from server:", responseText);
      throw new Error(
        `HTTP error! Status: ${response.status}, Response: ${responseText}`
      );
    }

    const data = await response.json();
    console.log("Fetched reviews data:", data); // Log the raw response

    // Check if the response is an object and contains a 'reviews' array
    if (data && data.reviews && Array.isArray(data.reviews)) {
      setReviews(data.reviews);
    } else {
      console.error(
        "Invalid data format: Expected an object with a 'reviews' array, but got",
        data
      );
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
  } finally {
    setLoading(false);
  }
};

// Submit a new review
const submitReview = async (reviewData, productId, setReviews) => {
  try {
    if (!productId) {
      console.error("Invalid product ID for submitting review:", productId);
      return;
    }

    console.log("Submitting review:", reviewData);

    // Validate review data
    if (reviewData.rating < 1 || reviewData.rating > 5 || !reviewData.review) {
      throw new Error(
        "Please provide a rating between 1 and 5, and a valid comment."
      );
    }

    const response = await fetch(
      `/reviews/${productId}`, // Use the relative URL without the localhost part
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Correct content type for sending JSON
        },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.review,
        }),
      }
    );

    if (!response.ok) {
      const responseText = await response.text();
      console.error("Error from server:", responseText);
      throw new Error(
        `Failed to submit review. Server response: ${responseText}`
      );
    }

    // Assuming the server returns a success message, you can handle that here
    const result = await response.json();
    console.log("Review submitted successfully:", result.message);

    // Optionally, you can update the reviews list by re-fetching or appending the new review.
    setReviews((prevReviews) => [
      ...prevReviews,
      {
        rating: reviewData.rating,
        comment: reviewData.review,
        timestamp: Date.now(),
      },
    ]);

    // Show success message using Alert component
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Review Submitted</AlertTitle>
        <AlertDescription>
          Your review has been successfully submitted!
        </AlertDescription>
      </Alert>
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    alert(error.message || "Failed to submit the review.");
  }
};

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 3, review: "" });
  const [reviews, setReviews] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    if (isModalOpen && product?.id) {
      fetchReviews(product.id, setReviews, setLoading);
    }
  }, [isModalOpen, product?.id]);

  useEffect(() => {
    console.log("Reviews state updated:", reviews);
  }, [reviews]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleReviewSubmit = async (reviewData) => {
    await submitReview(reviewData, product.id, setReviews);
    setIsReviewFormOpen(false);
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round(totalRating / reviews.length);
  };

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      {/* PRODUCT CARD */}
      <div
        className="product-card bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-transform transform hover:translate-y-[-5px] hover:shadow-lg border-2 border-[#D1C7B7] hover:border-[#B8A894] w-full sm:w-[160px] sm:min-h-[140px] flex flex-col justify-between text-center mb-4"
        onClick={toggleModal}
      >
        <h3 className="text-sm sm:text-md font-bold text-[#333333]">
          {product?.product_name}
        </h3>
        <p className="mt-3 text-sm font-bold text-[#333333]">
          ${Number(product?.price).toFixed(2)}
        </p>
      </div>

      {/* POP-UP MODAL */}
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 rounded-2xl"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-[3rem] mx-[5rem] sm:w-[400px] relative border-2 border-[#D1C7B7] z-60"
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
                {product?.product_name}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">
                  PRODUCT TYPE:{" "}
                </span>
                {product?.product_type}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">
                  INGREDIENTS:{" "}
                </span>
                {product?.clean_ingreds}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">PRICE: </span>$
                {product?.price}
              </p>
            </div>

            {/* AVERAGE RATING */}
            <p className="text-gray-700 text-sm">
              Average Rating: {calculateAverageRating(reviews)}
            </p>

            {/* REVIEW BUTTON */}
            <button
              className="mt-5 border-2 border-[#D1C7B7] text-[#333333] font-semibold py-2 px-4 rounded-lg hover:bg-[#F7F7F7] transition-all w-full"
              onClick={() => setIsReviewFormOpen(true)}
            >
              Write Review
            </button>

            {/* REVIEW FORM */}
            {isReviewFormOpen && (
              <ReviewForm
                onReviewSubmit={handleReviewSubmit}
                onClose={() => setIsReviewFormOpen(false)}
                reviewData={reviewData}
                setReviewData={setReviewData}
              />
            )}

            {/* CUSTOMER REVIEWS */}
            <h3 className="text-md font-semibold text-[#333333] mt-6">
              Customer Reviews
            </h3>
            <div className="mt-3 space-y-2 text-left">
              {isLoading ? (
                <p className="text-gray-500 text-sm">Loading reviews...</p>
              ) : currentReviews.length > 0 ? (
                currentReviews.map((review, index) => (
                  <div key={index} className="border-b py-2">
                    <p className="text-gray-700 text-sm">
                      <strong>Rating:</strong> {review.rating}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Comment:</strong> {review.comment || "No comment"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet.</p>
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between mt-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="text-sm text-[#333333] disabled:text-gray-400"
              >
                Prev
              </button>
              <span className="text-sm text-[#333333]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="text-sm text-[#333333] disabled:text-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
