import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type ChartDataPoint = {
  date: string;
  sales: number;
  revenue: number;
};

type Props = {
  data: ChartDataPoint[];
};

// 🔹 Custom Tooltip
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-300 rounded-md shadow p-2 text-sm">
        <p className="font-semibold text-gray-700">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-600">
            {entry.name === "Revenue"
              ? `${entry.name}: ₹${entry.value.toLocaleString()}`
              : `${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SalesRevenueChart = ({ data }: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Sales & Revenue Overview
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fill: "#374151" }} />
          <YAxis tick={{ fill: "#374151" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Sales"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Revenue"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesRevenueChart;
