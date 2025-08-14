import React, { useState } from 'react';
import axios from 'axios';

function Merchant() {
  const [amountUSD, setAmountUSD] = useState('');
  const [latestTx, setLatestTx] = useState(null);
  const [totalReceived, setTotalReceived] = useState(0);

  const handleSetAmount = async () => {
    await axios.post('/api/merchant/set-amount', { amountUSD: Number(amountUSD) });
    alert('Amount set for customer!');
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      axios.get('/api/merchant/received').then(res => {
        const received = res.data.received;
        setTotalReceived(received.reduce((sum, r) => sum + r.usdPayout, 0));
        setLatestTx(received.length > 0 ? received[received.length - 1] : null);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div style={{ padding: 40, maxWidth: 420, margin: '60px auto 0 auto', border: '1px solid #e0e0e0', borderRadius: 12, background: '#f8fafd', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 30 }}>POS - Merchant</h2>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <input
          type="number"
          placeholder="Enter Amount (USD)"
          value={amountUSD}
          onChange={e => setAmountUSD(e.target.value)}
          style={{ fontSize: 20, padding: 10, width: '80%', borderRadius: 8, border: '1px solid #bdbdbd', background: '#fff' }}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button style={{ fontSize: 18, padding: '12px 36px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }} onClick={handleSetAmount}>Charge</button>
      </div>
      <div style={{ marginTop: 36, textAlign: 'center', fontSize: 22 }}>
        <span>Total Amount Received: <strong style={{ color: '#2e7d32' }}>${totalReceived.toFixed(2)}</strong></span>
      </div>
      {latestTx && (
        <div style={{ marginTop: 30, padding: 24, border: '1px solid #e0e0e0', borderRadius: 10, background: '#f5faff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ color: '#1976d2', marginBottom: 18 }}>Latest Transaction</h3>
          <div>Description: <strong>{latestTx.description || 'N/A'}</strong></div>
          <div>Wallet: <strong style={{ fontFamily: 'monospace', fontSize: 15 }}>{latestTx.walletAddress || 'N/A'}</strong></div>
          <div>USD Payout: <strong style={{ color: '#2e7d32' }}>${(latestTx.usdPayout !== undefined ? Number(latestTx.usdPayout) : 0).toFixed(2)}</strong></div>
          <div>Fee: <strong style={{ color: '#d32f2f' }}>${(latestTx.fee !== undefined ? Number(latestTx.fee) : 0).toFixed(2)}</strong></div>
        </div>
      )}
    </div>
  );
}

export default Merchant;
