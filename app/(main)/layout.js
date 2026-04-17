import React from 'react'
import DashboardProvider from './provider';

function DashboardLayout({ children }) {
  return (
    <div className='min-h-screen animated-mesh-bg relative overflow-hidden'>
      {/* Decorative blobs for liveliness */}
      <div className="blob bg-pink-600/20 w-96 h-96 rounded-full top-0 left-[-10%] blur-3xl mix-blend-screen"></div>
      <div className="blob bg-purple-600/20 w-96 h-96 rounded-full bottom-0 right-[-10%] blur-3xl mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      <div className="blob bg-fuchsia-600/20 w-80 h-80 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-3xl mix-blend-screen" style={{ animationDelay: '4s' }}></div>
      
      <DashboardProvider>
        <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout