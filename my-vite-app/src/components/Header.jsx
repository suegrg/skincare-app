const Header = ({ onLogout }) => {
  return (
    <>
      {/* Logout Button Positioned Above Header */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-sm"
        >
          Logout
        </button>
      </div>

      <header className="bg-teal-500 text-black py-6 px-4 w-full text-center pt-16">
        <div className="max-w-7xl mx-auto">
          {/* Centered Content */}
          <h1 className="text-4xl font-bold text-black">
            clean. skin. clean skin. care.
          </h1>
          <p className="mt-2 text-lg text-black">
            Find the best clean skincare products and customer reviews.
          </p>
        </div>
      </header>
    </>
  );
};

export default Header;
