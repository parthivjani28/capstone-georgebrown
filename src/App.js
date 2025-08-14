
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Customer from './Customer';
import Hub from './Hub';
import Merchant from './Merchant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/hub" element={<Hub />} />
        <Route path="/merchant" element={<Merchant />} />
      </Routes>
    </Router>
  );
}

export default App;
