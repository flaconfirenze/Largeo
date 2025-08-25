import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import AccountInfo from './components/AccountInfo';
import CheckBill from './components/CheckBill';
import RechargePage from './components/RechargePage';
import NcliPage from './components/NcliPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/ncli" element={<NcliPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<AccountInfo />} />
                <Route path="/bills" element={<CheckBill />} />
                <Route path="/recharge" element={<RechargePage />} />
              </Route>

            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
