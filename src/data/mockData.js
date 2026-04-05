// This file provides mock data for the entire web application to simulate returns from a backend API.

export const fin_categories = [
    "Food",
    "Mortgage",
    "Transport",
    "Salary",
    "Entertainment",
    "Utilities",
    "Freelance",
    "Healthcare",
    "Dining",
    "Shopping",
];

// Color palette cycled over fin_categories in order
const categoryColorPallete = [
    { bg: "bg-cyan-500/10", text: "text-cyan-400" },
    { bg: "bg-zinc-500/10", text: "text-zinc-400" },
    { bg: "bg-violet-500/10", text: "text-violet-400" },
    { bg: "bg-teal-500/10", text: "text-teal-400" },
    { bg: "bg-blue-500/10", text: "text-blue-400" },
    { bg: "bg-amber-500/10", text: "text-amber-400" },
    { bg: "bg-indigo-500/10", text: "text-indigo-400" },
    { bg: "bg-emerald-500/10", text: "text-emerald-400" },
    { bg: "bg-rose-500/10", text: "text-red-400" },
    { bg: "bg-red-500/10", text: "text-red-400" },
];

export const categoryColors = Object.fromEntries(
    fin_categories.map((cat, i) => [cat, categoryColorPallete[i % categoryColorPallete.length]])
);

export const transTypes = ["income", "expense"];

// Account
export const account = {
    id: "zyn_acc_001",
    owner: "Kenechukwu Ajufo",
    initials: "KA",
    currency: "USD",
    balance: 14_832.50,
    income: 24_200.00,
    expenses: 9_367.50,
};

// Transactions

export const transactions = [
    { id: "trans_001", date: "2026-03-15", description: "XBOXs Game Testing", category: "Freelance", type: "income", amount: 6033.75, note: "Big Client project" },
    { id: "trans_002", date: "2026-03-12", description: "Weekly Groceries", category: "Food", type: "expense", amount: -260.23, note: "" },
    { id: "trans_003", date: "2026-03-10", description: "Paying Mortgage", category: "Mortgage", type: "expense", amount: -1850.00, note: "March specifically" },
    { id: "trans_004", date: "2026-03-08", description: "Spotify & Google Premium", category: "Entertainment", type: "expense", amount: -15.99, note: "" },
    { id: "trans_005", date: "2026-03-03", description: "Filled up tank", category: "Transport", type: "expense", amount: -38.50, note: "" },
    { id: "trans_006", date: "2026-02-28", description: "Amazon Prime", category: "Entertainment", type: "expense", amount: -15.99, note: "" },
    { id: "trans_007", date: "2026-02-25", description: "New Solar Batteries", category: "Utilities", type: "expense", amount: -133.90, note: "" },
    { id: "trans_008", date: "2026-02-15", description: "Dental Checkup", category: "Healthcare", type: "expense", amount: -65.00, note: "" },
    { id: "trans_009", date: "2026-02-11", description: "Nosta Cafe", category: "Dining", type: "expense", amount: -28.40, note: "" },
    { id: "trans_010", date: "2026-02-05", description: "Electricity Bill", category: "Utilities", type: "expense", amount: -120.00, note: "" },
    { id: "trans_011", date: "2026-02-01", description: "Salary", category: "Salary", type: "income", amount: 4500.00, note: "" },
    { id: "trans_012", date: "2026-01-28", description: "KFC", category: "Dining", type: "expense", amount: -22.75, note: "" },
    { id: "trans_013", date: "2026-01-22", description: "Bought Bruno Mars Tickets", category: "Entertainment", type: "expense", amount: -32.00, note: "" },
    { id: "trans_014", date: "2026-01-20", description: "Cough Medicine", category: "Healthcare", type: "expense", amount: -35.20, note: "" },
    { id: "trans_015", date: "2026-01-15", description: "Monthly Withdrawal", category: "Freelance", type: "income", amount: 2982.91, note: "" },
    { id: "trans_016", date: "2026-01-05", description: "Marty Supreme with some friends", category: "Entertainment", type: "expense", amount: -56.44, note: "" },
    { id: "trans_017", date: "2026-01-01", description: "Salary", category: "Salary", type: "income", amount: 4500.00, note: "Monthly salary" },
];


// Returns only expense transactions
export const getExpenses = () => transactions.filter(t => t.type === "expense");


// Returns totals grouped by category
export const getSpendingByCategory = () => {
    const map = {};
    getExpenses().forEach(t => {
        map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map)
        .map(([category, total]) => ({ category, total: +total.toFixed(2) }))
        .sort((a, b) => b.total - a.total);
};

// Returns monthly income and expense totals
export const getMonthlyTotals = () => {
    const map = {};
    transactions.forEach(t => {
        const month = t.date.slice(0, 7);

        if (!map[month]) {
            map[month] = {
                month,
                income: 0,
                expenses: 0
            }
        }

        if (t.type === "income") {
            map[month].income += t.amount
        }

        if (t.type === "expense") {
            map[month].expenses += Math.abs(t.amount)
        }
    });
    return Object.values(map)
        .sort((a, b) => a.month.localeCompare(b.month))
        .map(m => ({
            ...m,
            income: +m.income.toFixed(2),
            expenses: +m.expenses.toFixed(2)
        }));
};
