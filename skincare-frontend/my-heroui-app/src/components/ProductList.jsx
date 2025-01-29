 import React from "react";
 import ProductCard from "./ProductCard"; 

 export default function ProductList({ products, onProductClick }) {
   return (
     <section className="mt-8 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
       {products.length === 0 ? (
         <p>No products available.</p>
       ) : (
         products.map((product) => (
           <ProductCard
             key={product.product_name}
             product={product}
             onClick={() => onProductClick(product)} 
           />
         ))
       )}
     </section>
   );
 }
