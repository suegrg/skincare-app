const Pagination = ({ page, totalPages, onPrev, onNext }) => {
  return (
    <section className="mt-6 flex justify-center items-center space-x-2">
      <button
        onClick={onPrev}
        disabled={page === 1}
        className="bg-gray-300 text-black px-4 py-2 rounded-lg"
      >
        Prev
      </button>
      <span className="bg-white text-black px-4 py-2 border rounded-lg">
        {page}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        className="bg-gray-300 text-black px-4 py-2 rounded-lg"
      >
        Next
      </button>
    </section>
  );
};

export default Pagination;
