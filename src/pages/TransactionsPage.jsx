import { useState, useMemo } from "react";
import { transactions, fin_categories, transTypes, categoryColors } from "@/data/mockData.js";
import { useAppContext } from "@/context/AppContext.jsx";
import {
    Search, ArrowUpDown, ArrowUp, ArrowDown,
    Plus, Pencil, X, Shield, Eye
} from "lucide-react";

// Helpers
function dateFormatter(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}

function amountFormatter(amount) {
    const abs = Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2 });
    return amount >= 0 ? `+$${abs}` : `-$${abs}`;
}


// Sub-components
function SortIcon({ col, sort }) {
    if (sort.col !== col) return <ArrowUpDown size={13} className="opacity-30" />;
    return sort.dir === "asc"
        ? <ArrowUp size={13} className="text-emerald-400" />
        : <ArrowDown size={13} className="text-emerald-400" />;
}

function CategoryBadge({ category }) {
    const colors = categoryColors[category] || { bg: "bg-gray-500/10", text: "text-gray-400" };
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5  font-semibold ${colors.text}`}>
            {category}
        </span>
    );
}

function TypeBadge({ type }) {
    const isIncome = type === "income";
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold capitalize
            ${isIncome ? "text-emerald-400" : "text-red-400"}`}>
            {type}
        </span>
    );
}

