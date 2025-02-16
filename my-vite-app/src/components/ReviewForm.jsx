import React from "react";

export default function ReviewForm({
  onReviewSubmit,
  onClose,
  setReviewData,
  reviewData,
}) {
  const handleSubmit = () => {
    const comment = (reviewData.review || "").trim();
    const rating = parseInt(reviewData.rating, 10);
    setReviewData({ ...reviewData, review: comment, rating: rating });
    onReviewSubmit({ ...reviewData, review: comment, rating: rating });
  };

  return (
    <div className="max-w-sm w-full bg-[#F9F9F9] rounded-2xl p-6 shadow-lg border-2 border-[#D1C7B7] space-y-4 text-left">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Write a Review
      </h3>
      <textarea
        value={reviewData.review}
        onChange={(e) =>
          setReviewData({ ...reviewData, review: e.target.value })
        }
        placeholder="Share your thoughts..."
        className="w-full p-4 border-2 border-[#D1C7B7] rounded-xl bg-white text-black focus:ring-2 focus:ring-[#B8A894] focus:outline-none resize-none text-base shadow-sm"
        style={{ color: "black", backgroundColor: "white" }}
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
          className="p-3 border-2 border-[#D1C7B7] rounded-xl bg-white text-black focus:ring-2 focus:ring-[#B8A894] focus:outline-none text-lg font-semibold shadow-sm"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="border-2 border-[#D1C7B7] text-gray-700 font-medium py-2 px-6 rounded-xl hover:bg-[#F0F0F0] transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="border-2 border-[#D1C7B7] bg-[#B8A894] text-white font-medium py-2 px-6 rounded-xl hover:bg-[#A88F7A] transition duration-200"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
