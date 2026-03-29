import { useMemo } from 'react';

export default function AdminDashboard({ onOpenUsers, onOpenRules, onOpenWorkflow, onOpenApprovals }) {
  const stats = useMemo(() => ([
    { label: 'Total Users', value: 24 },
    { label: 'Active Expenses', value: 61 },
    { label: 'Pending Approvals', value: 9 },
    { label: 'Rules Configured', value: 6 },
  ]), []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-800">Admin Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor platform activity and jump to admin controls.</p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-md border border-gray-200 bg-[#f8f9fa] px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-[#6b4c6a]">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800">Admin Access</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button type="button" onClick={onOpenUsers} className="text-left rounded-md border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-semibold text-gray-800">User Management</p>
              <p className="text-xs text-gray-500 mt-0.5">Create users, assign roles, and map reporting managers.</p>
            </button>

            <button type="button" onClick={onOpenRules} className="text-left rounded-md border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-semibold text-gray-800">Approval Rules</p>
              <p className="text-xs text-gray-500 mt-0.5">Configure approvers, sequence, threshold, and hybrid rules.</p>
            </button>

            <button type="button" onClick={onOpenWorkflow} className="text-left rounded-md border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-semibold text-gray-800">Approval Workflow</p>
              <p className="text-xs text-gray-500 mt-0.5">Define step-by-step pipeline like Manager, Finance, Director.</p>
            </button>

            <button type="button" onClick={onOpenApprovals} className="text-left rounded-md border border-gray-300 bg-white px-4 py-3 hover:bg-gray-50 transition-colors">
              <p className="text-sm font-semibold text-gray-800">Approvals Queue</p>
              <p className="text-xs text-gray-500 mt-0.5">Review pending expenses, approve or reject with comments.</p>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
