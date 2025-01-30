export default function ProductCard({ product, onClick }) {
  return (
    <div
      className="bg-white border border-gray-200 rounded-xl shadow-lg p-5 hover:shadow-2xl transition duration-300 cursor-pointer flex flex-col items-center"
      onClick={() => onClick(product)}
    >
      {/* Product Details */}
      <h3 className="text-lg font-bold text-teal-600 text-center">
        {product.product_name}
      </h3>
      <p className="text-gray-600 text-sm">{product.product_type}</p>
      <p className="text-gray-500 text-xs text-center mt-2">
        {product.clean_ingreds}
      </p>

      {/* Price */}
      <p className="mt-3 text-md font-semibold text-teal-700">
        ${product.price}
      </p>
    </div>
  );
}
