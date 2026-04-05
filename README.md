# Zorvyn Finance Dashboard

A finance dashboard website built with **React** and **Tailwind CSS**. It provides users with a graphic view of their financial health, transaction records, and expressionable insights.

![Finance Dashboard Overview](https://res.cloudinary.com/duqj7bubb/image/upload/v1775398663/Screenshot_2026-04-05_151730_mj6og9.png)

## Setup Instructions

1. **Clone or Download the Repository**
2. **Install Dependencies**
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```
3. **Run the Development Server**
   ```bash
   npm run dev
   ```
4. **View the Application**
   Open your browser and navigate to the local URL provided in the terminal (typically `http://localhost:5173`).

## Overview of Approach

The project is structured to offer maximum flexibility and maintainability on the front end while simulating a functional backend:

- **Component-Driven**: Uses functional React components with hooks. Reusable visual components (buttons, badges).
- **Context API for Global State**: A central `AppContext` manages application-wide settings such as User Roles and the active Theme. These settings are stored in `localStorage` to presist sessions.
- **Data Simulation via Mock Data**: I made use of a file called, `mockData.js`. This file provides all base level data needed (transactions, categories, account details) and includes reusable utility functions that generate other aggregated data (e.g., spending by category, monthly totals). These utilities are used to produce the charts and insight modules.

## Explanation of Features

### 1. Dashboard (`/`)
The primary entry point, providing an at-a-glance view of your financial standing:
- **Summary Cards**: Quick stats for Current Balance, Total Income, Total Expenses, and Net Savings, highlighting month-over-month (MoM) percentage comparisons.
- **Interactive Charts**: Used the popular `recharts` package to display an Area Chart showing Balance Trends and a detailed Pie Chart breaking down spending by category.

### 2. Transactions Page (`/transactions`)
A table view managing all financial records:
- **Search & Filters**: Users can find specific transactions via full-text search, Income/Expense dropdown, and Category dropdown.
- **Sorting**: Toggle ascending/descending order by clicking on column headers (Date, Category, Type, Amount).
- **Role-Based Permissions**: 
  - **Admin**: Can click "Add Transaction" or "Edit" to input or edit any transaction.
  - **Viewer**: read-only access to all transactions.

### 3. Insights Page (`/insights`)
An analysis view that calculates and displays key financial insights based on transaction data:

- **Key Metrics Row**: Computed metrics displayed in stat cards:
  - **Highest Spend**: Determined by aggregating expense transactions by category using `getSpendingByCategory()`, which sums absolute amounts per category and sorts descending then displays the top category and its total spend to the user.
  - **MoM Change**: Calculates month-over-month expense percentage change by comparing the last two months' totals from `getMonthlyTotals()`; shows positive/negative change.
  - **Savings Rate**: Computed as `(totalIncome - totalExpenses) / totalIncome * 100` using account-level totals.
  - **Avg Monthly Expense**: Calculated by summing monthly expense totals from `getMonthlyTotals()` and dividing by the number of months, providing an average spend per month.

- **Auto-generated Observations**: Text-based insights made from the calculated metrics, including highest spending category, savings rate, MoM expense change (could be more detailed if sufficient data exists), and average monthly expense. It is also filtered to remove null values and presented in a numbered list.

- **Income vs. Expenses Visualization**: A bar chart rendered using Recharts' `BarChart` component, plotting monthly income and expense data from `getMonthlyTotals()` across consecutive months.

### 4. Application Shell Layout
- **Sidebar Navigation**: Routing links, and user account/roles information.
- **Integrated Switchers**: Users can swap between Light/Dark mode and Admin/Viewer roles. 

## Technologies Used
* **React** (Vite build setup)
* **Tailwind CSS** (for styling)
* **Recharts** (for data visualizations)
* **Lucide React** (SVG icons)
* **React Router DOM** (for client-side routing)
