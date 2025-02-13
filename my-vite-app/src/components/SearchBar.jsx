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
    <div className="flex justify-center items-center mt-10 w-full px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 w-full max-w-lg"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="p-4 w-full border border-[#D1C7B7] text-[#333333] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2"
        />
        <button
          type="submit"
          className="w-full py-4 px-8 border border-[#D1C7B7] text-[#333333] rounded-lg text-lg hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
