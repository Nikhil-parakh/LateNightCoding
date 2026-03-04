import UserLayout from "../../layouts/UserLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", sales: 400, revenue: 2400 },
  { month: "Feb", sales: 300, revenue: 1398 },
  { month: "Mar", sales: 500, revenue: 3800 },
  { month: "Apr", sales: 278, revenue: 2000 },
  { month: "May", sales: 600, revenue: 4300 },
];

const UserCharts = () => {
  return (
    <UserLayout>
      <h1 className="dashboard-title">Sales Analytics</h1>
      <p className="dashboard-subtitle">
        Visual insights from uploaded sales data
      </p>

      {/* SALES LINE CHART */}
      <div className="table-card" style={{ marginBottom: "30px" }}>
        <h3>Monthly Sales</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* REVENUE BAR CHART */}
      <div className="table-card">
        <h3>Revenue Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </UserLayout>
  );
};

export default UserCharts;
