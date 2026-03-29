import { useState } from 'react';

function SignIn({ onNavigateSignUp }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = { email: form.email.trim(), password: form.password };
    console.log('Sign-in payload:', payload);
    // TODO: connect to backend auth
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="signin-email" className="text-sm font-semibold text-slate-700">
              Email address
            </label>
            <input
              id="signin-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="email"
              className={inputClass(errors.email)}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="signin-password" className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-indigo-600 font-medium hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="signin-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={inputClass(errors.password) + ' pr-10'}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
          </div>

          {/* Submit */}
          <button
            id="signin-submit-btn"
            type="submit"
            className="mt-1 w-full py-[11px] rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:scale-[0.99] transition-all"
          >
            Log in
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="text-indigo-600 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Sign up
          </button>
        </p>

      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────
function inputClass(hasError) {
  const base =
    'w-full px-4 py-[10px] border-[1.5px] border-solid rounded-lg text-sm text-slate-800 bg-white outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-offset-0';
  return hasError
    ? `${base} border-red-400 focus:ring-red-200`
    : `${base} border-slate-300 focus:border-indigo-500 focus:ring-indigo-100`;
}

function Eye() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOff() {
  return (
    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
    </svg>
  );
}

export default SignIn;
