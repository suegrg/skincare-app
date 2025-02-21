import React, { useState } from "react";

export default function ReviewForm({
  onReviewSubmit,
  onClose,
  setReviewData,
  reviewData,
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const { review, rating } = reviewData;
    if (!review.trim() || !rating) {
      alert("Please provide both a comment and rating.");
      return;
    }

    setLoading(true);
    try {
      await onReviewSubmit({ ...reviewData, review: review.trim() });
      setReviewData({ review: "", rating: "1" });
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting review.");
    } finally {
      setLoading(false);
    }
  };

  const ratingOptions = ["1", "2", "3", "4", "5"];

  return (
    <div className="max-w-sm w-full bg-[#F9F9F9] rounded-2xl p-6 shadow-lg border-2 border-[#D1C7B7] space-y-4 text-left">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Write a Review
      </h3>

      <input
        type="text"
        value={reviewData.review}
        onChange={(e) =>
          setReviewData({ ...reviewData, review: e.target.value })
        }
        placeholder="Share your thoughts..."
        className="w-full p-4 border-2 border-[#D1C7B7] rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-[#B8A894] focus:outline-none text-base shadow-sm"
      />

      <div className="flex items-center space-x-3">
        <label htmlFor="rating" className="text-gray-700 font-medium">
          Rating:
        </label>
        <select
          id="rating"
          value={reviewData.rating}
          onChange={(e) =>
            setReviewData({ ...reviewData, rating: e.target.value })
          }
          className="p-3 border-2 border-[#D1C7B7] rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-[#B8A894] focus:outline-none text-lg font-semibold shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          {ratingOptions.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="border-2 border-[#D1C7B7] text-white font-medium py-2 px-6 rounded-xl hover:bg-[#F0F0F0] transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="border-2 border-[#D1C7B7] bg-[#B8A894] text-white font-medium py-2 px-6 rounded-xl hover:bg-[#A88F7A] transition duration-200"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
