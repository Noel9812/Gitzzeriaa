import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './component/Landing';
import SignUP from './component/SignUP';
import Login from './component/Login';
import Menu from './component/Menu';
import MyOrder from './component/Myorder';
import Support from './component/Support';
import Profile from './component/Profile';
import Checkout from './component/Checkout';
import Admin from './component/Admin';
import AdminLogin from "./component/AdminLogin"
import Payment from "./component/Payment"
import Queries from './component/Queries';
function App() {
  return (
    <Router>
     
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/myorder" element={<MyOrder />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/adminlogin" element={<AdminLogin/>} />
          <Route path="/payments" element={<Payment/>} />
          <Route path="/queries" element={<Queries/>} />
        </Routes>
      
    </Router>
  );
}

export default App;
