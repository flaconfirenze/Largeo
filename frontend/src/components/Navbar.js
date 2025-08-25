import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">الرئيسية</Link></li>
        <li><Link to="/ncli">رقم الزبون</Link></li>
        {!token ? (
          <>
            <li><Link to="/login">تسجيل الدخول</Link></li>
            <li><Link to="/register">تسجيل جديد</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/account">معلومات الحساب</Link></li>
            <li><Link to="/bills">الفواتير</Link></li>
            <li><Link to="/recharge">الشحن</Link></li>
            <li><button onClick={handleLogout}>تسجيل الخروج</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
