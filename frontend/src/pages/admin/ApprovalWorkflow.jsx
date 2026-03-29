import { useMemo, useState } from 'react';
import { SAMPLE_WORKFLOW_PEOPLE, SAMPLE_WORKFLOW_STEPS } from '../../data/workflowPeople';

export default function ApprovalWorkflow({ onBack, people = SAMPLE_WORKFLOW_PEOPLE }) {
  // SAMPLE DATA ONLY: keep this until backend is wired.
  // Backend integration example:
  // const [people, setPeople] = useState([]);
  // useEffect(() => {
  //   fetch('/api/workflow/people').then((r) => r.json()).then(setPeople);
  // }, []);

  const [steps, setSteps] = useState(SAMPLE_WORKFLOW_STEPS);
  const [nextApproverId, setNextApproverId] = useState(people[0]?.id || 0);

  const getApproverName = useMemo(
    () => (id) => people.find((p) => p.id === id)?.name || 'Unknown',
    [people]
  );

  const addStep = () => {
    if (!nextApproverId) return;
    setSteps((prev) => [...prev, { id: Date.now(), approverId: Number(nextApproverId) }]);
  };

  const removeStep = (id) => {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold text-gray-800">Approval Workflow</h1>
          {onBack && (
            <button type="button" onClick={onBack} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Back to Admin
            </button>
          )}
        </div>

        <section className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-800">Workflow Steps</h2>
          <p className="text-xs text-gray-500 mt-1">Define order for approval progression.</p>

          <div className="mt-4 space-y-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center justify-between rounded-md border border-gray-200 bg-[#f8f9fa] px-4 py-3">
                <div className="text-sm text-gray-800 font-medium">Step {index + 1} -&gt; {getApproverName(step.approverId)}</div>
                <button type="button" onClick={() => removeStep(step.id)} className="text-xs font-semibold text-[#6b4c6a] hover:text-[#5a3f59]">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <select value={nextApproverId} onChange={(e) => setNextApproverId(Number(e.target.value))} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-[#6b4c6a] focus:border-[#6b4c6a]">
              {people.map((person) => (
                <option key={person.id} value={person.id}>{person.name}</option>
              ))}
            </select>
            <button type="button" onClick={addStep} className="rounded-md bg-[#6b4c6a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5a3f59] transition-colors">
              Add Step
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
