"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function AnalyticsDashboard({
  operations,
}) {

  const statusData = [
    {
      name: "New",
      value: operations.filter(
        (op) => op.status === "new"
      ).length,
    },

    {
      name: "In Progress",
      value: operations.filter(
        (op) => op.status === "in_progress"
      ).length,
    },

    {
      name: "Waiting",
      value: operations.filter(
        (op) => op.status === "waiting"
      ).length,
    },

    {
      name: "Completed",
      value: operations.filter(
        (op) => op.status === "completed"
      ).length,
    },

    {
      name: "Cancelled",
      value: operations.filter(
        (op) => op.status === "cancelled"
      ).length,
    },
  ];

  const priorityData = [
    {
      name: "Low",
      value: operations.filter(
        (op) => op.priority === "low"
      ).length,
    },

    {
      name: "Medium",
      value: operations.filter(
        (op) => op.priority === "medium"
      ).length,
    },

    {
      name: "High",
      value: operations.filter(
        (op) => op.priority === "high"
      ).length,
    },

    {
      name: "Critical",
      value: operations.filter(
        (op) => op.priority === "critical"
      ).length,
    },
  ];

  const COLORS = [
    "#0f172a",
    "#2563eb",
    "#f59e0b",
    "#10b981",
    "#ef4444",
  ];

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold">
            Operations Status
          </h3>

          <p className="text-sm text-slate-500">
            Real-time status distribution
          </p>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
              >

                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}

              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h3 className="text-xl font-bold">
            Priority Levels
          </h3>

          <p className="text-sm text-slate-500">
            Operations priority analysis
          </p>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#0f172a"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}