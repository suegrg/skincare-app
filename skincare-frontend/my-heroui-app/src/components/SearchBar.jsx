import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    console.log("Search submitted with query:", trimmedQuery);
    onSearch(trimmedQuery);
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-4 w-full max-w-lg"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="p-4 w-full border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          className="bg-teal-500 text-white py-4 px-6 rounded-lg text-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
