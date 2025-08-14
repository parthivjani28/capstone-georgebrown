import React, { useState } from 'react';
import axios from 'axios';

function Customer() {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [amountUSD, setAmountUSD] = useState(null);
  const [btcRate, setBtcRate] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  React.useEffect(() => {
    axios.get('/api/customer/amount').then(res => setAmountUSD(res.data.amountUSD));
    axios.get('/api/rate').then(res => setBtcRate(res.data.rate));
  }, []);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setPaymentStatus('');
  };

  const handlePay = async () => {
    if (!selectedMethod) {
      setPaymentStatus('Please select a payment method.');
      return;
    }
    if (!amountUSD || isNaN(amountUSD) || Number(amountUSD) <= 0) {
      setPaymentStatus('Invalid or missing amount.');
      return;
    }
    if (!btcRate || isNaN(btcRate) || Number(btcRate) <= 0) {
      setPaymentStatus('Invalid or missing BTC rate.');
      return;
    }
    setPaymentStatus('Processing...');
    if (selectedMethod === 'crypto') {
      try {
        const res = await axios.post('/api/customer/send', {
          description,
          btcRate,
        });
        setPaymentStatus(res.data.message ? 'Crypto payment successful!' : 'Crypto payment failed.');
      } catch (err) {
        setPaymentStatus('Crypto payment failed.');
      }
    } else {
      setTimeout(() => {
        setPaymentStatus(selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1) + ' payment successful!');
      }, 1500);
    }
  };

  return (
  <div style={{ padding: 40, maxWidth: 420, margin: '60px auto 0 auto', border: '1px solid #e0e0e0', borderRadius: 12, background: '#fafcff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 30 }}>POS - Customer</h2>
      <div style={{ margin: '24px 0', textAlign: 'center', fontSize: 22 }}>
        {amountUSD ? (
          <span>Amount to Pay: <strong style={{ color: '#2e7d32' }}>${amountUSD}</strong></span>
        ) : (
          <span style={{ color: '#bbb' }}>Loading amount...</span>
        )}
      </div>
      <div style={{ margin: '24px 0', textAlign: 'center', fontSize: 22 }}>
        {btcRate ? (
          <span>BTC Rate: <strong style={{ color: '#1976d2' }}>${btcRate}</strong></span>
        ) : (
          <span style={{ color: '#bbb' }}>Loading BTC rate...</span>
        )}
      </div>
      <div style={{ margin: '24px 0', textAlign: 'center', fontSize: 20 }}>
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ fontSize: 20, padding: 10, width: '80%', borderRadius: 8, border: '1px solid #bdbdbd', background: '#fff' }}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <button style={{ fontSize: 18, padding: '12px 36px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }} onClick={handlePay}>Pay</button>
      </div>
      <div style={{ marginTop: 36, textAlign: 'center', fontSize: 22 }}>
        {paymentStatus && <span style={{ color: paymentStatus.includes('success') ? '#2e7d32' : '#d32f2f', fontWeight: 500 }}>{paymentStatus}</span>}
      </div>
    </div>
  );
}

export default Customer;
