import AppLayout from "./pages/AppLayout.jsx";
import { Routes, Route } from 'react-router-dom';
import { InsightsPage } from "@/pages/InsightsPage.jsx";
import { TransactionsPage } from "@/pages/TransactionsPage.jsx";
import { DashboardPage } from "@/pages/DashboardPage.jsx";

function App() {
  return (
    <div className={` w-full h-full m-0 `}>
      <Routes >
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path={`*`} element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;