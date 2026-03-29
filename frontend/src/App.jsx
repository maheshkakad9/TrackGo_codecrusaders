import { useEffect, useState } from 'react';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import UserManagement from './pages/admin/UserManagement';
import UserRules from './pages/admin/UserRules';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApprovalWorkflow from './pages/admin/ApprovalWorkflow';
import EmployeeRequest from './pages/Employee/EmployeeRequest';
import ManagerView from './pages/Manager/ManagerView';
import { SAMPLE_WORKFLOW_PEOPLE } from './data/workflowPeople';

const SAMPLE_ADMIN_USERS = [
  { id: 1, username: 'alice_m', managerId: 1 },
  { id: 2, username: 'bob_k', managerId: 1 },
  { id: 3, username: 'carol_j', managerId: null },
  { id: 4, username: 'mitchell', managerId: 1 },
];

// Pages: signin | signup | employee | manager | admin-dashboard | admin-users | admin-rules | admin-workflow | admin-approvals
function App() {
  const [page, setPage] = useState('signin');

  useEffect(() => {
    const onShortcut = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setPage('manager');
      }
    };

    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  if (page === 'signup')      return <SignUp onNavigateSignIn={() => setPage('signin')} />;
  if (page === 'employee')    return <EmployeeRequest />;
  if (page === 'manager')     return <ManagerView />;
  if (page === 'admin-users') {
    return (
      <div>
        <div className="bg-[#f8f9fa] px-4 py-3 border-b border-gray-200">
          <button onClick={() => setPage('admin-dashboard')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Back to Admin
          </button>
        </div>
        <UserManagement />
      </div>
    );
  }
  if (page === 'admin-workflow') return <ApprovalWorkflow onBack={() => setPage('admin-dashboard')} people={SAMPLE_WORKFLOW_PEOPLE} />;
  if (page === 'admin-approvals') {
    return (
      <div>
        <div className="bg-[#f8f9fa] px-4 py-3 border-b border-gray-200">
          <button onClick={() => setPage('admin-dashboard')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Back to Admin
          </button>
        </div>
        <ManagerView />
      </div>
    );
  }
  if (page === 'admin-rules') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-3">
            <button onClick={() => setPage('admin-dashboard')} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Back to Admin
            </button>
          </div>
          <UserRules
            user={{ username: 'alice_m', managerId: 1 }}
            users={SAMPLE_ADMIN_USERS}
            managers={[
              { id: 1, username: 'alice_m' },
              { id: 2, username: 'sarah' },
              { id: 3, username: 'mitchell' },
            ]}
            workflowPeople={SAMPLE_WORKFLOW_PEOPLE}
            onCancel={() => setPage('admin-dashboard')}
            onSave={() => setPage('admin-dashboard')}
          />
        </div>
      </div>
    );
  }
  if (page === 'admin-dashboard') {
    return (
      <AdminDashboard
        onOpenUsers={() => setPage('admin-users')}
        onOpenRules={() => setPage('admin-rules')}
        onOpenWorkflow={() => setPage('admin-workflow')}
        onOpenApprovals={() => setPage('admin-approvals')}
      />
    );
  }

  return (
    <SignIn
      onNavigateSignUp={() => setPage('signup')}
      onLoginSuccess={() => setPage('admin-dashboard')}
      onLoginEmployee={() => setPage('employee')}
      onLoginManager={() => setPage('manager')}
    />
  );
}

export default App;
