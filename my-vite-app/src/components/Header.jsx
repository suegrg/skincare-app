import React from "react";

const Header = ({ onLogout }) => {
  return (
    <>
      <div className="bg-gray-100 w-full h-12 flex items-center justify-between px-8 border-b border-gray-200">
        <span className="text-[#333333] text-base font-medium">
          Welcome, User!
        </span>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm border border-[#D1C7B7] text-[#333333] rounded-lg hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          Logout
        </button>
      </div>

      <header className="bg-teal-500 text-black py-6 px-4 w-full text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-black">
            clean. skin. clean skin. care.
          </h1>
          <p className="mt-2 text-base text-black">
            Find the best clean skincare products and customer reviews.
          </p>
        </div>
      </header>
    </>
  );
};

export default Header;
