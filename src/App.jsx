import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProductsList from "./pages/ProductsList";
import ProductsPage from "./pages/Product";
import Header from "./components/Header";
import CartPage from "./pages/Cart";
function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<ProductsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
