import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm";
import "../index.css"; 
import { FaStar } from "react-icons/fa"; 

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

// fetch reviews from the backend
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
      const responseText = await response.text();
      console.error("Error fetching reviews from server:", responseText);
      throw new Error(
        `HTTP error! Status: ${response.status}, Response: ${responseText}`
      );
    }

    const data = await response.json();
    console.log("Fetched reviews data:", data);

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

// submit a new review
const submitReview = async (reviewData, productId, setReviews) => {
  try {
    if (!productId) {
      console.error("Invalid product ID for submitting review:", productId);
      return;
    }

    console.log("Submitting review:", reviewData);

    if (reviewData.rating < 1 || reviewData.rating > 5 || !reviewData.review) {
      throw new Error(
        "Please provide a rating between 1 and 5, and a valid comment."
      );
    }

    const response = await fetch(
      `https://api-xi-black.vercel.app/reviews/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

    const result = await response.json();
    console.log("Review submitted successfully:", result.message);

    // update the reviews list after successful submission
    setReviews((prevReviews) => [
      ...prevReviews,
      {
        rating: reviewData.rating,
        comment: reviewData.review,
        timestamp: Date.now(),
      },
    ]);

    alert("Your review has been successfully submitted!");
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
    if (product?.id) {
      fetchReviews(product.id, setReviews, setLoading);
    }
  }, [product?.id]);

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

  // calculate average rating immediately
  const averageRating = calculateAverageRating(reviews);

  return (
    <>
      {/* PRODUCT CARD */}
      <div
        className="product-card bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-transform transform hover:translate-y-[-5px] hover:shadow-lg border-2 border-[#D1C7B7] hover:border-[#B8A894] w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg flex flex-col justify-between text-center mb-4"
        onClick={toggleModal}
      >
        <div className="mb-2">
          <h3 className="text-sm sm:text-md font-bold text-[#333333] text-left">
            {product?.product_name}
          </h3>
        </div>

        {/* AVG RATING CHIP */}
        <div
          className="flex justify-center items-center mt-2 py-1 px-3 rounded-full"
          style={{
            backgroundColor: "#F7E89D",
            width: "auto",
            maxWidth: "fit-content",
            padding: "0.5rem 1rem",
          }}
        >
          <FaStar
            className="text-dark-yellow mr-2"
            style={{ color: "#E5B800" }}
          />
          <span className="text-sm text-[#333333]" style={{ color: "#E5B800" }}>
            {averageRating}
          </span>
        </div>

        {/* PRODUCT TYPE CHIP */}
        <p
          className="mt-1 text-xs py-1 px-3 rounded-full flex justify-center items-center"
          style={{
            backgroundColor: "#BFDBFE",
            color: "#3B82F6",
            fontSize: "0.85rem",
            maxWidth: "fit-content",
            padding: "0.5rem 1rem",
          }}
        >
          {product?.product_type}
        </p>
      </div>

      {/* POP-UP MODAL */}
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 rounded-2xl"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-[3rem] mx-[5rem] sm:w-[400px] relative border-2 border-[#D1C7B7] z-60 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#333333] mb-4">
              PRODUCT DETAILS
            </h3>
            {/* Product Details */}
            <p className="text-sm sm:text-md text-[#333333]">
              {product?.product_name}
            </p>

            {/* AVG RATING CHIP */}
            <div
              className="flex justify-center items-center mt-2 py-1 px-3 rounded-full"
              style={{
                backgroundColor: "#F7E89D",
                width: "auto",
                fontSize: "0.9rem",
                maxWidth: "fit-content",
                padding: "0.5rem 1rem",
              }}
            >
              <FaStar
                className="text-dark-yellow mr-2"
                style={{ color: "#E5B800" }}
              />
              <span
                className="text-sm text-[#333333]"
                style={{ color: "#E5B800" }}
              >
                {averageRating}
              </span>
            </div>

            {/* PRODUCT TYPE CHIP */}
            <p
              className="mt-1 text-xs py-1 px-3 rounded-full flex justify-center items-center"
              style={{
                backgroundColor: "#BFDBFE",
                color: "#3B82F6",
                fontSize: "0.85rem",
                maxWidth: "fit-content",
                padding: "0.5rem 1rem",
              }}
            >
              {product?.product_type}
            </p>
            <p className="text-sm sm:text-md text-[#333333]">
              ${Number(product?.price).toFixed(2)}
            </p>

            {/* ACCORDION FOR INGREDIENTS ONLY */}
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Ingredients</AccordionTrigger>
                <AccordionContent>{product?.clean_ingreds}</AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* CUSTOMER REVIEWS */}
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="customer-reviews">
                <AccordionTrigger>Customer Reviews</AccordionTrigger>
                <AccordionContent>
                  <div className="mb-4">
                    {reviews.map((review, index) => (
                      <div
                        key={index}
                        className="mb-2 p-2 border-b border-gray-200"
                      >
                        <div className="flex items-center">
                          <FaStar style={{ color: "#E5B800" }} />
                          <span className="ml-2 text-sm">{review.rating}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className="bg-[#F7E89D] text-[#333333] font-semibold py-2 px-4 rounded-md"
              >
                {isReviewFormOpen ? "Cancel" : "Leave a Review"}
              </button>
              {isReviewFormOpen && (
                <ReviewForm
                  reviewData={reviewData}
                  setReviewData={setReviewData}
                  handleReviewSubmit={handleReviewSubmit}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
