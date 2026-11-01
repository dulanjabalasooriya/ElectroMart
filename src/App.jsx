import {
  BrowserRouter,
  Routes,
  Route
}
from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TrackOrder from "./components/TrackOrder";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Checkout from "./pages/Checkout";


import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/cart" element={<Cart />} />
<Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />  


      </Routes>
    </BrowserRouter>
  );
}

export default App;
