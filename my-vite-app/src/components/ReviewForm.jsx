import React, { useState } from "react";

export default function ReviewForm({ onReviewSubmit, onClose, setReviewData, reviewData }) {

  const handleSubmit = () => {
    const comment = (reviewData.review || "").trim();
    const rating = parseInt(reviewData.rating, 10);
    setReviewData({ ...reviewData, review: comment, rating: rating });
    onReviewSubmit({ ...reviewData, review: comment, rating: rating }); 
  };

  return (
    <div className="review-form mt-4 space-y-4">
      <textarea
        value={reviewData.review}
        onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
        placeholder="Write your review..."
        className="w-full p-2 border-2 border-[#D1C7B7] rounded-lg"
      />
      <div>
        <label htmlFor="rating" className="mr-2">
          Rating:
        </label>
        <select
          id="rating"
          value={reviewData.rating}
          onChange={(e) => setReviewData({ ...reviewData, rating: e.target.value })}
          className="p-2 border-2 border-[#D1C7B7] rounded-lg"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="border-2 border-[#D1C7B7] text-[#333333] font-semibold py-2 px-4 rounded-lg hover:bg-[#F7F7F7]"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="border-2 border-[#D1C7B7] text-[#333333] font-semibold py-2 px-4 rounded-lg hover:bg-[#F7F7F7]"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
