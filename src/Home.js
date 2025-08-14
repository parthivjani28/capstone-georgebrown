import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Crypto Payment Hub</h1>
      <nav>
        <ul>
          <li><Link to="/customer">Customer Portal</Link></li>
          <li><Link to="/hub">Hub Portal</Link></li>
          <li><Link to="/merchant">Merchant Portal</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
