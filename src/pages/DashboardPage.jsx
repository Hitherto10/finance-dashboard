import { account, getMonthlyTotals, getSpendingByCategory } from "@/data/mockData.js";
import { useAppContext } from "@/context/AppContext.jsx";
import { TrendingUp, TrendingDown, Wallet, ArrowDownLeft } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

// "vs last month" comparison from monthly totals
function getCompare(key) {
    const months = getMonthlyTotals();

    if (months.length < 2) return null;

    const [prev, curr] = months.slice(-2);
    const comparison = ((curr[key] - prev[key]) / prev[key]) * 100;

    return comparison.toFixed(1);
}

const netSavings = account.income - account.expenses;
const savingsRate = +((netSavings / account.income) * 100).toFixed(1);

const overview = [
    {
        label: "Current Balance",
        value: `$${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        comparison: "2.5",
        icon: Wallet,
        accent: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        label: "Total Income",
        value: `$${account.income.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        comparison: getCompare("income"),
        icon: TrendingUp,
        accent: "text-sky-400",
        bg: "bg-sky-400/10",
    },
    {
        label: "Total Expenses",
        value: `$${account.expenses.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        comparison: getCompare("expenses"),
        icon: ArrowDownLeft,
        accent: "text-red-400",
        bg: "bg-rose-400/10",
        negativeIsBad: true,
    },
    {
        label: "Net Savings",
        value: `$${netSavings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        comparison: savingsRate,
        comparisonLabel: "% of income",
        icon: TrendingDown,
        accent: "text-violet-400",
        bg: "bg-violet-400/10",
    },
];

function ComparisonBadge({ comparison, negativeIsBad = false, label = "% vs last month" }) {
    if (comparison === null || comparison === undefined) return null;
    const isPositive = comparison >= 0;
    const isGood = negativeIsBad ? !isPositive : isPositive;
    return (
        <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${isGood
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-red-500"
                }`}
        >
            {isPositive ? "+" : ""}{comparison}{label}
        </span>
    );
}

function StatCard({ label, value, comparison, comparisonLabel, icon: Icon, accent, bg, negativeIsBad }) {
    return (
        <div className="fin-card flex-1 p-5 flex flex-col gap-3 min-w-0">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest fin-muted">{label}</span>
            </div>
            <div className="flex items-end gap-2.5 flex-wrap">
                <span className="text-2xl font-bold tracking-tight leading-none">{value}</span>
                <ComparisonBadge comparison={comparison} negativeIsBad={negativeIsBad} label={comparisonLabel ?? "% vs last mo."} />
            </div>
        </div>
    );
}

const table_colors = {
    "Entertainment": "#3B82F6",
    "Healthcare": "#10B981",
    "Shopping": "#EF4444",
    "Utilities": "#F59E0B",
    "Transport": "#8B5CF6",
    "Food": "#06B6D4",
    "Salary": "#2ECC9A",
    "Freelance": "#6366F1",
    "Dining": "#F43F5E",
    "Mortgage": "#71717A",
};

export function DashboardPage() {
    const { dark } = useAppContext();
    const monthlyData = getMonthlyTotals();
    const spendingData = getSpendingByCategory();

    let runningBalance = account.balance - 5000;
    const trendData = monthlyData.map(m => {
        runningBalance += (m.income - m.expenses);
        return {
            name: m.month,
            balance: +runningBalance.toFixed(2)
        };
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="page-title">Overview</h1>
            </div>

            {/* Overview Section */}
            <div className={`fin-card rounded-2xl p-6 ${dark ? "dark-mode" : ""}`}>
                <div className="mb-4">
                    <p className="text-lg font-semibold">Summary</p>
                    <p className="text-xs font-semibold text-red-400">Data might not add up when calculated (fake MOCK data)</p>
                </div>
                <div className="flex flex-wrap">
                    {overview.map(stat => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6 h-225 lg:h-130">

                {/* Balance Trend */}
                <div className="fin-card  rounded-2xl p-6 flex flex-col">
                    <p className="text-lg font-semibold mb-6">Balance Trend</p>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: 'var(--muted)' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: 'var(--muted)' }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}
                                    itemStyle={{ color: 'var(--text)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="balance"
                                    stroke="#3B82F6"
                                    fillOpacity={1}
                                    fill="url(#colorBalance)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Spending Breakdown */}
                <div className="fin-card rounded-2xl p-6 flex flex-col">
                    <p className="text-lg font-semibold mb-6">Spending Breakdown</p>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={spendingData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="total"
                                    nameKey="category"
                                >
                                    {spendingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={table_colors[entry.category] || "#CBD5E1"} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="rect"
                                    wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}