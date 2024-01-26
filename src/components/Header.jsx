import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Header() {
  const user = useSelector((state) => state.user.userData);
  const isLoggedIn = user && Object.keys(user).length > 0;

  return (
    <div className="bg-orange-500 text-white p-4 sticky top-0 w-full">
      {" "}
      {/* Sticky and full width */}
      <div className="container mx-auto flex justify-between items-center">
        {" "}
        {/* Centered content */}
        <div>
          <Link to="/" className="font-bold">
            Products
          </Link>
        </div>
        <div>
          {!isLoggedIn && (
            <Link to="/login" className="mr-4">
              Login
            </Link>
          )}
          {isLoggedIn && <Link to="/cart">Cart</Link>}
        </div>
      </div>
    </div>
  );
}

export default Header;
