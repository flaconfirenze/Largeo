import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nd: '',
    ncli: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 for form, 2 for OTP
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await axios.post('/api/register', registerData);

      // The API returns different codes. "5" means OTP is required.
      if (response.data && response.data.code === "5") {
        setStep(2); // Move to OTP step
      } else if (response.data && response.data.code === "0") {
        // Registration complete without OTP
        navigate('/login');
      }
      else {
        setError(response.data.message || 'فشل التسجيل.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ أثناء التسجيل.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/confirm-register', {
        nd: formData.nd,
        otp: otp,
      });

      if (response.data && response.data.meta_data?.original?.token) {
        // OTP confirmation successful
        navigate('/login');
      } else {
        setError(response.data.message || 'فشل تأكيد رمز التحقق.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ أثناء تأكيد رمز التحقق.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <h2>تسجيل حساب جديد</h2>
          <form onSubmit={handleRegister}>
            <input type="text" name="nd" value={formData.nd} onChange={handleChange} placeholder="رقم الهاتف" required />
            <input type="text" name="ncli" value={formData.ncli} onChange={handleChange} placeholder="رقم الزبون (NCLI)" required />
            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="رقم الهاتف المحمول" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="البريد الإلكتروني" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="كلمة المرور" required />
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="تأكيد كلمة المرور" required />
            <button type="submit" disabled={loading}>
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </>
      ) : (
        <>
          <h2>تأكيد رمز التحقق (OTP)</h2>
          <p>تم إرسال رمز التحقق إلى هاتفك. يرجى إدخاله أدناه.</p>
          <form onSubmit={handleOtpConfirm}>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="أدخل رمز التحقق" required />
            <button type="submit" disabled={loading}>
              {loading ? 'جاري التأكيد...' : 'تأكيد'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default RegisterPage;
