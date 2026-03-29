import { useState, useMemo } from 'react';
import countriesData from '../../data/countries.json';

// Build sorted list: { name, currencyCode, currencyName }
const countryOptions = countriesData
  .map((c) => {
    const entries = Object.entries(c.currencies || {});
    const [code, info] = entries[0] || ['', { name: '' }];
    return {
      name: c.name.common,
      currencyCode: code,
      currencyName: info?.name || '',
    };
  })
  .filter((c) => c.name)
  .sort((a, b) => a.name.localeCompare(b.name));

function SignUp({ onNavigateSignIn }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const selectedCountry = useMemo(
    () => countryOptions.find((c) => c.name === form.country) || null,
    [form.country]
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';
    if (!form.country) e.country = 'Please select a country.';
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

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      country: form.country,
      currency: selectedCountry
        ? { code: selectedCountry.currencyCode, name: selectedCountry.currencyName }
        : null,
    };
    console.log('Sign-up payload:', payload);
    setSubmitted(true);
  };

  // ── Success screen ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-10 w-full max-w-md text-center">
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Account Created!</h2>
          <p className="text-slate-500 mb-6">
            Welcome, <span className="font-semibold text-slate-700">{form.name}</span>.
            Your account has been successfully created.
          </p>
          <button
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all"
            onClick={() => {
              setForm({ name: '', email: '', password: '', confirmPassword: '', country: '' });
              setErrors({});
              setSubmitted(false);
            }}
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-1 text-sm">Fill in the details below to get started</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* Full Name */}
          <Field label="Full Name" error={errors.name}>
            <input
              id="signup-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
              className={inputClass(errors.name)}
            />
          </Field>

          {/* Email */}
          <Field label="Email Address" error={errors.email}>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="email"
              className={inputClass(errors.email)}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password}>
            <input
              id="signup-password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className={inputClass(errors.password)}
            />
          </Field>

          {/* Confirm Password */}
          <Field label="Confirm Password" error={errors.confirmPassword}>
            <input
              id="signup-confirm-password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={inputClass(errors.confirmPassword)}
            />
          </Field>

          {/* Country */}
          <Field label="Country" error={errors.country}>
            <select
              id="signup-country"
              name="country"
              value={form.country}
              onChange={handleChange}
              className={inputClass(errors.country)}
            >
              <option value="">— Select your country —</option>
              {countryOptions.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}{c.currencyCode ? ` (${c.currencyCode})` : ''}
                </option>
              ))}
            </select>
            {selectedCountry?.currencyName && (
              <p className="text-xs text-slate-400 mt-1">
                Currency: {selectedCountry.currencyName}
              </p>
            )}
          </Field>

          {/* Submit */}
          <button
            id="signup-submit-btn"
            type="submit"
            className="mt-1 w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 active:scale-[0.98] transition-all"
          >
            Sign Up
          </button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignIn}
            className="text-indigo-600 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            Sign in
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

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default SignUp;