// Transaction Modal (Add / Edit)
function TransactionModal({ existing, onSave, onClose }) {
    const [form, setForm] = useState(
        existing ??
        {
            id: "",
            date: "",
            description: "",
            category: " ",
            type: "",
            amount: "",
            note: "",
        });

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = (e) => {
        e.preventDefault();
        const amount = parseFloat(form.amount);

        if (!form.date || !form.description || isNaN(amount)) return;


        const finalAmount = form.type === "expense" ? -Math.abs(amount) : Math.abs(amount);
        onSave({ ...form, amount: finalAmount, id: form.id || `txn_${Date.now()}` });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 "
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="fin-card rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold">{existing ? "Edit Transaction" : "Add Transaction"}</h2>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10 transition-colors fin-muted">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`fin-muted labelCls`}>Date</label>
                            <input type="date" className={`fin-border fin-card inputCLS`} required
                                value={form.date} onChange={e => set("date", e.target.value)} />
                        </div>
                        <div>
                            <label className={`fin-muted labelCls`}>Type</label>
                            <select className={`fin-border fin-card inputCLS`} value={form.type} onChange={e => set("type", e.target.value)}>
                                {transTypes.map(t => (
                                    <option key={t} value={t} className="capitalize">{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={`fin-muted labelCls`}>Description</label>
                        <input type="text" className={`fin-border fin-card inputCLS`} required placeholder="e.g. Weekly Groceries"
                            value={form.description} onChange={e => set("description", e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`fin-muted labelCls`}>Category</label>
                            <select className={`fin-border fin-card inputCLS`} value={form.category} onChange={e => set("category", e.target.value)}>
                                {fin_categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={`fin-muted labelCls`}>Amount ($)</label>
                            <input type="number" step="0.01" min="0.01" className={`fin-border fin-card inputCLS`} required
                                placeholder="0.00"
                                value={form.amount === "" ? "" : Math.abs(form.amount)}
                                onChange={e => set("amount", e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className={`fin-muted labelCls`}>Note <span className="normal-case font-normal">(optional)</span></label>
                        <input type="text" className={`fin-border fin-card inputCLS`} placeholder="Optional note..."
                            value={form.note} onChange={e => set("note", e.target.value)} />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold border fin-border fin-muted hover:bg-black/5 transition-colors">
                            Cancel
                        </button>
                        <button type="submit"
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors">
                            {existing ? "Save Changes" : "Add Transaction"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Main Page

export function TransactionsPage() {
    const { role } = useAppContext();
    const isAdmin = role === "admin";
    const [data, setData] = useState(transactions);

    // Filters & sort
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");
    const [sort, setSort] = useState({ col: "date", dir: "desc" });

    // Modal
    const [modal, setModal] = useState(null);

    // Derived list
    const visible = useMemo(() => {
        let list = [...data];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(t =>
                t.description.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                t.note?.toLowerCase().includes(q)
            );
        }
        if (filterType !== "all") list = list.filter(t => t.type === filterType);
        if (filterCategory !== "all") list = list.filter(t => t.category === filterCategory);

        list.sort((a, b) => {
            let av, bv;
            if (sort.col === "amount") { av = Math.abs(a.amount); bv = Math.abs(b.amount); }
            else if (sort.col === "date") { av = a.date; bv = b.date; }
            else { av = a[sort.col]; bv = b[sort.col]; }
            if (av < bv) return sort.dir === "asc" ? -1 : 1;
            if (av > bv) return sort.dir === "asc" ? 1 : -1;
            return 0;
        });

        return list;
    }, [data, search, filterType, filterCategory, sort]);

    // Handlers
    const toggleSort = (col) => {
        setSort(s => s.col === col
            ? { col, dir: s.dir === "asc" ? "desc" : "asc" }
            : { col, dir: "asc" }
        );
    };

    const handleSave = (txn) => {
        setData(prev => {
            const idx = prev.findIndex(t => t.id === txn.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = txn;
                return next;
            }
            return [txn, ...prev];
        });
        setModal(null);
    };

    // Column headers
    const columns = [
        { key: "date", label: "Date", sortable: true },
        { key: "description", label: "Description", sortable: false },
        { key: "category", label: "Category", sortable: true },
        { key: "type", label: "Type", sortable: true },
        { key: "amount", label: "Amount", sortable: true },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="page-title">Transactions</h1>
                    <p className="page-subtitle fin-muted">Income and Expense records.</p>
                </div>

            </div>

            {/* Controls card */}
            <div className="fin-card rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-48">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 fin-muted pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border fin-border fin-card focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        />
                    </div>

                    {/* Type filter */}
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="px-3 py-2 text-sm rounded-lg border fin-border fin-card focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all fin-muted capitalize">
                        <option value="all">All Types</option>
                        {transTypes.map(t => (
                            <option key={t} value={t} className="capitalize">{t}</option>
                        ))}
                    </select>

                    {/* Category filter */}
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="px-3 py-2 text-sm rounded-lg border fin-border fin-card focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all fin-muted">
                        <option value="all">All Categories</option>
                        {fin_categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {/* Admin: Add button */}
                    {isAdmin && (
                        <button
                            onClick={() => setModal({ mode: "add" })}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-colors ml-auto">
                            <Plus size={15} />
                            Add Transaction
                        </button>
                    )}
                </div>

                {/* Results count */}
                <p className="text-xs fin-muted mt-2.5">
                    Showing <span className="font-semibold">{visible.length}</span> of{" "}
                    <span className="font-semibold">{data.length}</span> transactions
                </p>
            </div>

            {/* Table */}
            <div className="fin-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b fin-border">
                                {columns.map(col => (
                                    <th key={col.key} className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider fin-muted select-none`}>
                                        {col.sortable ? (
                                            <button
                                                onClick={() => toggleSort(col.key)}
                                                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                                {col.label}
                                                <SortIcon col={col.key} sort={sort} />
                                            </button>
                                        ) : col.label}
                                    </th>
                                ))}
                                {isAdmin && (
                                    <th className={`px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider fin-muted select-none text-right`}>Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5}
                                        className="text-center py-16 fin-muted text-sm">
                                        No transactions match your filters.
                                    </td>
                                </tr>
                            ) : visible.map((txn, i) => {
                                const isIncome = txn.type === "income";
                                return (
                                    <tr key={txn.id}
                                        className={`border-b fin-border last:border-0 transition-colors
                                            ${i % 2 === 0 ? "" : "bg-black/[0.015]"}
                                            hover:bg-emerald-500/[0.03]`}>
                                        <td className="px-4 py-3.5 whitespace-nowrap fin-muted font-mono text-xs">
                                            {dateFormatter(txn.date)}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-medium leading-snug">{txn.description}</p>
                                            {txn.note && (
                                                <p className="text-xs fin-muted mt-0.5">{txn.note}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <CategoryBadge category={txn.category} />
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <TypeBadge type={txn.type} />
                                        </td>
                                        <td className={`px-4 py-3.5 font-semibold tabular-nums whitespace-nowrap
                                            ${isIncome ? "text-emerald-400" : "text-red-400"}`}>
                                            {amountFormatter(txn.amount)}
                                        </td>
                                        {isAdmin && (
                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => setModal({ mode: "edit", txn })}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs
                                                        font-semibold fin-muted border fin-border hover:border-emerald-500/40
                                                        hover:text-emerald-400 transition-all">
                                                    <Pencil size={12} />
                                                    Edit
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <TransactionModal
                    existing={modal.mode === "edit" ? modal.txn : null}
                    onSave={handleSave}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}