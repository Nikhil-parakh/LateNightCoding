import { useLocation } from "react-router-dom";
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
import { useEffect, useState } from "react";
import axios from "axios";

const UserCharts = () => {
  const location = useLocation();
  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState(false);
  const selectedCharts = location.state?.charts || [];

  const fetchCharts = async (charts) => {
    if (charts.length === 0) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/employee/generate-charts",
        {
          charts: charts,
          filter: {
            type: "year",
            year: 2025,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setChartsData(res.data.charts);
    } catch (error) {
      console.error("Chart fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCharts.length > 0) {
      fetchCharts(selectedCharts);
    }
  }, [selectedCharts]);

  const formatChartData = (chart) => {
    if (!chart) return [];

    return chart.labels.map((label, index) => ({
      label,
      value: chart.data[index],
    }));
  };

  return (
    <UserLayout>
      {loading && <p>Loading charts...</p>}
      <h1 className="dashboard-title">Sales Analytics</h1>
      <p className="dashboard-subtitle">
        Visual insights from uploaded sales data
      </p>

      {chartsData.revenue_over_time && (
        <div className="table-card" style={{ marginBottom: "30px" }}>
          <h3>Revenue Over Time</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formatChartData(chartsData.revenue_over_time)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartsData.sales_by_state && (
        <div className="table-card" style={{ marginBottom: "30px" }}>
          <h3>Sales by State</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatChartData(chartsData.sales_by_state)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="value" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartsData.top_10_products && (
        <div className="table-card">
          <h3>Top 10 Products</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatChartData(chartsData.top_10_products)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </UserLayout>
  );
};

export default UserCharts;
