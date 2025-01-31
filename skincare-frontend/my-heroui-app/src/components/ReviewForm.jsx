import React, { useState } from "react";

const ReviewForm = () => {
  const [username, setUsername] = useState(""); 
  const [rating, setRating] = useState(""); 
  const [comment, setComment] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault(); 

    alert("Thank you for your review!");

    setUsername("");
    setRating("");
    setComment("");
  };

  return (
    <form
      id="reviewForm"
      className="p-4 border rounded-lg shadow-md max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-semibold mb-4">Submit Your Review</h2>

      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="w-full p-2 border rounded-lg"
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rating" className="block text-sm font-medium mb-1">
          Rating
        </label>
        <select
          id="rating"
          className="w-full p-2 border rounded-lg"
          value={rating} 
          onChange={(e) => setRating(e.target.value)} 
          required
        >
          <option value="">Select a rating</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Good</option>
          <option value="3">3 - Average</option>
          <option value="2">2 - Poor</option>
          <option value="1">1 - Terrible</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium mb-1">
          Comment
        </label>
        <textarea
          id="comment"
          className="w-full p-2 border rounded-lg"
          rows="4"
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-teal-500 text-black px-4 py-2 rounded-lg hover:bg-teal-600"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
