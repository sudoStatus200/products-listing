import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const truncateDescription = (description) => {
    return description.length > 50
      ? description.substring(0, 50) + "..."
      : description;
  };

  const truncateTitle = (title) => {
    return title.length > 20 ? title.substring(0, 20) + "..." : title;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex cursor-pointer  flex-col justify-between max-w-sm rounded overflow-hidden shadow-lg h-full"
            onClick={() => handleProductClick(product.id)}
          >
            <img
              className="w-40 h-40 object-cover mx-auto"
              src={product.image}
              alt={truncateTitle(product.title)}
            />
            <div className="px-6 py-4 flex-grow">
              <div className="font-bold text-xl mb-2">
                {truncateTitle(product.title)}
              </div>
              <p className="text-gray-700 text-base">
                {truncateDescription(product.description)}
              </p>
            </div>
            <div className="px-6 pb-4">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                INR {product.price}
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {product.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsList;
