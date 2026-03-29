import React, { useEffect, useMemo, useState } from 'react';

const FALLBACK_MANAGERS = [
  { id: 'sarah', username: 'sarah' },
  { id: 'john', username: 'john' },
  { id: 'mitchell', username: 'mitchell' },
  { id: 'andreas', username: 'andreas' },
];

export default function ApprovalRuleConfig({ user, managers = [], onCancel, onSave }) {
  const managerOptions = useMemo(
    () => (managers.length > 0 ? managers : FALLBACK_MANAGERS),
    [managers]
  );

  const [selectedUser, setSelectedUser] = useState(user?.username || '');
  const [description, setDescription] = useState('Approval rule for miscellaneous expenses');
  const [manager, setManager] = useState(user?.managerId ?? managerOptions[0]?.id ?? '');
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [approverSequence, setApproverSequence] = useState(false);
  const [minApprovalPercentage, setMinApprovalPercentage] = useState('50');

  const [approvers, setApprovers] = useState([
    { id: 1, name: 'John', required: true },
    { id: 2, name: 'Mitchell', required: false },
    { id: 3, name: 'Andreas', required: false },
  ]);

  useEffect(() => {
    if (!user) return;
    setSelectedUser(user.username || '');
    setManager(user.managerId ?? managerOptions[0]?.id ?? '');
  }, [user, managerOptions]);

  const handleRequiredToggle = (id) => {
    setApprovers((prev) => prev.map((app) =>
      app.id === id ? { ...app, required: !app.required } : app
    ));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        user: selectedUser,
        description,
        manager,
        isManagerApprover,
        approverSequence,
        minApprovalPercentage,
        approvers,
      });
    }
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-semibold text-slate-900">User Approval Rules</h2>
        <p className="text-xs text-slate-500 mt-1">Configure manager and approver behavior for selected user.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
        <section className="space-y-4 bg-white border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-800">User & Rule Details</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">User</label>
            <input
              type="text"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description about rules</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Manager</label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              {managerOptions.map((m) => (
                <option key={m.id} value={m.id}>{m.username}</option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              Initially set to the user manager, and can be changed by admin.
            </p>
          </div>
        </section>

        <section className="space-y-4 bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-slate-800">Approvers</h3>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={isManagerApprover}
                onChange={(e) => setIsManagerApprover(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span>Is manager an approver</span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            If enabled, approval request goes to manager first before other approvers.
          </p>

          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">User</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-slate-600 uppercase tracking-wide">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {approvers.map((approver) => (
                  <tr key={approver.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 text-slate-800">{approver.name}</td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={approver.required}
                        onChange={() => handleRequiredToggle(approver.id)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={approverSequence}
              onChange={(e) => setApproverSequence(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span>Approve sequence</span>
          </label>
          <p className="text-xs text-slate-500 pl-6">
            If checked, the approver order matters. If unchecked, all approvers receive requests at once.
          </p>
        </section>
      </div>

      <div className="px-6 pb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Minimum approval percentage</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={minApprovalPercentage}
              onChange={(e) => setMinApprovalPercentage(e.target.value)}
              className="w-28 px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <span className="text-sm text-slate-600">%</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Rule
        </button>
      </div>
    </div>
  );
}