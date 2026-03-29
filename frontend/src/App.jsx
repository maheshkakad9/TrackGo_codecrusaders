import { useState } from 'react';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import UserManagement from './pages/admin/UserManagement';
import EmployeeRequest from './pages/Employee/EmployeeRequest';

// Pages: 'signin' | 'signup' | 'admin' | 'employee'
function App() {
  const [page, setPage] = useState('signin');

  if (page === 'signup')      return <SignUp onNavigateSignIn={() => setPage('signin')} />;
  if (page === 'admin')       return <UserManagement />;
  if (page === 'employee')    return <EmployeeRequest />;
  return (
    <SignIn
      onNavigateSignUp={() => setPage('signup')}
      onLoginSuccess={() => setPage('admin')}
      onLoginEmployee={() => setPage('employee')}
    />
  );
}

export default App;
