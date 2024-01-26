import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { setCartData } from "../store/reducers/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import formatDate from "date-fns/format";
import { cloneDeep } from "lodash";

function ProductsPage() {
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const cartDetails = useSelector((state) => state.cart.cartDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        return axios.get(
          `https://fakestoreapi.com/products/category/${response.data.category}`,
        );
      })
      .then((response) => {
        const filteredProducts = response.data
          .filter((p) => p.id !== parseInt(id))
          .slice(0, 6);
        const existingProduct = cartDetails.products.find(
          (p) => p.productId === parseInt(id),
        );
        if (existingProduct) {
          setQuantity(existingProduct.quantity);
        }
        setSimilarProducts(filteredProducts);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id, cartDetails.products]);

  const handleSimilarProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const addToCart = async () => {
    if (!user?.sub) {
      alert("Login to add to cart!");
      return;
    }

    try {
      const updatedProducts = cloneDeep(cartDetails.products);
      const productIndex = updatedProducts.findIndex(
        (p) => p.productId === parseInt(id),
      );

      if (productIndex >= 0) {
        // Update quantity if product exists
        updatedProducts[productIndex].quantity = parseInt(quantity);
      } else {
        // Add new product to cart
        updatedProducts.push({
          productId: parseInt(id),
          quantity: parseInt(quantity),
        });
      }

      const updatedCart = {
        userId: user.sub,
        date: formatDate(new Date(), "yyyy-MM-dd"),
        products: updatedProducts.filter((val) => val.quantity > 0), //Filter products by quantity , no need to save product with 0 quantity
      };

      const response = await axios.put(
        `https://fakestoreapi.com/carts/${cartDetails.id}`,
        updatedCart,
      ); // Replace 7 with actual cart ID

      dispatch(setCartData(response.data));
      console.log(response.data);
      alert("Cart updated");
    } catch (error) {
      console.error("Error updating cart:", error);
      alert("Failed to update cart");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex mb-14">
        <div
          className="flex-none"
          style={{ maxWidth: "400px", maxHeight: "500px" }}
        >
          <img
            src={product.image}
            alt={product.title}
            className="object-contain h-full w-full"
          />
        </div>
        <div className="flex-grow ml-2 text-left">
          {" "}
          {/* Ensure text is left-aligned */}
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mt-2">
            <p className="text-lg">
              <strong>Price:</strong> INR {product.price}
            </p>
            <p className="text-lg">
              <strong>Category:</strong> {product.category}
            </p>
          </div>
          <p className="mt-4 text-sm">{product.description}</p>{" "}
          {/* Smaller font for description */}
          <div className="flex items-center mt-4">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              style={{ width: "50px" }}
              min="0"
            />
            <button
              onClick={addToCart}
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      {/* Similar Products Section */}
      <div className="text-left">
        {" "}
        {/* Text aligned to the left */}
        <h2 className="text-2xl font-bold mb-4">Similar Products</h2>
        <div className="grid grid-cols-5 gap-4">
          {similarProducts.map((similarProduct) => (
            <div
              key={similarProduct.id}
              className="cursor-pointer rounded overflow-hidden shadow-lg"
              onClick={() => handleSimilarProductClick(similarProduct.id)}
            >
              <img
                src={similarProduct.image}
                alt={similarProduct.title}
                className="object-contain h-48 w-full"
                style={{ maxWidth: "200px" }}
              />
              <div className="p-4">
                <p className="text-center font-bold">{similarProduct.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
