import React, { useState, useEffect } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";

const fetchReviews = async (productId, setReviews, setLoading) => {
  if (!productId) return;

  setLoading(true);
  try {
    const response = await fetch(
      `https://api-xi-black.vercel.app/reviews?productId=${productId}`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    if (data?.reviews && Array.isArray(data.reviews)) setReviews(data.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
  } finally {
    setLoading(false);
  }
};

const submitReview = async (reviewData, productId, setReviews) => {
  try {
    if (
      !productId ||
      !reviewData.review.trim() ||
      reviewData.rating < 1 ||
      reviewData.rating > 5
    ) {
      throw new Error("Provide a valid rating (1-5) and comment.");
    }

    const response = await fetch(
      `https://api-xi-black.vercel.app/reviews/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewData.rating,
          comment: reviewData.review.trim(),
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to submit review.");

    setReviews((prev) => [
      ...prev,
      {
        rating: reviewData.rating,
        comment: reviewData.review.trim(),
        timestamp: Date.now(),
      },
    ]);
    alert("Review submitted successfully!");
  } catch (error) {
    alert(error.message);
  }
};

const ReviewForm = ({ productId, setReviews }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({ rating, review }, productId, setReviews);
    setReview("");
    setRating(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 bg-white shadow-md rounded-lg"
    >
      <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>

      {/* Rating Selection */}
      <div className="flex space-x-2 mb-3">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setRating(num)}
            className={`px-4 py-2 rounded-full border border border-[#D1C7B7] transition duration-200 ${
              rating === num
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-gray-200 hover:bg-gray-300 border-gray-400"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Larger Review Textarea */}
      <Textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full h-36 border border border-[#D1C7B7] p-3 rounded-lg focus:ring-2 focus:ring-gray-500"
        placeholder="Write your review..."
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full mt-4 border border-[#D1C7B7] bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
      >
        Submit Review
      </button>
    </form>
  );
};


export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    if (product?.id) fetchReviews(product.id, setReviews, setLoading);
  }, [product?.id]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const averageRating = reviews.length
    ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 0;

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const paginatedReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!product?.product_name || !product?.price) {
    return (
      <div className="product-card bg-white border border-gray-300 shadow-md p-4 cursor-pointer w-full mb-4 rounded-lg">
        <p>Product data is unavailable.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="product-card bg-white border border-gray-300 shadow-md p-4 cursor-pointer hover:translate-y-[-5px] hover:shadow-lg w-full sm:w-[350px] md:w-[400px] lg:w-[450px] mb-4 rounded-lg"
        onClick={toggleModal}
      >
        <h3 className="text-sm sm:text-md font-bold text-[#333333] text-left">
          {product?.product_name}
        </h3>

        <div className="flex justify-between items-center mt-2 space-x-2">
          <div className="flex-grow py-1 px-3 rounded-full bg-gray-100 border border border-[#D1C7B7] text-center text-sm text-[#333333] mt-1">
            <FaStar className="text-gray-500 mr-2" />
            <span>{averageRating}</span>
          </div>

          <div className="flex-grow text-xs py-1 px-3 rounded-full inline-flex justify-center items-center bg-gray-100 border border-[#D1C7B7] text-center">
            {product?.product_type}
          </div>
        </div>

        <p className="mt-1 text-xs py-1 px-3 rounded-full block justify-center items-center bg-gray-100 border border border-[#D1C7B7] text-gray-700 text-center">
          ${Number(product?.price).toFixed(2)}
        </p>
      </div>

      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white shadow-2xl p-[3rem] mx-[5rem] sm:w-[400px] relative border-2 border-[#D1C7B7] rounded-lg z-60 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#333333] mb-4">
              Product ID: {product?.id}
            </h3>
            <p className="text-sm sm:text-md text-[#333333]">
              {product?.product_name}
            </p>
            <div className="flex justify-between items-center mt-2 space-x-2">
              <div className="flex-grow py-1 px-3 rounded-full bg-gray-100 border border-[#D1C7B7] text-center text-sm text-[#333333] mt-1">
                <FaStar className="text-gray-500 mr-2" />
                <span>{averageRating}</span>
              </div>

              <div className="flex-grow text-xs py-1 px-3 rounded-full inline-flex justify-center items-center bg-gray-100 border border-[#D1C7B7] text-center">
                {product?.product_type}
              </div>
            </div>

            <p className="mt-1 text-xs py-1 px-3 rounded-full block justify-center items-center bg-gray-100 border border border-[#D1C7B7] text-gray-700 text-center">
              ${Number(product?.price).toFixed(2)}
            </p>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="ingredients">
                <AccordionTrigger className="border border-[#D1C7B7]">
                  Ingredients
                </AccordionTrigger>
                <AccordionContent>{product?.clean_ingreds}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="customer-reviews">
                <AccordionTrigger className="border border-[#D1C7B7]">
                  Customer Reviews
                </AccordionTrigger>
                <AccordionContent>
                  {isLoading ? (
                    <p>Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <p>No reviews yet</p>
                  ) : (
                    <>
                      {paginatedReviews.map((review, index) => (
                        <div
                          key={index}
                          className="mb-4 p-4 border border border-[#D1C7B7] rounded-lg shadow-md bg-gray-50 border-gray-300"
                        >
                          <div className="flex items-center mb-2">
                            <FaStar className="text-yellow-500" />
                            <span className="ml-2 text-sm font-semibold">
                              {review.rating}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={handlePrevPage}
                          className="text-gray-500 p-2 hover:text-gray-700 border border-[#D1C7B7]"
                          disabled={currentPage === 1}
                        >
                          <FaChevronLeft />
                        </button>
                        <button
                          onClick={handleNextPage}
                          className="text-gray-500 p-2 hover:text-gray-700 border border-[#D1C7B7]"
                          disabled={currentPage === totalPages}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="leave-review border border-[#D1C7B7]">
                <AccordionTrigger className="border border-[#D1C7B7]">
                  Leave a Review
                </AccordionTrigger>
                <AccordionContent>
                  <ReviewForm productId={product.id} setReviews={setReviews} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </>
  );
}
