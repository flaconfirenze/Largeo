import React, { useState } from 'react';
import api from '../api';

const CheckBill = () => {
  const [nd, setNd] = useState('');
  const [billInfo, setBillInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBillInfo(null);
    try {
      const response = await api.post('/api/check-nd-fact', { nd });
      if (response.data && response.data.INFO) {
        setBillInfo(response.data);
      } else {
        setError(response.data.message || 'لم يتم العثور على معلومات الفاتورة.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ أثناء التحقق من الفاتورة.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🧾 تحقق من الفواتير</h2>
      <form onSubmit={handleCheckBill}>
        <input
          type="text"
          value={nd}
          onChange={(e) => setNd(e.target.value)}
          placeholder="أدخل رقم الهاتف"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري التحقق...' : 'تحقق'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {billInfo && (
        <div>
          <h3>📊 معلومات الرقم</h3>
          <p><strong>📱 الرقم:</strong> <code>{billInfo.INFO.nd}</code></p>
          <p><strong>💰 الرصيد:</strong> <code>{billInfo.INFO.credit} DA</code></p>
        </div>
      )}
    </div>
  );
};

export default CheckBill;
