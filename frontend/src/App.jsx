import { useState } from 'react';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';

function App() {
  const [page, setPage] = useState('signin'); // 'signin' | 'signup'

  return page === 'signin'
    ? <SignIn onNavigateSignUp={() => setPage('signup')} />
    : <SignUp onNavigateSignIn={() => setPage('signin')} />;
}

export default App;
