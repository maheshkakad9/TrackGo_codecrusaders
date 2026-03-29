import { useState } from 'react';

const INITIAL_APPROVALS = [
	{
		id: 1,
		subject: 'Travel reimbursement for client visit',
		requestOwner: 'Aarav Sharma',
		category: 'Travel',
		requestStatus: 'Pending',
		totalAmount: 1850,
	},
	{
		id: 2,
		subject: 'Office supplies reimbursement',
		requestOwner: 'Diya Patel',
		category: 'Supplies',
		requestStatus: 'Approved',
		totalAmount: 920,
	},
	{
		id: 3,
		subject: 'Internet monthly claim',
		requestOwner: 'Rohan Verma',
		category: 'Utilities',
		requestStatus: 'Rejected',
		totalAmount: 1200,
	},
];

export default function ManagerView() {
	const [approvals, setApprovals] = useState(
		INITIAL_APPROVALS.map((item, index) => ({
			...item,
			description: item.subject,
			employeeName: item.requestOwner,
			receiptName: `receipt_${index + 1}.pdf`,
			comment: '',
		}))
	);
	const [activeAction, setActiveAction] = useState(null);
	const [actionComment, setActionComment] = useState('');

	const pendingCount = approvals.filter((item) => item.requestStatus === 'Pending').length;
	const approvedCount = approvals.filter((item) => item.requestStatus === 'Approved').length;
	const rejectedCount = approvals.filter((item) => item.requestStatus === 'Rejected').length;
	const totalPendingAmount = approvals
		.filter((item) => item.requestStatus === 'Pending')
		.reduce((sum, item) => sum + item.totalAmount, 0);

	const updateStatus = (id, nextStatus) => {
		setApprovals((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, requestStatus: nextStatus } : item
			)
		);
	};

	const openActionModal = (id, nextStatus) => {
		setActiveAction({ id, nextStatus });
		setActionComment('');
	};

	const confirmAction = () => {
		if (!activeAction) return;
		setApprovals((prev) =>
			prev.map((item) =>
				item.id === activeAction.id
					? { ...item, requestStatus: activeAction.nextStatus, comment: actionComment.trim() }
					: item
			)
		);
		setActiveAction(null);
		setActionComment('');
	};

	const pendingApprovals = approvals.filter((item) => item.requestStatus === 'Pending');
	const teamExpenses = approvals.filter((item) => item.requestStatus !== 'Pending');

	return (
		<div className="min-h-screen bg-[#f8f9fa] px-5 py-8">
			<div className="max-w-7xl mx-auto space-y-6">
				<section className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm p-6">
					<div className="flex items-start justify-between gap-4 flex-wrap">
						<div>
							<p className="text-xs uppercase tracking-[0.18em] text-[#6b4c6a] font-semibold">Manager Workspace</p>
							<h1 className="mt-2 text-3xl font-semibold text-gray-800">Approvals for Review</h1>
							<p className="mt-2 text-sm text-gray-600">Review submitted expense requests and take quick approval decisions.</p>
						</div>
						<div className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-600">
							Shortcut: Ctrl + Shift + M
						</div>
					</div>

					<div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-3">
						<MetricCard label="Pending" value={pendingCount} tint="amber" />
						<MetricCard label="Approved" value={approvedCount} tint="emerald" />
						<MetricCard label="Rejected" value={rejectedCount} tint="rose" />
						<MetricCard label="Pending Amount (INR)" value={totalPendingAmount} tint="sky" prefix="INR " />
					</div>
				</section>

				<section className="rounded-sm border border-gray-200 bg-white overflow-hidden shadow-sm">
					<div className="px-5 py-3 border-b border-gray-200 bg-[#f8f9fa]">
						<h2 className="text-sm font-semibold text-gray-700">Pending Approvals</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-white border-b border-gray-200">
								<tr>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Employee</th>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Description</th>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Receipt</th>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Status</th>
									<th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-700">Amount (INR)</th>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{pendingApprovals.map((item) => {
									return (
										<tr key={item.id} className="hover:bg-gray-50 transition-colors">
											<td className="px-4 py-3 text-gray-700">{item.employeeName}</td>
											<td className="px-4 py-3 text-gray-800 font-medium">{item.description}</td>
											<td className="px-4 py-3 text-gray-700">
												<button type="button" className="text-[#6b4c6a] hover:text-[#5a3f59] underline underline-offset-2">
													{item.receiptName}
												</button>
											</td>
											<td className="px-4 py-3">
												<span className={statusPillClass(item.requestStatus)}>{item.requestStatus}</span>
											</td>
											<td className="px-4 py-3 text-right font-semibold text-gray-800">INR {item.totalAmount}</td>
											<td className="px-4 py-3">
												<div className="flex items-center gap-2">
													<button
														type="button"
														onClick={() => openActionModal(item.id, 'Approved')}
														className="rounded-md border border-[#6b4c6a] bg-[#6b4c6a] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#5a3f59] transition-colors"
													>
														Approve
													</button>
													<button
														type="button"
														onClick={() => openActionModal(item.id, 'Rejected')}
														className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
													>
														Reject
													</button>
												</div>
											</td>
										</tr>
									);
								})}
								{pendingApprovals.length === 0 && (
									<tr>
										<td colSpan={6} className="px-4 py-8 text-center text-gray-500">No pending approvals</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>

				<section className="rounded-sm border border-gray-200 bg-white overflow-hidden shadow-sm">
					<div className="px-5 py-3 border-b border-gray-200 bg-[#f8f9fa]">
						<h2 className="text-sm font-semibold text-gray-700">Team Expenses</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-white border-b border-gray-200">
								<tr>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Employee</th>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Category</th>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Description</th>
									<th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-700">Status</th>
									<th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-700">Amount (INR)</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{teamExpenses.map((item) => (
									<tr key={`team-${item.id}`} className="hover:bg-gray-50 transition-colors">
										<td className="px-4 py-3 text-gray-700">{item.employeeName}</td>
										<td className="px-4 py-3 text-gray-700">{item.category}</td>
										<td className="px-4 py-3 text-gray-800">{item.description}</td>
										<td className="px-4 py-3"><span className={statusPillClass(item.requestStatus)}>{item.requestStatus}</span></td>
										<td className="px-4 py-3 text-right font-semibold text-gray-800">INR {item.totalAmount}</td>
									</tr>
								))}
								{teamExpenses.length === 0 && (
									<tr>
										<td colSpan={5} className="px-4 py-8 text-center text-gray-500">No team expenses yet</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</section>

				{activeAction && (
					<div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
						<div className="w-full max-w-md bg-white border border-gray-200 rounded-sm shadow-sm p-5">
							<h3 className="text-lg font-semibold text-gray-800">{activeAction.nextStatus} Expense</h3>
							<p className="text-sm text-gray-500 mt-1">Add comment (optional)</p>
							<textarea
								rows={4}
								value={actionComment}
								onChange={(e) => setActionComment(e.target.value)}
								className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-[#6b4c6a] focus:border-[#6b4c6a] resize-none"
								placeholder="Reason or note"
							/>
							<div className="mt-4 flex justify-end gap-2">
								<button type="button" onClick={() => setActiveAction(null)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
								<button type="button" onClick={confirmAction} className="rounded-md bg-[#6b4c6a] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#5a3f59]">Confirm</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function statusPillClass(status) {
	const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border';
	if (status === 'Approved') return `${base} bg-[#f0f9f4] text-[#1f7a4f] border-[#c8ecd9]`;
	if (status === 'Rejected') return `${base} bg-[#fff1f2] text-[#be123c] border-[#fecdd3]`;
	return `${base} bg-[#f6f2f7] text-[#6b4c6a] border-[#e8dfec]`;
}

function MetricCard({ label, value, tint, prefix = '' }) {
	const styles = {
		sky: 'border-[#e8dfec] bg-[#f6f2f7] text-[#6b4c6a]',
		emerald: 'border-[#d8efe2] bg-[#f0f9f4] text-[#1f7a4f]',
		rose: 'border-[#fecdd3] bg-[#fff1f2] text-[#be123c]',
		amber: 'border-[#e8dfec] bg-[#f6f2f7] text-[#6b4c6a]',
	};

	return (
		<div className={`rounded-xl border px-4 py-3 ${styles[tint]}`}>
			<p className="text-[11px] uppercase tracking-wide font-semibold">{label}</p>
			<p className="mt-1 text-xl font-semibold">{prefix}{value}</p>
		</div>
	);
}
