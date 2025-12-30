import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  dropout: "#ef4444",
  enrolled: "#facc15",
  graduate: "#22c55e",
};

// ✅ Parent-friendly labels
const LABELS = {
  dropout: "Needs Immediate Attention",
  enrolled: "On Track (Monitor)",
  graduate: "Doing Well",
};

export default function RiskDistributionChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        No risk data available
      </p>
    );
  }

  // ✅ Transform data ONLY for display
  const formattedData = data.map((item) => ({
    ...item,
    displayRisk: LABELS[item.risk] || item.risk,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            dataKey="count"
            nameKey="displayRisk"   // 🔥 CHANGE HERE
            cx="50%"
            cy="50%"
            outerRadius={100}
            stroke="#ffffff"
            strokeWidth={2}
          >
            {formattedData.map((entry, index) => {
              const key = entry.risk?.toLowerCase().trim();
              return (
                <Cell
                  key={index}
                  fill={COLORS[key] || "#94a3b8"}
                />
              );
            })}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
