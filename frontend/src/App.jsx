import { useState } from 'react';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import UserManagement from './pages/admin/UserManagement';

// Pages: 'signin' | 'signup' | 'admin'
function App() {
  const [page, setPage] = useState('signin');

  if (page === 'signup')      return <SignUp onNavigateSignIn={() => setPage('signin')} />;
  if (page === 'admin')       return <UserManagement />;
  return <SignIn onNavigateSignUp={() => setPage('signup')} onLoginSuccess={() => setPage('admin')} />;
}

export default App;
