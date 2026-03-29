// SAMPLE DATA ONLY: Keep this until backend people API is integrated.
// Backend integration plan:
// 1) Replace these arrays with API response from users/workflow endpoints.
// 2) Keep same shape: { id, name }.
// 3) Wire API in page-level useEffect and pass as props.

export const SAMPLE_WORKFLOW_PEOPLE = [
  { id: 101, name: 'John' },
  { id: 102, name: 'Mitchell' },
  { id: 103, name: 'Andreas' },
  { id: 104, name: 'Sarah' },
  { id: 105, name: 'Alice' },
];

export const SAMPLE_WORKFLOW_STEPS = [
  { id: 1, approverId: 104 },
  { id: 2, approverId: 101 },
  { id: 3, approverId: 102 },
];
