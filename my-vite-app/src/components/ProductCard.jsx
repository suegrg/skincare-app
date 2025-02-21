import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(+e.target.value)}
        min="1"
        max="5"
        className="border p-1"
      />
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="border p-1 w-full mt-2"
        placeholder="Write your review..."
      />
      <button type="submit" className="bg-gray-600 text-white px-4 py-2 mt-2">
        Submit Review
      </button>
    </form>
  );
};

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.id) fetchReviews(product.id, setReviews, setLoading);
  }, [product?.id]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const averageRating = reviews.length
    ? Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 0;

  if (!product?.product_name || !product?.price) {
    return (
      <div className="product-card bg-white rounded-2xl shadow-md p-4 cursor-pointer w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg flex flex-col justify-between text-center mb-4">
        <p>Product data is unavailable.</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="product-card bg-white rounded-2xl shadow-md p-4 cursor-pointer hover:translate-y-[-5px] hover:shadow-lg border-2 border-[#D1C7B7] hover:border-[#B8A894] w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg flex flex-col justify-between text-center mb-4"
        onClick={toggleModal}
      >
        <h3 className="text-sm sm:text-md font-bold text-[#333333] text-left">
          {product?.product_name}
        </h3>
        {/* Average Rating Chip */}
        <div className="flex justify-center items-center mt-2 py-1 px-3 rounded-full bg-gray-100 border border-gray-300">
          <FaStar className="text-gray-500 mr-2" />
          <span className="text-sm text-[#333333]">{averageRating}</span>
        </div>
        {/* Product Type Chip */}
        <p className="mt-1 text-xs py-1 px-3 rounded-full flex justify-center items-center bg-gray-100 border border-gray-300 text-gray-700">
          {product?.product_type}
        </p>
      </div>
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-[3rem] mx-[5rem] sm:w-[400px] relative border-2 border-[#D1C7B7] z-60 overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#333333] mb-4">
              PRODUCT DETAILS
            </h3>
            <p className="text-sm sm:text-md text-[#333333]">
              {product?.product_name}
            </p>
            {/* Average Rating Chip */}
            <div className="flex justify-center items-center mt-2 py-1 px-3 rounded-full bg-gray-100 border border-gray-300">
              <FaStar className="text-gray-500 mr-2" />
              <span className="text-sm text-[#333333]">{averageRating}</span>
            </div>
            {/* Product Type Chip */}
            <p className="mt-1 text-xs py-1 px-3 rounded-full flex justify-center items-center bg-gray-100 border border-gray-300 text-gray-700">
              {product?.product_type}
            </p>
            <p className="mt-1 text-xs py-1 px-3 rounded-full flex justify-center items-center bg-gray-100 border border-gray-300 text-gray-700">
              ${Number(product?.price).toFixed(2)}
            </p>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="ingredients">
                <AccordionTrigger>Ingredients</AccordionTrigger>
                <AccordionContent>{product?.clean_ingreds}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="customer-reviews">
                <AccordionTrigger>Customer Reviews</AccordionTrigger>
                <AccordionContent>
                  {isLoading ? (
                    <p>Loading reviews...</p>
                  ) : (
                    reviews.map((review, index) => (
                      <div
                        key={index}
                        className="mb-2 p-2 border-b border-gray-200"
                      >
                        <FaStar className="text-gray-500" />
                        <span className="ml-2 text-sm">{review.rating}</span>
                        <p className="text-xs text-gray-600 mt-2">
                          {review.comment}
                        </p>
                      </div>
                    ))
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="leave-review">
                <AccordionTrigger>Leave a Review</AccordionTrigger>
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
