import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountInfo = () => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (!token) {
        setLoading(false);
        setError("You are not logged in.");
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('/api/account-info');
        setAccountData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Token is invalid or expired
          logout();
          navigate('/login');
        } else {
          setError('Failed to fetch account information.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [token, logout, navigate]);

  if (loading) return <p>جاري تحميل معلومات الحساب...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!accountData) return <p>لا توجد معلومات لعرضها.</p>;

  return (
    <div>
      <h2>📊 معلومات الحساب</h2>
      <ul className="account-info-list">
        <li><strong>👤 الاسم:</strong> {accountData.prenom} {accountData.nom}</li>
        <li><strong>📱 رقم الهاتف:</strong> {accountData.nd}</li>
        <li><strong>🏠 العنوان:</strong> {accountData.adresse}</li>
        <li><strong>📡 العرض:</strong> {accountData.offre}</li>
        <li><strong>⚡ السرعة:</strong> {accountData.speed} Mbps</li>
        <li><strong>💲 الرصيد:</strong> {accountData.credit} DA</li>
        <li><strong>💰 عدد الأيام المتبقية:</strong> {accountData.balance} يوم</li>
        <li><strong>📅 تاريخ الانتهاء:</strong> {accountData.dateexp}</li>
        <li><strong>📞 الهاتف المحمول:</strong> {accountData.mobile}</li>
        <li><strong>📧 البريد الإلكتروني:</strong> {accountData.email}</li>
        <li><strong>🆔 رقم الزبون:</strong> {accountData.ncli}</li>
        <li><strong>📊 الحالة:</strong> {accountData.status}</li>
        <li><strong>💫 النوع:</strong> {accountData.type1}</li>
      </ul>
    </div>
  );
};

export default AccountInfo;
