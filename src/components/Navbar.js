import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">eCommerce PWA</h1>
      <button className="cart-btn">Cart (0)</button>
    </nav>
  );
}

export default Navbar;
