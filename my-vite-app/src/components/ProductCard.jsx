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
        className="product-card bg-white rounded-2xl shadow-md p-4 cursor-pointer transition-transform transform hover:translate-y-[-5px] hover:shadow-lg border-2 border-[#D1C7B7] hover:border-[#B8A894] w-full sm:w-[220px] sm:min-h-[180px] flex flex-col justify-between text-center mb-4"
        onClick={toggleModal}
      >
        <h3 className="text-sm sm:text-md font-bold text-[#333333]">
          {product.product_name}
        </h3>

        <div className="flex justify-center mt-2">
          <Chip size="sm" className="text-[#333333] px-3 py-1 rounded-full">
            {product.product_type}
          </Chip>
        </div>

        <p className="mt-3 text-sm font-semibold text-[#333333]">
          ${product.price}
        </p>
      </div>

      {/* POP UP MODAL */}
      {isModalOpen && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={handleOutsideClick}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full sm:w-96 relative border-2 border-[#D1C7B7] z-60"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-[#333333]">
              PRODUCT DETAILS
            </h3>

            <div className="mt-4 space-y-3 text-left">
              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">
                  PRODUCT NAME:{" "}
                </span>
                {product.product_name}
              </p>

              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">PRODUCT TYPE: </span>
                {product.product_type}
              </p>

              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">
                  INGREDIENTS:{" "}
                </span>
                {product.clean_ingreds}
              </p>

              <p className="text-gray-700 text-sm">
                <span className="font-semibold text-[#333333]">PRICE: </span>$
                {product.price}
              </p>
            </div>

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
