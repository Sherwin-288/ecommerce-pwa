import React, { useState } from "react";
import "./App.css"; // Import CSS for styling

// Footwear products from the public folder
const products = [
  { id: 1, name: "Running Shoes", price: "$79", image: `${process.env.PUBLIC_URL}/images/running-shoes.jpg` },
  { id: 2, name: "Casual Sneakers", price: "$59", image: `${process.env.PUBLIC_URL}/images/casual-sneakers.jpg` },
  { id: 3, name: "Formal Leather Shoes", price: "$99", image: `${process.env.PUBLIC_URL}/images/formal-shoes.jpg` },
  { id: 4, name: "Sports Sandals", price: "$49", image: `${process.env.PUBLIC_URL}/images/sports-sandals.jpg` },
];

function App() {
  const [cart, setCart] = useState([]);

  // Add to cart function
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="container">
      <h1 className="title">Footwear Store</h1>
      <div className="cart">🛒 Cart: {cart.length} items</div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-img" />
            <h2 className="product-title">{product.name}</h2>
            <p className="product-price">{product.price}</p>
            <button 
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
