import React, { useState } from "react";
import axios from "axios";

export default function ReviewForm({ productId, onReviewSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5.");
      return;
    }

    const review = { rating, comment };

    try {
      const response = await axios.post(
        `http://localhost:5000/products/${productId}/reviews`,
        review
      );

      console.log("Review submitted:", response.data);
      setSuccess("Review submitted successfully!");
      setError("");
      setRating(0);
      setComment("");

      if (onReviewSubmit) onReviewSubmit();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review.");
    }
  };

  return (
    <div className="bg-white border border-gray-300 shadow-lg rounded-xl p-6 w-full max-w-lg mx-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Leave a Review
      </h3>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
        {/* Rating Selection */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Rating:</span>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              className={`w-9 h-9 flex items-center justify-center rounded-full transition font-semibold ${
                rating === num
                  ? "bg-teal-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-teal-100"
              }`}
              onClick={() => setRating(num)}
            >
              {num}
            </button>
          ))}
        </div>

        {/* REVIEW COMMENTS */}
        <div className="relative">
          <textarea
            className="w-full h-28 p-3 rounded-xl border border-gray-300 bg-white shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all"
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <span className="absolute top-2 right-3 text-gray-400 text-sm">
            {comment.length}/500
          </span>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-2 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
