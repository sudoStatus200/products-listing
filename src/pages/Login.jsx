import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../store/reducers/userReducer";
import { setCartData } from "../store/reducers/cartSlice";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

function Login() {
  const user = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user?.user) {
      navigate("/");
    }
  }, [user]);

  const fetchCart = async (userId) => {
    try {
      const response = await axios.get(
        `https://fakestoreapi.com/carts/user/${userId}`,
      );
      const carts = response.data;

      // Check if there are existing carts
      if (carts.length > 0) {
        // Flatten the array of products from all carts
        const allProducts = _.flatMap(carts, (cart) => cart.products);

        // Group products by productId and sum their quantities
        const groupedProducts = _.groupBy(allProducts, "productId");
        const combinedProducts = _.map(
          groupedProducts,
          (products, productId) => {
            return {
              productId: parseInt(productId),
              quantity: _.sumBy(products, "quantity"),
            };
          },
        );

        // Prepare promises for deleting existing carts
        const deletePromises = carts.map((cart) =>
          axios.delete(`https://fakestoreapi.com/carts/${cart.id}`),
        );

        // deleting all existing carts cause i want to maintain only one carts which includes all products , in this way we can have multiple products in one easily
        // Execute all delete operations concurrently
        await Promise.all(deletePromises);

        // Create a new cart with combined products
        // this new cart will be maintained throughout the session
        const newCartResponse = await axios.post(
          "https://fakestoreapi.com/carts",
          {
            userId,
            date: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD format
            products: combinedProducts,
          },
        );

        dispatch(setCartData(newCartResponse.data));
      } else {
        // Create a new cart with empty products array if no previous carts exist
        const newCartResponse = await axios.post(
          "https://fakestoreapi.com/carts",
          {
            userId,
            date: new Date().toISOString().split("T")[0], // current date in YYYY-MM-DD format
            products: [],
          },
        );

        dispatch(setCartData(newCartResponse.data));
      }
    } catch (error) {
      console.error("Error handling cart data:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://fakestoreapi.com/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      // Decode token to get user data
      const decodedUserData = jwtDecode(token);
      await fetchCart(decodedUserData.sub);
      // Dispatch the decoded user data to Redux store
      dispatch(setUserData(decodedUserData));
    } catch (e) {
      console.error(e);
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center mt-14 ">
      <div className="bg-white p-6 rounded shadow-md" style={{ width: 300 }}>
        <h2 className="text-2xl text-center font-bold mb-4">Log In</h2>
        <div className="mb-4">
          <label
            className="block text-left text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-left text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-10">
          <button
            className=" bg-orange-400 hover:bg-orange-500 text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
