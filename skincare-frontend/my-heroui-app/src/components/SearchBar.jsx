import React, { useState } from "react";
import { Button } from "@heroui/react";

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
        className="flex items-center space-x-4 w-full max-w-3xl"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="p-4 w-full border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <Button
          type="submit"
          className="bg-teal-500 text-black py-4 px-8 rounded-lg text-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
