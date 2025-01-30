import { useParams, useNavigate } from "react-router-dom";

export default function ProductOpen({ product, onClose }) {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleBack = () => {
    navigate("/");
  };

  const cleanIngredsList = JSON.parse(product.clean_ingreds || "[]");

  return (
    <div className="p-6">
      <button onClick={handleBack} className="text-blue-500">
        Back to Products
      </button>
      <div className="mt-4">
        <h2 className="text-2xl font-bold">{product.product_name}</h2>
        <div className="mt-4">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.product_name}
            className="object-contain w-full h-80"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">
            Price: {product.price || "N/A"}
          </h3>
          <p className="text-sm text-gray-500">{product.product_type}</p>

          <div className="mt-4">
            <h4 className="font-semibold">Ingredients:</h4>
            <ul className="list-disc pl-5">
              {cleanIngredsList.map((ingredient, index) => (
                <li key={index} className="text-sm">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <a
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              View product on LookFantastic
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
