// src/components/ProductCard.js
export default function ProductCard({ product, onClick }) {
  return (
    <div
      className="productCard bg-white border rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onClick(product)}
    >
      <h3 className="text-lg font-semibold text-teal-500">
        {product.product_name}
      </h3>
      <p className="text-gray-700 text-sm">{product.product_type}</p>
      <p className="text-gray-500 text-sm">{product.clean_ingreds}</p>
    </div>
  );
}
