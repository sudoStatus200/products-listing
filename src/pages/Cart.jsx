import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CartPage() {
  const [productDetails, setProductDetails] = useState([]);
  const cart = useSelector((state) => state.cart.cartDetails);
  const navigate = useNavigate();

  useEffect(() => {
    if (cart.products.length > 0) {
      const fetchProductDetails = async () => {
        try {
          const productRequests = cart.products.map((product) =>
            axios.get(`https://fakestoreapi.com/products/${product.productId}`),
          );

          const productResponses = await Promise.all(productRequests);
          const products = productResponses.map((response) => response.data);
          setProductDetails(products);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProductDetails();
    }
  }, [cart]);

  if (productDetails.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Cart Details</h1>

        <h4>Cart is Empty, Time to shopping</h4>
      </div>
    );
  }

  const goToProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart Details</h1>

      {productDetails.map((product, index) => (
        <div
          key={product.id}
          className="flex mb-4 cursor-pointer items-center"
          onClick={() => goToProduct(product.id)}
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-48 h-48 object-contain mr-4"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
          <div>
            <h2 className="text-xl font-bold">{product.title}</h2>
            <p>Quantity: {cart.products[index].quantity}</p>
            <p>
              Total Price: INR {product.price * cart.products[index].quantity}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartPage;
