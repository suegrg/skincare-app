const Header = ({ onLogout }) => {
  return (
    <header className="bg-teal-500 text-black py-10 px-4 w-full text-center relative flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-black">
        clean. skin. clean skin. care.
      </h1>
      <p className="mt-2 text-lg text-black max-w-full break-words">
        Find the best clean skincare products and customer reviews.
      </p>
      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
