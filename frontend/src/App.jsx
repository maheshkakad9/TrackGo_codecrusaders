import { useEffect, useState } from 'react';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import UserManagement from './pages/admin/UserManagement';
import EmployeeRequest from './pages/Employee/EmployeeRequest';
import ManagerView from './pages/Manager/ManagerView';

// Pages: 'signin' | 'signup' | 'admin' | 'employee' | 'manager'
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
  if (page === 'admin')       return <UserManagement />;
  if (page === 'employee')    return <EmployeeRequest />;
  if (page === 'manager')     return <ManagerView />;
  return (
    <SignIn
      onNavigateSignUp={() => setPage('signup')}
      onLoginSuccess={() => setPage('admin')}
      onLoginEmployee={() => setPage('employee')}
      onLoginManager={() => setPage('manager')}
    />
  );
}

export default App;
