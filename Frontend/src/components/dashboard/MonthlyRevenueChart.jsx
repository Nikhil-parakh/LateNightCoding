import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MonthlyRevenueChart = ({ data }) => {
  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="#2a2a2a" />
          <XAxis dataKey="month" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#a855f7"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyRevenueChart;
