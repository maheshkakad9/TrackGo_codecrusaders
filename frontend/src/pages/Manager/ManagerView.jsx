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
	const [approvals, setApprovals] = useState(INITIAL_APPROVALS);

	const updateStatus = (id, nextStatus) => {
		setApprovals((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, requestStatus: nextStatus } : item
			)
		);
	};

	return (
		<div className="min-h-screen bg-slate-50 px-6 py-8">
			<div className="max-w-7xl mx-auto space-y-5">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<h1 className="text-2xl font-semibold text-slate-900">Approvals for Review</h1>
					<span className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-md px-3 py-1.5">
						Shortcut: Ctrl + Shift + M
					</span>
				</div>

				<section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-slate-50 border-b border-slate-200">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Approval Subject</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Request Owner</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Category</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Request Status</th>
									<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Total Amount (INR)</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Approve / Reject</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-200">
								{approvals.map((item) => {
									const isPending = item.requestStatus === 'Pending';
									return (
										<tr key={item.id} className="hover:bg-slate-50">
											<td className="px-4 py-3 text-slate-800">{item.subject}</td>
											<td className="px-4 py-3 text-slate-700">{item.requestOwner}</td>
											<td className="px-4 py-3 text-slate-700">{item.category}</td>
											<td className="px-4 py-3">
												<span className={statusPillClass(item.requestStatus)}>{item.requestStatus}</span>
											</td>
											<td className="px-4 py-3 text-right font-medium text-slate-900">INR {item.totalAmount}</td>
											<td className="px-4 py-3">
												{isPending ? (
													<div className="flex items-center gap-2">
														<button
															type="button"
															onClick={() => updateStatus(item.id, 'Approved')}
															className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
														>
															Approve
														</button>
														<button
															type="button"
															onClick={() => updateStatus(item.id, 'Rejected')}
															className="rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
														>
															Reject
														</button>
													</div>
												) : (
													<span className="text-xs text-slate-500">No action required</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</div>
	);
}

function statusPillClass(status) {
	const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
	if (status === 'Approved') return `${base} bg-emerald-100 text-emerald-700`;
	if (status === 'Rejected') return `${base} bg-rose-100 text-rose-700`;
	return `${base} bg-amber-100 text-amber-700`;
}
