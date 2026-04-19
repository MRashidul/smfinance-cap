import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getSession } from '../../lib/auth'

export function RequireAdmin({ children }) {
  const session = getSession()
  const location = useLocation()
  if (!session || session.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export function RequirePartner({ children }) {
  const session = getSession()
  const location = useLocation()
  if (!session || (session.role !== 'partner' && session.role !== 'admin')) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export function RequireClient({ children }) {
  const session = getSession()
  const location = useLocation()
  if (!session || (session.role !== 'client' && session.role !== 'admin')) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}
