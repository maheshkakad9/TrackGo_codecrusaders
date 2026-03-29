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
		paidBy: 'employee',
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
		paidBy: 'employee',
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
		paidBy: 'company',
	},
];

export default function EmployeeRequest() {
	const [requests, setRequests] = useState(INITIAL_REQUESTS);
	const [showCreatePage, setShowCreatePage] = useState(false);
	const [newRequest, setNewRequest] = useState({
		receiptName: '',
		description: '',
		category: 'Travel',
		amount: '',
		currency: 'INR',
		expenseDate: '',
		paidBy: 'employee',
		remarks: '',
	});

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

	const handlePaidByChange = (id, value) => {
		setRequests((prev) =>
			prev.map((item) => (item.id === id ? { ...item, paidBy: value } : item))
		);
	};

	const handleNewRequestChange = (name, value) => {
		setNewRequest((prev) => ({ ...prev, [name]: value }));
	};

	const handleNewReceiptUpload = (file) => {
		if (!file) return;
		handleNewRequestChange('receiptName', file.name);
	};

	const handleSubmitNewRequest = (e) => {
		e.preventDefault();
		if (!newRequest.description.trim()) return;

		setRequests((prev) => [
			{
				id: Date.now(),
				employee: 'Aarav Sharma',
				description: newRequest.description.trim(),
				date: newRequest.expenseDate || new Date().toISOString().slice(0, 10),
				category: newRequest.category,
				remarks: newRequest.remarks.trim(),
				amount: Number(newRequest.amount || 0),
				status: 'Draft',
				receiptName: newRequest.receiptName,
				paidBy: newRequest.paidBy,
			},
			...prev,
		]);

		setNewRequest({
			receiptName: '',
			description: '',
			category: 'Travel',
			amount: '',
			currency: 'INR',
			expenseDate: '',
			paidBy: 'employee',
			remarks: '',
		});
		setShowCreatePage(false);
	};

	if (showCreatePage) {
		return (
			<div className="min-h-screen bg-slate-50 px-6 py-8">
				<div className="max-w-5xl mx-auto">
					<form onSubmit={handleSubmitNewRequest} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
						<div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between gap-3">
							<h1 className="text-lg font-semibold text-slate-800">Create New Expense Request</h1>
							<label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
								Attach Receipt
								<input
									type="file"
									className="hidden"
									onChange={(e) => handleNewReceiptUpload(e.target.files?.[0])}
								/>
							</label>
						</div>

						{newRequest.receiptName && (
							<div className="px-6 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700">
								Attached: {newRequest.receiptName}
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6">
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
									<input
										type="text"
										value={newRequest.description}
										onChange={(e) => handleNewRequestChange('description', e.target.value)}
										required
										className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
									<select
										value={newRequest.category}
										onChange={(e) => handleNewRequestChange('category', e.target.value)}
										className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
									>
										<option value="Travel">Travel</option>
										<option value="Supplies">Supplies</option>
										<option value="Utilities">Utilities</option>
										<option value="Meals">Meals</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">Expense Date</label>
									<input
										type="date"
										value={newRequest.expenseDate}
										onChange={(e) => handleNewRequestChange('expenseDate', e.target.value)}
										className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
									/>
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">Total Amount Paid</label>
									<div className="grid grid-cols-3 gap-2">
										<select
											value={newRequest.currency}
											onChange={(e) => handleNewRequestChange('currency', e.target.value)}
											className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
										>
											<option value="INR">INR</option>
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
										</select>
										<input
											type="number"
											value={newRequest.amount}
											onChange={(e) => handleNewRequestChange('amount', e.target.value)}
											placeholder="0"
											min="0"
											step="0.01"
											className="col-span-2 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">Paid By</label>
									<select
										value={newRequest.paidBy}
										onChange={(e) => handleNewRequestChange('paidBy', e.target.value)}
										className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
									>
										<option value="employee">Aarav Sharma (Self)</option>
										<option value="company">Company</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">Remarks</label>
									<textarea
										rows={4}
										value={newRequest.remarks}
										onChange={(e) => handleNewRequestChange('remarks', e.target.value)}
										className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none"
									/>
								</div>
							</div>
						</div>

						<div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
							<button
								type="button"
								onClick={() => setShowCreatePage(false)}
								className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 px-6 py-8">
			<div className="max-w-7xl mx-auto space-y-6">
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => setShowCreatePage(true)}
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
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Paid By</th>
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
											<select
												value={item.paidBy}
												onChange={(e) => handlePaidByChange(item.id, e.target.value)}
												className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
											>
												<option value="employee">{item.employee} (Self)</option>
												<option value="company">Company</option>
											</select>
										</td>
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
