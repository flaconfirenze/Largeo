import React, { useState } from 'react';
import axios from 'axios';

const RechargePage = () => {
  const [rechargeType, setRechargeType] = useState('adsl'); // 'adsl' or 'lte'
  const [formData, setFormData] = useState({
    nd: '',
    ncli: '',
    voucher: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const url = rechargeType === 'adsl' ? '/api/use-voucher' : '/api/use-voucher-lte';
    const payload = {
      nd: formData.nd,
      voucher: formData.voucher,
    };
    if (rechargeType === 'adsl') {
      payload.ncli = formData.ncli;
    }

    try {
      const response = await axios.post(url, payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ أثناء عملية الشحن.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRechargeTypeChange = (type) => {
    setRechargeType(type);
    setFormData({ nd: '', ncli: '', voucher: '' });
    setError('');
    setResult(null);
  }

  return (
    <div>
      <h2>💳 شحن الرصيد عبر القسيمة</h2>
      <div className="tab-buttons">
        <button onClick={() => handleRechargeTypeChange('adsl')} className={rechargeType === 'adsl' ? 'active' : ''}>
          ADSL/Fibre
        </button>
        <button onClick={() => handleRechargeTypeChange('lte')} className={rechargeType === 'lte' ? 'active' : ''}>
          4G LTE
        </button>
      </div>

      <form onSubmit={handleRecharge}>
        <input type="text" name="nd" value={formData.nd} onChange={handleChange} placeholder="رقم الهاتف" required />
        {rechargeType === 'adsl' && (
          <input type="text" name="ncli" value={formData.ncli} onChange={handleChange} placeholder="رقم الزبون (NCLI)" required />
        )}
        <input type="text" name="voucher" value={formData.voucher} onChange={handleChange} placeholder="رمز القسيمة" required />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري الشحن...' : 'شحن'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {result && (
        <div>
          <h3>{result.code === "0" ? "✅ تم شحن الرصيد بنجاح!" : "❌ فشل في شحن الرصيد."}</h3>
          {result.code === "0" ? (
            <ul>
              <li><strong>رقم العملية:</strong> {result.TRANS}</li>
              <li><strong>التاريخ:</strong> {result.date_transaction}</li>
              <li><strong>الوقت:</strong> {result.heure_transaction}</li>
              <li><strong>الخدمة:</strong> {result.service}</li>
            </ul>
          ) : (
            <p>{result.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default RechargePage;
