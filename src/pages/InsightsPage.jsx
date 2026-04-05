import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext.jsx";
import { account, getMonthlyTotals, getSpendingByCategory } from "@/data/mockData.js";
import { Target, TrendingUp, PiggyBank, Receipt, Lightbulb } from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// Insight calculations

function useInsights() {
    return useMemo(() => {
        const monthly = getMonthlyTotals();
        const spending = getSpendingByCategory();

        // Highest spending category
        const topCategory = spending[0] ?? { category: "N/A", total: 0 };

        // Month-over-month expense change (last two months)
        const momChange = (() => {
            if (monthly.length < 2) return null;
            const [prev, curr] = monthly.slice(-2);
            if (prev.expenses === 0) return null;
            return +(((curr.expenses - prev.expenses) / prev.expenses) * 100).toFixed(2);
        })();

        // Savings rate
        const totalIncome = account.income;
        const totalExpenses = account.expenses;
        const savingsRate = totalIncome > 0
            ? +(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(2)
            : 0;

        // Avg transaction value (expenses only)
        const expenseMonthly = monthly.map(m => m.expenses);
        const totalExpAmt = expenseMonthly.reduce((s, v) => s + v, 0);
        const avgExpense = monthly.length > 0 ? +(totalExpAmt / monthly.length).toFixed(2) : 0;

        // Key observations
        const observations = [
            `Your highest spending category is ${topCategory.category}.`,
            `You are saving ${savingsRate}% of your income.`,
            momChange !== null
                ? `Expenses ${momChange >= 0 ? "increased" : "decreased"} by ${Math.abs(momChange)}% compared to last month.`
                : "Not enough monthly data to compare expenses.",
            avgExpense > 0
                ? `Your average monthly expense spend is $${avgExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}.`
                : null,
        ].filter(Boolean);

        return { topCategory, momChange, savingsRate, avgExpense, monthly, observations };
    }, []);
}

// Stat card

function StatCard({ label, value, sub, icon: Icon, iconColor }) {
    return (
        <div className="fin-card flex-1 min-w-0 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest fin-muted">{label}</span>
            </div>
            <div>
                <p className="text-2xl font-bold tracking-tight leading-none">{value}</p>
                <p className="text-xs fin-muted mt-1.5">{sub}</p>
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="fin-card rounded-xl px-4 py-3 text-sm shadow-lg border fin-border">
            <p className="font-semibold mb-1.5">{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ color: p.color }} className="text-xs">
                    {p.name}: <span className="font-semibold">${p.value.toLocaleString()}</span>
                </p>
            ))}
        </div>
    );
}

export function InsightsPage() {
    const { topCategory, momChange, savingsRate, avgExpense, monthly, observations } = useInsights();

    const momAbs = momChange !== null ? Math.abs(momChange) : null;
    const momLabel = momChange === null ? "No prior month"
        : momChange >= 0 ? "Increase in spending" : "Decrease in spending";
    const momColor = momChange === null ? "text-zinc-400"
        : momChange >= 0 ? "text-red-400" : "text-emerald-400";

    const stats = [
        {
            label: "Highest Spend",
            value: topCategory.category,
            sub: `$${topCategory.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            icon: Target,
            iconColor: "fin-muted",
        },
        {
            label: "MoM Change",
            value: momAbs !== null ? `${momChange >= 0 ? "+" : "-"}${momAbs}%` : "N/A",
            sub: momLabel,
            icon: TrendingUp,
            iconColor: momColor,
        },
        {
            label: "Savings Rate",
            value: `${savingsRate}%`,
            sub: "Income saved",
            icon: PiggyBank,
            iconColor: "text-emerald-400",
        },
        {
            label: "Avg Monthly Expense",
            value: `$${avgExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            sub: "Per month",
            icon: Receipt,
            iconColor: "fin-muted",
        },
    ];

    const tickStyle = { fontSize: 11, fill: "var(--muted)" };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="page-title">Insights</h1>
            </div>

            {/* Stat cards row */}
            <div className="flex flex-wrap ">
                {stats.map(s => (
                    <StatCard key={s.label} {...s} />
                ))}
            </div>

            {/* Key Observations */}
            <div className="fin-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-1">
                    <Lightbulb size={16} className="fin-muted" strokeWidth={1.5} />
                    <p className="text-base font-semibold">Key Observations</p>
                </div>
                <p className="text-xs fin-muted mb-5">What we noticed about your finances recently</p>

                <div className="space-y-3">
                    {observations.map((obs, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-xl px-4 py-3.5"
                            style={{ background: "var(--bg)" }}>
                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                                text-[11px] font-bold fin-muted border fin-border">
                                {i + 1}
                            </span>
                            <p className="text-sm">{obs}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly Income vs Expenses bar chart */}
            <div className="fin-card rounded-2xl p-6">
                <p className="text-base font-semibold mb-6">Monthly Income vs Expenses</p>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthly} barCategoryGap="35%" barGap={3}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={tickStyle}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={tickStyle}
                                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--border)" }} />
                            <Legend
                                iconType="square"
                                iconSize={10}
                                wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
                            />
                            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}