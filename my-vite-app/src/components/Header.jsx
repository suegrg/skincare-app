import React from "react";

const Header = ({ onLogout }) => {
  return (
    <>
      <div className="flex justify-end p-4">
        <button
          onClick={onLogout}
          className="py-4 px-8 border border-[#D1C7B7] text-[#333333] rounded-lg text-lg hover:bg-[#F7F7F7] hover:text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D1C7B7] focus:ring-offset-2 transition duration-200"
        >
          Logout
        </button>
      </div>

      <header className="bg-teal-500 text-black py-6 px-4 w-full text-center pt-16">
        <div className="max-w-7xl mx-auto">
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
