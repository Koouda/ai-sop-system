"use client";

export default function AIInsightsPanel({ operations }) {
  const criticalOps = operations.filter(
    (op) =>
      op.priority === "critical" ||
      op.priority === "high" ||
      op.ai_urgency?.toLowerCase() === "high"
  );

  const overdueOps = operations.filter((op) => {
    if (!op.due_date) return false;
    if (op.status === "completed" || op.status === "cancelled") return false;

    const today = new Date().toISOString().split("T")[0];
    return op.due_date < today;
  });

  const waitingOps = operations.filter(
    (op) => op.status === "waiting"
  );

  const riskScore = Math.min(
    100,
    criticalOps.length * 20 + overdueOps.length * 25 + waitingOps.length * 10
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">
          AI Risk Score
        </p>

        <h3 className="mt-3 text-5xl font-black text-slate-900">
          {riskScore}%
        </h3>

        <p className="mt-3 text-sm text-slate-500">
          Based on critical, overdue, and waiting operations.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">
          Critical Operations
        </p>

        <h3 className="mt-3 text-5xl font-black text-red-600">
          {criticalOps.length}
        </h3>

        <p className="mt-3 text-sm text-slate-500">
          High-priority operations requiring attention.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">
          Overdue Operations
        </p>

        <h3 className="mt-3 text-5xl font-black text-orange-600">
          {overdueOps.length}
        </h3>

        <p className="mt-3 text-sm text-slate-500">
          Open operations that passed their due date.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-3">
        <h3 className="text-xl font-bold text-slate-900">
          AI Recommendations
        </h3>

        <div className="mt-5 space-y-3">
          {riskScore >= 70 && (
            <Insight text="Risk level is high. Prioritize overdue and critical operations immediately." />
          )}

          {criticalOps.length > 0 && (
            <Insight text="Assign senior ownership to high-priority operations and review progress daily." />
          )}

          {waitingOps.length > 0 && (
            <Insight text="Waiting operations may indicate external dependency or approval delay. Review blockers." />
          )}

          {overdueOps.length > 0 && (
            <Insight text="Overdue operations should be escalated or replanned with clear deadlines." />
          )}

          {riskScore === 0 && (
            <Insight text="Operations are stable. Continue monitoring and maintain current workflow discipline." />
          )}
        </div>
      </div>
    </div>
  );
}

function Insight({ text }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
      {text}
    </div>
  );
}