import React, { useState } from "react";
import { Chip } from "@heroui/react";

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* PRODUCT CARD */}
      <div
        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl border-2 border-[#D1C7B7] hover:border-[#D1C7B7]"
        onClick={toggleModal}
      >
        <h3 className="text-lg font-bold text-[#333333] text-center">
          {product.product_name}
        </h3>

        <div className="flex justify-center mt-2">
          <Chip size="sm" className="text-[#333333] px-3 py-1 rounded-full">
            {product.product_type}
          </Chip>
        </div>

        <p className="mt-3 text-md font-semibold text-[#333333] text-center">
          ${product.price}
        </p>
      </div>

      {/* POPUP */}
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={handleOutsideClick} 
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-8 w-96 relative border-2 border-[#D1C7B7] z-60"
            onClick={(e) => e.stopPropagation()} 
          >

            <h3 className="text-xl font-bold text-[#333333] mt-12">
              {product.product_name}
            </h3>
            <p className="text-gray-600 text-sm mt-3">
              {product.clean_ingreds}
            </p>
            <p className="mt-4 text-lg font-semibold text-[#333333]">
              ${product.price}
            </p>

            {/* REVIEW BUTTON */}
            <button
              className="mt-5 border-2 border-[#D1C7B7] text-[#333333] font-semibold py-2 px-4 rounded-lg hover:bg-[#F7F7F7] transition-all w-full"
              onClick={() => alert("Open Review Form")} 
            >
              Write Review
            </button>
          </div>
        </div>
      )}
    </>
  );
}
