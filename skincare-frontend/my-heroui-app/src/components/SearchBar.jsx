const SearchBar = ({ onSearch }) => {
  return (
    <section className="mt-8 w-full max-w-3xl text-center">
      <input
        type="text"
        className="p-3 border-2 border-gray-300 rounded-lg w-full mb-4"
        placeholder="Search for skincare products..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </section>
  );
};

export default SearchBar;
