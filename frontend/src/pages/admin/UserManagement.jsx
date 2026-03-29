import { useState } from 'react';
import UserRules from './UserRules';

const SEED_USERS = [
  { id: 1, username: 'alice_m',  role: 'manager',  email: 'alice@company.com',  managerId: null, passwordSent: false },
  { id: 2, username: 'bob_k',    role: 'employee', email: 'bob@company.com',    managerId: 1,    passwordSent: true  },
  { id: 3, username: 'carol_j',  role: 'employee', email: 'carol@company.com',  managerId: null, passwordSent: false },
];

const ROLES = ['manager', 'employee'];
const emptyDraft = { username: '', role: 'employee', email: '', managerId: '' };

export default function UserManagement() {

  const [users, setUsers]             = useState(SEED_USERS);
  const [adding, setAdding]           = useState(false);
  const [draft, setDraft]             = useState(emptyDraft);
  const [draftErrors, setDraftErrors] = useState({});
  const [sending, setSending]         = useState(null);
  const [showUserRules, setShowUserRules] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // List of managers derived from state
  const managers = users.filter(u => u.role === 'manager');

  // ── Draft row ───────────────────────────────────────────────────
  const handleDraftChange = (e) => {
    const { name, value } = e.target;
    // When role changes to manager, clear managerId
    const update = name === 'role' && value === 'manager'
      ? { role: 'manager', managerId: '' }
      : { [name]: value };
    setDraft(p => ({ ...p, ...update }));
    if (draftErrors[name]) setDraftErrors(p => ({ ...p, [name]: '' }));
  };

  const validateDraft = () => {
    const e = {};
    if (!draft.username.trim())
      e.username = 'Required';
    else if (users.some(u => u.username === draft.username.trim()))
      e.username = 'Already exists';
    if (!draft.email.trim())
      e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email))
      e.email = 'Invalid email';
    return e;
  };

  const handleSaveDraft = () => {
    const errs = validateDraft();
    if (Object.keys(errs).length) { setDraftErrors(errs); return; }
    setUsers(p => [
      ...p,
      {
        id: Date.now(),
        username:  draft.username.trim(),
        role:      draft.role,
        email:     draft.email.trim(),
        managerId: draft.role === 'employee' && draft.managerId ? Number(draft.managerId) : null,
        passwordSent: false,
      },
    ]);
    setAdding(false);
    setDraft(emptyDraft);
    setDraftErrors({});
  };

  const handleCancelDraft = () => {
    setAdding(false);
    setDraft(emptyDraft);
    setDraftErrors({});
  };

  // ── Assign manager for existing employee ────────────────────────
  const handleManagerChange = (userId, managerId) => {
    setUsers(p =>
      p.map(u => u.id === userId
        ? { ...u, managerId: managerId ? Number(managerId) : null }
        : u
      )
    );
  };

  // ── Send password (mock) ────────────────────────────────────────
  const handleSendPassword = (id) => {
    setSending(id);
    setTimeout(() => {
      setUsers(p => p.map(u => u.id === id ? { ...u, passwordSent: true } : u));
      setSending(null);
    }, 1200);
  };

  // ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage employee and manager accounts</p>
        </div>
        <button
          id="new-user-btn"
          onClick={() => { if (!adding) setAdding(true); }}
          disabled={adding}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New User
        </button>
      </header>

      {/* ── Main ── */}
      <main className="px-6 py-6 max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Users', value: users.length },
            { label: 'Managers',    value: managers.length },
            { label: 'Employees',   value: users.filter(u => u.role === 'employee').length },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl px-5 py-4">
              <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[20%]">Username</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[13%]">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[22%]">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-[18%]">Manager</th>
                <th className="px-5 py-3 w-[155px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">

              {/* ── Inline new-user row ── */}
              {adding && (
                <tr className="bg-indigo-50/40">
                  {/* Username */}
                  <td className="px-4 py-2.5">
                    <input
                      id="draft-username"
                      type="text"
                      name="username"
                      value={draft.username}
                      onChange={handleDraftChange}
                      placeholder="username"
                      autoFocus
                      className={inlineInput(draftErrors.username)}
                    />
                    {draftErrors.username && <p className="text-[11px] text-red-500 mt-1">{draftErrors.username}</p>}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-2.5">
                    <select
                      name="role"
                      value={draft.role}
                      onChange={handleDraftChange}
                      className={inlineInput(false) + ' cursor-pointer'}
                    >
                      {ROLES.map(r => (
                        <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                      ))}
                    </select>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-2.5">
                    <input
                      id="draft-email"
                      type="email"
                      name="email"
                      value={draft.email}
                      onChange={handleDraftChange}
                      placeholder="email@company.com"
                      className={inlineInput(draftErrors.email)}
                    />
                    {draftErrors.email && <p className="text-[11px] text-red-500 mt-1">{draftErrors.email}</p>}
                  </td>

                  {/* Manager — only shown for employee role */}
                  <td className="px-4 py-2.5">
                    {draft.role === 'employee' ? (
                      <select
                        name="managerId"
                        value={draft.managerId}
                        onChange={handleDraftChange}
                        className={inlineInput(false) + ' cursor-pointer'}
                      >
                        <option value="">No manager</option>
                        {managers.map(m => (
                          <option key={m.id} value={m.id}>{m.username}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-400 px-1">—</span>
                    )}
                  </td>

                  {/* Save / Cancel */}
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={handleCancelDraft}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        id="save-user-btn"
                        onClick={handleSaveDraft}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* ── Existing users ── */}
              {users.length === 0 && !adding ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-gray-400 text-sm">
                    No users yet. Click <strong>+ New User</strong> to add one.
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const assignedManager = managers.find(m => m.id === user.managerId);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => { setSelectedUser(user); setShowUserRules(true); }}>
                      {/* Username */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-600 shrink-0">
                            {user.username.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{user.username}</span>
                        </div>
                      </td>
                      {/* Role badge */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${user.role === 'manager'
                            ? 'bg-violet-50 text-violet-700'
                            : 'bg-blue-50 text-blue-700'}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      {/* Email */}
                      <td className="px-5 py-3.5 text-gray-600 text-sm">{user.email}</td>
                      {/* Manager column */}
                      <td className="px-5 py-3.5">
                        {user.role === 'manager' ? (
                          <span className="text-xs text-gray-400">N/A</span>
                        ) : (
                          <select
                            value={user.managerId ?? ''}
                            onChange={e => handleManagerChange(user.id, e.target.value)}
                            className="px-2.5 py-1.5 border-[1.5px] border-solid border-gray-200 rounded-md text-xs text-gray-700 bg-white outline-none cursor-pointer hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:ring-offset-0 transition-all"
                            onClick={e => e.stopPropagation()}
                          >
                            <option value="">No manager</option>
                            {managers.map(m => (
                              <option key={m.id} value={m.id}>{m.username}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      {/* Send Password */}
                      <td className="px-5 py-3.5 text-right">
                        {user.passwordSent ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Password sent
                          </span>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); handleSendPassword(user.id); }}
                            disabled={sending === user.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {sending === user.id ? (
                              <>
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                                Sending…
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Send Password
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-right">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>
    {/* User Rules Modal/Panel */}
    {showUserRules && selectedUser && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-auto relative">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            onClick={() => setShowUserRules(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <UserRules
            user={selectedUser}
            users={users}
            managers={managers}
            onCancel={() => setShowUserRules(false)}
            onSave={() => setShowUserRules(false)}
          />
        </div>
      </div>
    )}
  </div>
);
}

// ── Helper ───────────────────────────────────────────────────────
function inlineInput(hasError) {
  const base = 'w-full px-2.5 py-1.5 border-[1.5px] border-solid rounded-md text-sm text-gray-800 bg-white outline-none placeholder:text-gray-400 transition-all focus:ring-2 focus:ring-offset-0';
  return hasError
    ? `${base} border-red-400 focus:ring-red-100`
    : `${base} border-gray-300 focus:border-indigo-500 focus:ring-indigo-100`;
}
