'use client'

import {
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Radio,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'

interface AICopilotPanelProps {
  operations: any[]
}

export default function AICopilotPanel({
  operations,
}: AICopilotPanelProps) {
  const today = new Date().toISOString().split('T')[0]

  const highRisk = operations.filter(
    (op) =>
      op.priority === 'high' ||
      op.priority === 'critical' ||
      op.ai_urgency === 'high' ||
      op.ai_urgency === 'critical'
  )

  const overdue = operations.filter(
    (op) =>
      op.due_date &&
      op.due_date < today &&
      op.status !== 'completed' &&
      op.status !== 'cancelled'
  )

  const waiting = operations.filter((op) => op.status === 'waiting')

  const unassignedCritical = highRisk.filter((op) => !op.assigned_to)

  const completed = operations.filter(
    (op) => op.status === 'completed'
  ).length

  const total = operations.length || 1
  const completionRate = Math.round((completed / total) * 100)

  const pressureScore = Math.min(
    100,
    highRisk.length * 15 +
      overdue.length * 20 +
      waiting.length * 8 +
      unassignedCritical.length * 18
  )

  const situation =
    pressureScore >= 75
      ? 'Critical operational pressure detected.'
      : pressureScore >= 45
        ? 'Operational pressure is elevated.'
        : 'Operational environment is currently controlled.'

  const recommendations = [
    overdue.length > 0
      ? `Escalate ${overdue.length} overdue operation(s) for immediate SLA review.`
      : null,

    unassignedCritical.length > 0
      ? `Assign owners to ${unassignedCritical.length} unassigned critical operation(s).`
      : null,

    waiting.length > 0
      ? `Review ${waiting.length} waiting operation(s) to reduce operational backlog.`
      : null,

    highRisk.length > 0
      ? `Prioritize ${highRisk.length} high-risk operation(s) in the next command cycle.`
      : null,

    completionRate < 50
      ? 'Improve response efficiency by closing low-risk completed-ready items.'
      : null,
  ].filter(Boolean)

  return (
    <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-600" />

            <h3 className="text-lg font-black text-slate-950">
              AI Operational Copilot
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            AI-generated executive assessment and recommended operational actions.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-black text-white">
          <Sparkles className="h-3.5 w-3.5" />
          AI
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Radio className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Current Situation
            </p>

            <h4 className="mt-2 text-2xl font-black text-slate-950">
              {situation}
            </h4>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              AI analyzed operational load, high-risk cases, SLA breaches,
              waiting backlog, assignment gaps and completion rate to estimate
              current command pressure.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <ShieldAlert className="mb-3 h-5 w-5 text-red-500" />
          <p className="text-2xl font-black text-slate-950">
            {highRisk.length}
          </p>
          <p className="text-xs font-bold uppercase text-slate-500">
            High Risk
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <ClipboardList className="mb-3 h-5 w-5 text-amber-500" />
          <p className="text-2xl font-black text-slate-950">
            {overdue.length}
          </p>
          <p className="text-xs font-bold uppercase text-slate-500">
            Overdue
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <Radio className="mb-3 h-5 w-5 text-orange-500" />
          <p className="text-2xl font-black text-slate-950">
            {waiting.length}
          </p>
          <p className="text-xs font-bold uppercase text-slate-500">
            Waiting
          </p>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-500" />
          <p className="text-2xl font-black text-slate-950">
            {completionRate}%
          </p>
          <p className="text-xs font-bold uppercase text-slate-500">
            Completion
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-950">
            Recommended Actions
          </h4>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
            {recommendations.length}
          </span>
        </div>

        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
              No immediate AI actions required.
            </div>
          ) : (
            recommendations.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-black text-indigo-600">
                  {index + 1}
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  {item}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}