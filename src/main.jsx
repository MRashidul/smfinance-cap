import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import Login from './pages/Login'
import { RequireAdmin, RequirePartner, RequireClient } from './components/shared/AuthGuard'

import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminGenerateToken from './pages/AdminGenerateToken'
import AdminScanVerify from './pages/AdminScanVerify'
import AdminEntries from './pages/AdminEntries'
import AdminLiveDraw from './pages/AdminLiveDraw'
import AdminPartners from './pages/AdminPartners'
import AdminRegisterPartner from './pages/AdminRegisterPartner'
import AdminReferralLog from './pages/AdminReferralLog'
import AdminLeaderboard from './pages/AdminLeaderboard'

import ClientPortal from './pages/ClientPortal'
import PartnerPortal from './pages/PartnerPortal'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public login */}
        <Route path="/login" element={<Login />} />

        {/* Admin — requires admin session */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="generate" element={<AdminGenerateToken />} />
          <Route path="scan" element={<AdminScanVerify />} />
          <Route path="entries" element={<AdminEntries />} />
          <Route path="draw" element={<AdminLiveDraw />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="partners/register" element={<AdminRegisterPartner />} />
          <Route path="referrals" element={<AdminReferralLog />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
        </Route>

        {/* Client portal — requires client or admin session */}
        <Route path="/entry/:ref" element={<RequireClient><ClientPortal /></RequireClient>} />

        {/* Partner portal — requires partner or admin session */}
        <Route path="/partner/:partnerId" element={<RequirePartner><PartnerPortal /></RequirePartner>} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
