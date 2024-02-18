import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Registration from './pages/registration';
import AdminPanel from './pages/adminPanel';
import Dashboard from './pages/Dashboard';
import TransactionManagement from './pages/TransactionManagement';
import LotManagemant from './pages/LotManagemant';
import UserManagement from './pages/userManagement';
import Error404Page from './pages/404';
import TourRequestPage from './pages/tourRequest';

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/record" element={<TransactionManagement />} />
        <Route path="/admin/lotregistration" element={<LotManagemant />} />
        <Route path="/admin/usermanagement" element={<UserManagement />} />
        <Route path="/admin/tour-request" element={<TourRequestPage />} />
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
