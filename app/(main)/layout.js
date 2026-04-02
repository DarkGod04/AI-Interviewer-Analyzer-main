import React from 'react'
import DashboardProvider from './provider';

function DashboardLayout({ children }) {
  return (
    <div className='min-h-screen' style={{ background: 'linear-gradient(160deg, #f8fafc 0%, #eef2ff 50%, #f5f3ff 100%)' }}>
      <DashboardProvider>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout