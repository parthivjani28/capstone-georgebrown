import React, { useState } from 'react';
import axios from 'axios';

function Hub() {
  const [amountUSD, setAmountUSD] = useState(null);
  const [payments, setPayments] = useState([]);

  React.useEffect(() => {
    axios.get('/api/hub/amount').then(res => setAmountUSD(res.data.amountUSD));
    const interval = setInterval(() => {
      axios.get('/api/hub/payments').then(res => setPayments(res.data.payments));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
  <div style={{ padding: 40, maxWidth: 520, margin: '60px auto 0 auto', border: '1px solid #ccc', borderRadius: 12, background: '#fafcff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'auto', maxHeight: '80vh' }}>
      <h2 style={{ textAlign: 'center' }}>POS - Hub</h2>
      <div style={{ margin: '30px 0', textAlign: 'center', fontSize: 22 }}>
        {amountUSD ? (
          <span>Amount to Pay: <strong>${amountUSD}</strong></span>
        ) : (
          <span>No amount set by merchant.</span>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <span style={{ fontSize: 22, color: '#1976d2', fontWeight: 'bold', letterSpacing: 1, marginBottom: 18, display: 'block' }}>Live Payment Status</span>
        {payments.length > 0 ? (
          <table style={{ margin: '30px auto', width: '98%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#e3f2fd', color: '#1976d2', fontSize: 18 }}>
                <th style={{ padding: '14px 10px', borderBottom: '2px solid #bbdefb' }}>Description</th>
                <th style={{ padding: '14px 10px', borderBottom: '2px solid #bbdefb' }}>Wallet</th>
                <th style={{ padding: '14px 10px', borderBottom: '2px solid #bbdefb' }}>USD Amount</th>
                <th style={{ padding: '14px 10px', borderBottom: '2px solid #bbdefb' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f1f8e9', fontSize: 17 }}>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0' }}>{p.description || <span style={{ color: '#bbb' }}>N/A</span>}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0', fontFamily: 'monospace', fontSize: 15 }}>{p.walletAddress || <span style={{ color: '#bbb' }}>N/A</span>}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0', color: '#2e7d32', fontWeight: 'bold' }}>${(p.usdPayout !== undefined ? Number(p.usdPayout) : 0).toFixed(2)}</td>
                  <td style={{ padding: '12px 10px', borderBottom: '1px solid #e0e0e0' }}><span style={{ background: '#e0f7fa', color: '#00796b', padding: '6px 16px', borderRadius: 14, fontWeight: 500, fontSize: 16 }}>Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ marginTop: 28, color: '#888', fontSize: 20 }}>No payments yet.</div>
        )}
      </div>
    </div>
  );
}

export default Hub;
