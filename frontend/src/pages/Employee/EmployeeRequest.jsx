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
		timeline: ['Submitted', 'Manager Approved', 'Finance Pending'],
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
		timeline: ['Draft'],
	},
	{
		id: 3,
		employee: 'Aarav Sharma',
		description: 'Internet reimbursement',
		date: '2026-03-15',
		category: 'Utilities',
		remarks: 'Monthly remote work plan',
		amount: 1200,
		status: 'Rejected',
		receiptName: '',
		paidBy: 'company',
		timeline: ['Submitted', 'Manager Rejected'],
	},
];

export default function EmployeeRequest() {
	const [requests, setRequests] = useState(INITIAL_REQUESTS);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedIds, setSelectedIds] = useState([]);
	const [showCreatePage, setShowCreatePage] = useState(false);
	const [selectedExpenseId, setSelectedExpenseId] = useState(null);
	const [newReceiptFile, setNewReceiptFile] = useState(null);
	const [ocrState, setOcrState] = useState({ running: false, message: '', error: '' });
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
			.filter((item) => item.status === 'Submitted' || item.status === 'Pending')
			.reduce((sum, item) => sum + item.amount, 0);

		const approved = requests
			.filter((item) => item.status === 'Approved')
			.reduce((sum, item) => sum + item.amount, 0);

		return { toSubmit, waiting, approved };
	}, [requests]);

	const filteredRequests = useMemo(() => {
		const q = searchTerm.trim().toLowerCase();
		if (!q) return requests;
		return requests.filter((item) =>
			[item.employee, item.description, item.category, item.remarks, item.status]
				.join(' ')
				.toLowerCase()
				.includes(q)
		);
	}, [requests, searchTerm]);

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

	const handleToggleRow = (id) => {
		setSelectedIds((prev) =>
			prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]
		);
	};

	const handleToggleAll = () => {
		if (filteredRequests.length === 0) return;
		const filteredIds = filteredRequests.map((item) => item.id);
		const allSelected = filteredIds.every((id) => selectedIds.includes(id));
		setSelectedIds((prev) => {
			if (allSelected) return prev.filter((id) => !filteredIds.includes(id));
			return Array.from(new Set([...prev, ...filteredIds]));
		});
	};

	const handleNewRequestChange = (name, value) => {
		setNewRequest((prev) => ({ ...prev, [name]: value }));
	};

	const handleNewReceiptUpload = async (file) => {
		if (!file) return;
		setNewReceiptFile(file);
		handleNewRequestChange('receiptName', file.name);
		await applyOcrFromReceipt(file);
	};

	const applyOcrFromReceipt = async (file) => {
		if (!file) return;
		setOcrState({ running: true, message: 'Running OCR on receipt...', error: '' });
		try {
			const extracted = await runReceiptOcr(file);
			setNewRequest((prev) => ({
				...prev,
				description: prev.description || extracted.description || prev.description,
				category: extracted.category || prev.category,
				amount: prev.amount || extracted.amount || prev.amount,
				expenseDate: prev.expenseDate || extracted.expenseDate || prev.expenseDate,
				remarks: prev.remarks || extracted.remarks || prev.remarks,
			}));
			setOcrState({
				running: false,
				message: 'OCR complete. Fields auto-filled from receipt where available.',
				error: '',
			});
		} catch (error) {
			setOcrState({
				running: false,
				message: '',
				error: 'OCR failed. You can still enter details manually.',
			});
		}
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
				status: 'Pending',
				receiptName: newRequest.receiptName,
				paidBy: newRequest.paidBy,
				timeline: ['Submitted', 'Manager Pending'],
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
		setNewReceiptFile(null);
		setOcrState({ running: false, message: '', error: '' });
		setShowCreatePage(false);
	};

	const selectedExpense = selectedExpenseId
		? requests.find((item) => item.id === selectedExpenseId) || null
		: null;

	if (showCreatePage) {
		return (
			<div className="min-h-screen bg-slate-50 px-6 py-8">
				<div className="max-w-5xl mx-auto">
					<form onSubmit={handleSubmitNewRequest} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
						<div className="px-6 py-4 border-b border-slate-200 bg-slate-100 flex items-center justify-between gap-3">
							<h1 className="text-lg font-semibold text-slate-800">Create New Expense Request</h1>
							<div className="flex items-center gap-2">
								<label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
									Attach Receipt
									<input
										type="file"
										className="hidden"
										onChange={(e) => handleNewReceiptUpload(e.target.files?.[0])}
									/>
								</label>
								<button
									type="button"
									disabled={!newReceiptFile || ocrState.running}
									onClick={() => applyOcrFromReceipt(newReceiptFile)}
									className="rounded-lg border border-[#6b4c6a] bg-[#6b4c6a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#5a3f59] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{ocrState.running ? 'Reading...' : 'Run OCR'}
								</button>
							</div>
						</div>

						{newRequest.receiptName && (
							<div className="px-6 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-700">
								Attached: {newRequest.receiptName}
							</div>
						)}
						{ocrState.message && (
							<div className="px-6 py-2 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-700">
								{ocrState.message}
							</div>
						)}
						{ocrState.error && (
							<div className="px-6 py-2 bg-rose-50 border-b border-rose-100 text-xs text-rose-700">
								{ocrState.error}
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
								onClick={() => {
									setShowCreatePage(false);
									setOcrState({ running: false, message: '', error: '' });
								}}
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

	if (selectedExpense) {
		return (
			<div className="min-h-screen bg-[#f8f9fa] p-4 md:p-6">
				<div className="max-w-5xl mx-auto space-y-4">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-semibold text-gray-800">Expense Details</h1>
						<button
							type="button"
							onClick={() => setSelectedExpenseId(null)}
							className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Back to History
						</button>
					</div>

					<section className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<DetailRow label="Employee" value={selectedExpense.employee} />
						<DetailRow label="Status" value={mapStatusLabel(selectedExpense.status)} />
						<DetailRow label="Category" value={selectedExpense.category} />
						<DetailRow label="Date" value={selectedExpense.date} />
						<DetailRow label="Amount" value={`Rs ${selectedExpense.amount}`} />
						<DetailRow label="Paid By" value={selectedExpense.paidBy === 'company' ? 'Company' : `${selectedExpense.employee} (Self)`} />
						<DetailRow label="Description" value={selectedExpense.description} full />
						<DetailRow label="Remarks" value={selectedExpense.remarks || '-'} full />
						<DetailRow label="Receipt" value={selectedExpense.receiptName || 'No receipt uploaded'} full />
					</section>

					<section className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
						<h2 className="text-lg font-semibold text-gray-800">Approval Timeline</h2>
						<div className="mt-4 space-y-3">
							{(selectedExpense.timeline || []).map((step, index) => (
								<div key={`${step}-${index}`} className="flex items-start gap-3">
									<div className="mt-0.5 w-6 h-6 rounded-full bg-[#6b4c6a] text-white text-xs font-bold flex items-center justify-center">{index + 1}</div>
									<div className="rounded-md border border-gray-200 bg-[#f8f9fa] px-3 py-2 text-sm text-gray-700">{step}</div>
								</div>
							))}
						</div>
					</section>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f8f9fa] p-4 md:p-6 font-sans text-sm text-gray-800 flex justify-center">
			<div className="w-full max-w-[1400px] bg-white shadow-sm border border-gray-200 rounded-sm flex flex-col overflow-hidden">
				<div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 gap-4">
					<div className="flex items-center gap-4">
						<div className="flex rounded shadow-sm overflow-hidden">
							<button
								type="button"
								onClick={() => setShowCreatePage(true)}
								className="bg-[#6b4c6a] hover:bg-[#5a3f59] text-white px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none"
							>
								New
							</button>
							<button
								type="button"
								className="bg-[#6b4c6a] hover:bg-[#5a3f59] text-white px-2 py-1.5 text-sm border-l border-[#826081] transition-colors focus:outline-none"
								aria-label="More new request options"
							>
								<span className="inline-block text-[10px] leading-none">&#9662;</span>
							</button>
						</div>
						<div className="flex items-center gap-2 text-gray-700">
							<h1 className="text-lg font-medium tracking-tight">My Expenses</h1>
							<button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
								*
							</button>
						</div>
					</div>

					<div className="flex-1 max-w-md mx-auto w-full order-3 md:order-none mt-2 md:mt-0">
						<div className="relative">
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#6b4c6a] focus:border-[#6b4c6a] placeholder-gray-400 outline-none"
								placeholder="Search..."
							/>
							<div className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400">
								<span className="inline-block text-[10px] leading-none">&#9662;</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-4 text-sm text-gray-600 order-2 md:order-none">
						<span className="font-medium">
							{filteredRequests.length === 0 ? '0-0' : `1-${filteredRequests.length}`} / {filteredRequests.length}
						</span>
						<div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm">
							<button type="button" className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-400 border-r border-gray-300">{'<'}</button>
							<button type="button" className="px-2.5 py-1 bg-white hover:bg-gray-50 text-gray-600">{'>'}</button>
						</div>
						<div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm bg-gray-100">
							<button type="button" className="px-3 py-1.5 text-gray-700 hover:bg-gray-200">=</button>
						</div>
					</div>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-8 md:gap-24 py-6 border-b border-gray-200 bg-white">
					<div className="text-center flex flex-col items-center">
						<span className="text-[22px] font-bold text-[#6b4c6a] tracking-tight">Rs {summary.toSubmit}</span>
						<span className="text-[13px] font-semibold text-gray-700 mt-0.5">to submit</span>
					</div>
					<span className="text-2xl text-gray-700 hidden md:block">&gt;</span>
					<div className="text-center flex flex-col items-center">
						<span className="text-[22px] font-bold text-[#6b4c6a] tracking-tight">Rs {summary.waiting}</span>
						<span className="text-[13px] font-semibold text-gray-700 mt-0.5">under validation</span>
					</div>
					<span className="text-2xl text-gray-700 hidden md:block">&gt;</span>
					<div className="text-center flex flex-col items-center">
						<span className="text-[22px] font-bold text-[#6b4c6a] tracking-tight">Rs {summary.approved}</span>
						<span className="text-[13px] font-semibold text-gray-700 mt-0.5">to be reimbursed</span>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left whitespace-nowrap">
						<thead className="text-[13px] text-gray-800 font-semibold border-b-2 border-gray-100 bg-white">
							<tr>
								<th className="py-3 px-4 w-12 text-center">
									<input
										type="checkbox"
										className="rounded-sm border-gray-300 text-[#6b4c6a] focus:ring-[#6b4c6a] cursor-pointer"
										onChange={handleToggleAll}
										checked={filteredRequests.length > 0 && filteredRequests.every((item) => selectedIds.includes(item.id))}
									/>
								</th>
								<th className="py-3 px-4 font-semibold">Employee</th>
								<th className="py-3 px-4 font-semibold">Description</th>
								<th className="py-3 px-4 font-semibold">Date</th>
								<th className="py-3 px-4 font-semibold">Category</th>
								<th className="py-3 px-4 font-semibold">Remarks</th>
								<th className="py-3 px-4 font-semibold text-right">Amt</th>
								<th className="py-3 px-4 font-semibold">Paid By</th>
								<th className="py-3 px-4 font-semibold text-center">Status</th>
								<th className="py-3 px-4 font-semibold">Receipt</th>
							</tr>
						</thead>
						<tbody className="text-[13px] text-gray-600">
							{filteredRequests.map((item) => (
								<tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => setSelectedExpenseId(item.id)}>
									<td className="py-2.5 px-4 text-center">
										<input
											type="checkbox"
											className="rounded-sm border-gray-300 text-[#6b4c6a] focus:ring-[#6b4c6a] cursor-pointer"
											checked={selectedIds.includes(item.id)}
											onChange={() => handleToggleRow(item.id)}
											onClick={(e) => e.stopPropagation()}
										/>
									</td>
									<td className="py-2.5 px-4 text-gray-800 font-medium">{item.employee}</td>
									<td className="py-2.5 px-4 text-gray-800">{item.description}</td>
									<td className="py-2.5 px-4">{item.date}</td>
									<td className="py-2.5 px-4">{item.category}</td>
									<td className="py-2.5 px-4 text-gray-600 max-w-[220px] truncate" title={item.remarks}>{item.remarks}</td>
									<td className="py-2.5 px-4 text-right font-medium text-gray-800">Rs {item.amount}</td>
									<td className="py-2.5 px-4">
										<select
											value={item.paidBy}
											onChange={(e) => handlePaidByChange(item.id, e.target.value)}
											onClick={(e) => e.stopPropagation()}
											className="rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 outline-none focus:ring-1 focus:ring-[#6b4c6a] focus:border-[#6b4c6a]"
										>
											<option value="employee">{item.employee} (Self)</option>
											<option value="company">Company</option>
										</select>
									</td>
									<td className="py-2.5 px-4 text-center">
										<span className={statusPillClass(item.status)}>{mapStatusLabel(item.status)}</span>
									</td>
									<td className="py-2.5 px-4">
										<div className="flex items-center gap-3">
											<label className="inline-flex items-center gap-1.5 text-[#28a745] cursor-pointer hover:text-green-700 transition-colors font-medium">
												<span>Attach receipt</span>
												<input
													type="file"
													className="hidden"
													onChange={(e) => handleReceiptUpload(item.id, e.target.files?.[0])}
													onClick={(e) => e.stopPropagation()}
												/>
											</label>
											<span className="text-gray-400">|</span>
											<span className="text-xs text-gray-500 truncate max-w-[120px]" title={item.receiptName || 'No receipt uploaded'}>
												{item.receiptName || 'No file'}
											</span>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

function statusPillClass(status) {
	const base = 'inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold min-w-[80px]';
	if (status === 'Approved') return `${base} bg-[#20c997] text-white`;
	if (status === 'Submitted' || status === 'Pending') return `${base} bg-[#17a2b8] text-white`;
	if (status === 'Rejected') return `${base} bg-[#dc3545] text-white`;
	return `${base} bg-[#6c757d] text-white`;
}

function mapStatusLabel(status) {
	if (status === 'Draft') return 'To Submit';
	if (status === 'Submitted') return 'Pending';
	return status;
}

function DetailRow({ label, value, full = false }) {
	return (
		<div className={full ? 'md:col-span-2' : ''}>
			<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
			<p className="mt-1 text-sm text-gray-800">{value}</p>
		</div>
	);
}

async function runReceiptOcr(file) {
	// Backend OCR integration stub (recommended production flow):
	// const formData = new FormData();
	// formData.append('receipt', file);
	// const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
	// const response = await fetch(`${baseUrl}/ocr/receipt`, { method: 'POST', body: formData });
	// if (!response.ok) throw new Error('OCR API failed');
	// const data = await response.json();
	// return {
	//   description: data.description,
	//   category: data.category,
	//   amount: data.amount,
	//   expenseDate: data.expenseDate,
	//   remarks: data.remarks,
	// };

	let rawText = '';
	if (file.type.startsWith('text/')) {
		rawText = await file.text();
	}

	const combined = `${file.name} ${rawText}`.toLowerCase();
	const amount = parseAmount(combined);
	const expenseDate = parseDate(combined);
	const category = inferCategory(combined);

	return {
		description: buildDescription(file.name),
		category,
		amount: amount ? String(amount) : '',
		expenseDate,
		remarks: rawText ? `OCR note: text extracted from ${file.name}` : `OCR note: parsed from filename ${file.name}`,
	};
}

function parseAmount(text) {
	const match = text.match(/(?:rs|inr|usd|eur|amount)?\s*([0-9]{1,6}(?:\.[0-9]{1,2})?)/i);
	return match ? Number(match[1]) : null;
}

function parseDate(text) {
	const ymd = text.match(/(20\d{2})[-_/](0?[1-9]|1[0-2])[-_/](0?[1-9]|[12]\d|3[01])/);
	if (ymd) {
		const y = ymd[1];
		const m = ymd[2].padStart(2, '0');
		const d = ymd[3].padStart(2, '0');
		return `${y}-${m}-${d}`;
	}
	const dmy = text.match(/(0?[1-9]|[12]\d|3[01])[-_/](0?[1-9]|1[0-2])[-_/](20\d{2})/);
	if (dmy) {
		const d = dmy[1].padStart(2, '0');
		const m = dmy[2].padStart(2, '0');
		const y = dmy[3];
		return `${y}-${m}-${d}`;
	}
	return '';
}

function inferCategory(text) {
	if (/(flight|taxi|cab|train|travel|fuel|metro)/.test(text)) return 'Travel';
	if (/(internet|wifi|mobile|utility|electricity)/.test(text)) return 'Utilities';
	if (/(meal|food|dinner|lunch|breakfast)/.test(text)) return 'Meals';
	if (/(stationery|supply|printer|paper)/.test(text)) return 'Supplies';
	return 'Other';
}

function buildDescription(filename) {
	const base = filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
	if (!base) return 'Expense from uploaded receipt';
	return `Expense: ${base}`;
}
