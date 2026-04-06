import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';
import './index.css';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (id) => {
    const freshCart = [...cart];
    const index = freshCart.findIndex(item => item.id === id);
    if (index !== -1) {
      freshCart.splice(index, 1);
      setCart(freshCart);
    }
  };

  return (
    <BrowserRouter>
      <div className="font-poppins bg-[#FDF2F5] min-h-screen text-gray-800">
        <Navbar cartCount={cart.length} />
        <main className="min-h-[calc(100vh-80px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
            <Route path="/category/:name" element={<Category />} />
            <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="bg-white py-12 px-6 text-center border-t border-pink-100 mt-auto">
          <p className="text-2xl font-bold text-pink-500 mb-4">Glamourly</p>
          <p className="text-gray-400">© 2026 Glamourly Beauté. Tous droits réservés.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
