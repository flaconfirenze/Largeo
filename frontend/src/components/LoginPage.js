import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [nd, setNd] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(nd, password);
      navigate('/account'); // Redirect to account page on successful login
    } catch (err) {
      // Display the specific error message from the backend
      const errorMessage = err.response?.data?.detail || err.message || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد والمحاولة مرة أخرى.';
      setError(errorMessage);
      console.error(err);
    }
  };

  return (
    <div>
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={nd}
          onChange={(e) => setNd(e.target.value)}
          placeholder="رقم الهاتف"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة المرور"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
