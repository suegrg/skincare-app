const ProductPopup = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-1/2 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-semibold text-teal-500">
          {product.product_name}
        </h2>
        <p className="text-lg text-gray-700 mt-2">
          Type: {product.product_type}
        </p>
        <p className="text-lg text-gray-700 mt-2">Price: {product.price}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-teal-500 text-black px-4 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductPopup;
