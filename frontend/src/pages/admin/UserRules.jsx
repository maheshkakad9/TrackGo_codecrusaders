import React, { useEffect, useMemo, useState } from 'react';
import { SAMPLE_WORKFLOW_PEOPLE } from '../../data/workflowPeople';

const FALLBACK_MANAGERS = [
  { id: 'sarah', username: 'sarah' },
  { id: 'john', username: 'john' },
  { id: 'mitchell', username: 'mitchell' },
  { id: 'andreas', username: 'andreas' },
];

export default function ApprovalRuleConfig({ user, users = [], managers = [], workflowPeople = SAMPLE_WORKFLOW_PEOPLE, onCancel, onSave }) {
  // SAMPLE DATA ONLY: keep fallback arrays until backend is wired.
  // Backend integration example:
  // const [users, setUsers] = useState([]);
  // const [workflowPeople, setWorkflowPeople] = useState([]);
  // useEffect(() => {
  //   Promise.all([
  //     fetch('/api/users').then((r) => r.json()),
  //     fetch('/api/workflow/people').then((r) => r.json()),
  //   ]).then(([u, p]) => { setUsers(u); setWorkflowPeople(p); });
  // }, []);

  const managerOptions = useMemo(
    () => (managers.length > 0 ? managers : FALLBACK_MANAGERS),
    [managers]
  );

  const userOptions = useMemo(
    () => (users.length > 0 ? users : managerOptions),
    [users, managerOptions]
  );

  const [selectedUser, setSelectedUser] = useState(user?.username || userOptions[0]?.username || '');
  const [description, setDescription] = useState('Approval rule for miscellaneous expenses');
  const [manager, setManager] = useState(user?.managerId ?? managerOptions[0]?.id ?? '');
  const [isManagerApprover, setIsManagerApprover] = useState(false);
  const [approverSequence, setApproverSequence] = useState(false);
  const [minApprovalPercentage, setMinApprovalPercentage] = useState('50');
  const [specialApprover, setSpecialApprover] = useState(workflowPeople[0]?.name || 'CFO');
  const [hybridRules, setHybridRules] = useState(false);

  const [approvers, setApprovers] = useState(
    workflowPeople.slice(0, 3).map((person, index) => ({
      id: person.id,
      name: person.name,
      required: index === 0,
    }))
  );

  useEffect(() => {
    if (!user) return;
    setSelectedUser(user.username || '');
    setManager(user.managerId ?? managerOptions[0]?.id ?? '');
  }, [user, managerOptions]);

  useEffect(() => {
    setApprovers((prev) => {
      const requiredMap = new Map(prev.map((a) => [a.id, a.required]));
      return workflowPeople.map((person, index) => ({
        id: person.id,
        name: person.name,
        required: requiredMap.has(person.id) ? requiredMap.get(person.id) : index === 0,
      }));
    });
    if (workflowPeople.length > 0 && !workflowPeople.some((p) => p.name === specialApprover)) {
      setSpecialApprover(workflowPeople[0].name);
    }
  }, [workflowPeople, specialApprover]);

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
        specialApprover,
        hybridRules,
        approvers,
      });
    }
  };

  return (
    <div className="bg-[#f8f9fa] rounded-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-800">User Approval Rules</h2>
        <p className="text-xs text-gray-500 mt-1">Configure manager and approver behavior for selected user.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
        <section className="space-y-4 bg-white border border-gray-200 rounded-md p-4">
          <h3 className="text-sm font-semibold text-gray-800">User & Rule Details</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#e8dfec] focus:border-[#6b4c6a] outline-none bg-white"
            >
              {userOptions.map((u) => (
                <option key={u.id || u.username} value={u.username}>{u.username}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description about rules</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#e8dfec] focus:border-[#6b4c6a] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Manager</label>
            <select
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#e8dfec] focus:border-[#6b4c6a] outline-none bg-white"
            >
              {managerOptions.map((m) => (
                <option key={m.id} value={m.id}>{m.username}</option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-gray-500">
              Initially set to the user manager, and can be changed by admin.
            </p>
          </div>
        </section>

        <section className="space-y-4 bg-white border border-gray-200 rounded-md p-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm font-semibold text-gray-800">Approvers</h3>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isManagerApprover}
                onChange={(e) => setIsManagerApprover(e.target.checked)}
                className="w-4 h-4 text-[#6b4c6a] border-gray-300 rounded focus:ring-[#e8dfec]"
              />
              <span>Is manager an approver</span>
            </label>
          </div>

          <p className="text-xs text-gray-500">
            If enabled, approval request goes to manager first before other approvers.
          </p>

          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">User</th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {approvers.map((approver) => (
                  <tr key={approver.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-gray-800">{approver.name}</td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={approver.required}
                        onChange={() => handleRequiredToggle(approver.id)}
                        className="w-4 h-4 text-[#6b4c6a] border-gray-300 rounded focus:ring-[#e8dfec]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={approverSequence}
              onChange={(e) => setApproverSequence(e.target.checked)}
              className="w-4 h-4 text-[#6b4c6a] border-gray-300 rounded focus:ring-[#e8dfec]"
            />
            <span>Approve sequence</span>
          </label>
          <p className="text-xs text-gray-500 pl-6">
            If checked, the approver order matters. If unchecked, all approvers receive requests at once.
          </p>
        </section>
      </div>

      <div className="px-6 pb-4">
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum approval percentage</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              value={minApprovalPercentage}
              onChange={(e) => setMinApprovalPercentage(e.target.value)}
              className="w-28 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#e8dfec] focus:border-[#6b4c6a] outline-none"
            />
            <span className="text-sm text-gray-600">%</span>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Special approver</label>
            <select
              value={specialApprover}
              onChange={(e) => setSpecialApprover(e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#e8dfec] focus:border-[#6b4c6a] outline-none bg-white"
            >
              {workflowPeople.map((person) => (
                <option key={person.id} value={person.name}>{person.name}</option>
              ))}
            </select>
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={hybridRules}
              onChange={(e) => setHybridRules(e.target.checked)}
              className="w-4 h-4 text-[#6b4c6a] border-gray-300 rounded focus:ring-[#e8dfec]"
            />
            <span>Enable hybrid rules</span>
          </label>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-[#6b4c6a] rounded-md hover:bg-[#5a3f59] transition-colors"
        >
          Save Rule
        </button>
      </div>
    </div>
  );
}