export default function ProductList({ products, onProductClick }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center text-lg text-gray-600 p-6">
        No products found
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="product-item border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
          onClick={() => onProductClick(product)}
        >
          <div className="h-64 bg-gray-200 flex justify-center items-center">
            <img
              alt={product.product_name}
              className="object-contain h-full w-full"
              src={product.image || "https://via.placeholder.com/150"}
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {product.product_name}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{product.product_type}</p>
            <p className="text-lg text-green-600 mb-2">
              {product.price || "Price not available"}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {product.clean_ingreds
                ? product.clean_ingreds.join(", ")
                : "No ingredients listed"}
            </p>
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Product
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
