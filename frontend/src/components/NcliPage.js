import React, { useState } from 'react';
import api from '../api';

const NcliPage = () => {
  const [ncliType, setNcliType] = useState('adsl'); // 'adsl' or 'lte'
  const [nd, setNd] = useState('');
  const [ncliInfo, setNcliInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetNcli = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNcliInfo(null);

    const url = ncliType === 'adsl' ? '/api/retrieve-ncli' : '/api/retrieve-ncli-4glte';

    try {
      const response = await api.post(url, { nd });
      setNcliInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ أثناء البحث عن رقم الزبون.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNcliTypeChange = (type) => {
    setNcliType(type);
    setNd('');
    setError('');
    setNcliInfo(null);
  }

  return (
    <div>
      <h2>🆔 الحصول على رقم الزبون</h2>
      <div className="tab-buttons">
        <button onClick={() => handleNcliTypeChange('adsl')} className={ncliType === 'adsl' ? 'active' : ''}>
          ADSL/Fibre
        </button>
        <button onClick={() => handleNcliTypeChange('lte')} className={ncliType === 'lte' ? 'active' : ''}>
          4G LTE
        </button>
      </div>

      <form onSubmit={handleGetNcli}>
        <input
          type="text"
          value={nd}
          onChange={(e) => setNd(e.target.value)}
          placeholder="أدخل رقم الهاتف"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري البحث...' : 'بحث'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {ncliInfo && (
        <div>
          {String(ncliInfo.succes) === '1' ? (
            <div>
              <h3>✅ تم العثور على رقم الزبون</h3>
              <p><strong>🆔 رقم الزبون:</strong> <code>{ncliInfo.ncli}</code></p>
            </div>
          ) : (
            <div>
              <h3>❌ فشل في العثور على رقم الزبون</h3>
              <p>{ncliInfo.error || ncliInfo.response_text || 'حدث خطأ ما.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NcliPage;
