import React from 'react'
import Welcome from './_components/Welcome';
import CreateOptions from './_components/CreateOptions';
import LatestInterviewList from './_components/LatestInterviewList';

function Dashboard() {
  return (
    <div className="relative min-h-[90vh] space-y-8 pb-12">
      {/* Floating background orbs */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-primary/6 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-20 left-10 w-56 h-56 bg-violet-500/6 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed top-1/2 right-1/3 w-40 h-40 bg-fuchsia-400/4 rounded-full blur-2xl pointer-events-none -z-0" />

      <div className="relative z-10 space-y-8">
        {/* Welcome banner */}
        <Welcome />

        {/* Quick actions */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-primary to-violet-500" />
            <h2 className="font-extrabold text-2xl tracking-tight text-slate-800">
              Quick Actions
            </h2>
          </div>
          <CreateOptions />
        </div>

        {/* Latest interviews */}
        <LatestInterviewList />
      </div>
    </div>
  )
}

export default Dashboard
