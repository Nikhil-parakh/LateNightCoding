import { useLocation } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#ef4444", "#8b5cf6"];

const chartConfig = {
  revenue_over_time: {
    type: "line",
    title: "Revenue Over Time",
    color: "#2563eb",
  },
  sales_volume_over_time: {
    type: "line",
    title: "Sales Volume Over Time",
    color: "#10b981",
  },
  sales_by_state: {
    type: "bar",
    title: "Sales by State",
    color: "#14b8a6",
  },
  top_10_products: {
    type: "bar",
    title: "Top 10 Products",
    color: "#f59e0b",
  },
  category_performance: {
    type: "bar",
    title: "Category Performance",
    color: "#6366f1",
  },
  online_vs_offline: {
    type: "pie",
    title: "Online vs Offline Sales",
  },
  payment_mode_distribution: {
    type: "pie",
    title: "Payment Mode Distribution",
  },
};

const UserCharts = () => {
  const location = useLocation();

  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState(false);

  // safer parsing
  const selectedCharts = location.state?.charts || [];

  const fetchCharts = async (charts) => {
    if (!charts || charts.length === 0) return;

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/employee/generate-charts",
        {
          charts,
          filter: { type: "year", year: 2025 },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setChartsData(res.data.charts || {});
    } catch (error) {
      console.error("Chart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCharts && selectedCharts.length > 0) {
      fetchCharts(selectedCharts);
    }
  }, []);

  const formatChartData = (chart) => {
    if (!chart || !chart.labels) return [];

    // case 1 dataset format
    if (chart.datasets) {
      return chart.labels.map((label, index) => ({
        label,
        value: chart.datasets?.[0]?.data?.[index] ?? 0,
      }));
    }

    // case 2 simple data format
    if (chart.data) {
      return chart.labels.map((label, index) => ({
        label,
        value: chart.data?.[index] ?? 0,
      }));
    }

    return [];
  };

  const renderChart = (chartKey) => {
    const config = chartConfig[chartKey];
    const chart = chartsData[chartKey];

    if (!config || !chart) return null;

    const data = formatChartData(chart);

    return (
      <div key={chartKey} className="table-card chart-item">
        <h3>{config.title}</h3>

        <ResponsiveContainer width="100%" height={300}>
          {config.type === "line" && (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={config.color}
                strokeWidth={3}
              />
            </LineChart>
          )}

          {config.type === "bar" && (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={config.color} />
            </BarChart>
          )}

          {config.type === "pie" && (
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <UserLayout>
      {loading && <p>Loading charts...</p>}

      <h1 className="dashboard-title">Sales Analytics</h1>
      <p className="dashboard-subtitle">
        Visual insights from uploaded sales data
      </p>

      {/* CHART GRID */}
      <div className="chart-grid">
        {Object.keys(chartsData).map((chartKey) => renderChart(chartKey))}
      </div>
    </UserLayout>
  );
};

export default UserCharts;
