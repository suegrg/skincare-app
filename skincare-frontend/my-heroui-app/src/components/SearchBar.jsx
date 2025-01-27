import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => setQuery(e.target.value);

  const handleClick = () => {
    onSearch(query); // Pass search query to parent component (App)
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for skincare products..."
        className="search-input"
      />
      <button onClick={handleClick} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
