import React from "react";
import ProductCard from "./ProductCard";
import "./ProductList.css";

const products = [
  {
    id: 1,
    name: "Smartphone",
    price: 299.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Laptop",
    price: 899.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "Headphones",
    price: 79.99,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "Smartwatch",
    price: 199.99,
    image: "https://via.placeholder.com/150",
  },
];

function ProductList() {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
