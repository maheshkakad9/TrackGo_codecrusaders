import { useMemo, useState } from 'react';

const INITIAL_REQUESTS = [
	{
		id: 1,
		employee: 'Aarav Sharma',
		description: 'Client visit travel reimbursement',
		date: '2026-03-22',
		category: 'Travel',
		remarks: 'Metro and cab bills attached',
		amount: 1850,
		status: 'Submitted',
		receiptName: '',
	},
	{
		id: 2,
		employee: 'Aarav Sharma',
		description: 'Office supplies for team',
		date: '2026-03-20',
		category: 'Supplies',
		remarks: 'Printer paper and markers',
		amount: 920,
		status: 'Draft',
		receiptName: '',
	},
	{
		id: 3,
		employee: 'Aarav Sharma',
		description: 'Internet reimbursement',
		date: '2026-03-15',
		category: 'Utilities',
		remarks: 'Monthly remote work plan',
		amount: 1200,
		status: 'Approved',
		receiptName: '',
	},
];

export default function EmployeeRequest() {
	const [requests, setRequests] = useState(INITIAL_REQUESTS);

	const summary = useMemo(() => {
		const toSubmit = requests
			.filter((item) => item.status === 'Draft')
			.reduce((sum, item) => sum + item.amount, 0);

		const waiting = requests
			.filter((item) => item.status === 'Submitted')
			.reduce((sum, item) => sum + item.amount, 0);

		const approved = requests
			.filter((item) => item.status === 'Approved')
			.reduce((sum, item) => sum + item.amount, 0);

		return { toSubmit, waiting, approved };
	}, [requests]);

	const handleReceiptUpload = (id, file) => {
		if (!file) return;
		setRequests((prev) =>
			prev.map((item) => (item.id === id ? { ...item, receiptName: file.name } : item))
		);
	};

	return (
		<div className="min-h-screen bg-slate-50 px-6 py-8">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<div className="flex items-center gap-3">
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
						>
							+ New Request
						</button>

						<label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
							Upload Receipt
							<input type="file" className="hidden" />
						</label>
					</div>
					<h1 className="text-xl font-semibold text-slate-900">Employee Reimbursement Requests</h1>
				</div>

				<section className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
						<p className="text-xs font-medium uppercase tracking-wide text-amber-700">Rs to submit</p>
						<p className="mt-2 text-2xl font-bold text-amber-900">Rs {summary.toSubmit}</p>
					</div>

					<div className="rounded-xl border border-sky-200 bg-sky-50 px-5 py-4">
						<p className="text-xs font-medium uppercase tracking-wide text-sky-700">Rs waiting for approval</p>
						<p className="mt-2 text-2xl font-bold text-sky-900">Rs {summary.waiting}</p>
					</div>

					<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
						<p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Rs approved</p>
						<p className="mt-2 text-2xl font-bold text-emerald-900">Rs {summary.approved}</p>
					</div>
				</section>

				<section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
					<div className="border-b border-slate-200 px-5 py-3 bg-slate-100">
						<h2 className="text-sm font-semibold text-slate-700">Employee Requests for Reimbursement Details</h2>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead className="bg-slate-50 border-b border-slate-200">
								<tr>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Employee</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Description</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Date</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Category</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Remarks</th>
									<th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Amt</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Receipt</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-slate-200">
								{requests.map((item) => (
									<tr key={item.id} className="hover:bg-slate-50">
										<td className="px-4 py-3 text-slate-700">{item.employee}</td>
										<td className="px-4 py-3 text-slate-700">{item.description}</td>
										<td className="px-4 py-3 text-slate-700">{item.date}</td>
										<td className="px-4 py-3 text-slate-700">{item.category}</td>
										<td className="px-4 py-3 text-slate-600">{item.remarks}</td>
										<td className="px-4 py-3 text-right font-medium text-slate-900">Rs {item.amount}</td>
										<td className="px-4 py-3">
											<span className={statusPillClass(item.status)}>{item.status}</span>
										</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<label className="inline-flex items-center rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
													Upload
													<input
														type="file"
														className="hidden"
														onChange={(e) => handleReceiptUpload(item.id, e.target.files?.[0])}
													/>
												</label>
												<span className="text-xs text-slate-500 truncate max-w-[150px]" title={item.receiptName || 'No receipt uploaded'}>
													{item.receiptName || 'No file'}
												</span>
											</div>
										</td>
									</tr>
								))}
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
	if (status === 'Submitted') return `${base} bg-sky-100 text-sky-700`;
	return `${base} bg-amber-100 text-amber-700`;
}
