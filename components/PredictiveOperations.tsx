'use client'

import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Clock3,
  Gauge,
  ShieldAlert,
  TrendingUp,
  Users,
} from 'lucide-react'

interface PredictiveOperationsProps {
  operations: any[]
}

export default function PredictiveOperations({
  operations,
}: PredictiveOperationsProps) {
  const today = new Date().toISOString().split('T')[0]

  const total = operations.length || 1

  const highRisk = operations.filter(
    (op) =>
      op.priority === 'high' ||
      op.priority === 'critical' ||
      op.ai_urgency === 'high' ||
      op.ai_urgency === 'critical'
  )

  const waiting = operations.filter((op) => op.status === 'waiting')

  const overdue = operations.filter(
    (op) =>
      op.due_date &&
      op.due_date < today &&
      op.status !== 'completed' &&
      op.status !== 'cancelled'
  )

  const inProgress = operations.filter(
    (op) => op.status === 'in_progress'
  )

  const unassignedCritical = highRisk.filter((op) => !op.assigned_to)

  const predictedSlaBreaches = operations.filter(
    (op) =>
      op.due_date &&
      op.due_date >= today &&
      op.status !== 'completed' &&
      op.status !== 'cancelled' &&
      (op.priority === 'high' ||
        op.priority === 'critical' ||
        op.status === 'waiting')
  )

  const escalationProbability = Math.min(
    100,
    highRisk.length * 10 +
      overdue.length * 15 +
      waiting.length * 8 +
      unassignedCritical.length * 12
  )

  const overloadProbability = Math.min(
    100,
    Math.round(((inProgress.length + waiting.length) / total) * 100)
  )

  const slaRiskScore = Math.min(
    100,
    overdue.length * 20 + predictedSlaBreaches.length * 10
  )

  const operationalForecastScore = Math.min(
    100,
    Math.round(
      escalationProbability * 0.4 +
        overloadProbability * 0.3 +
        slaRiskScore * 0.3
    )
  )

  const forecastLevel =
    operationalForecastScore >= 75
      ? 'Critical Forecast'
      : operationalForecastScore >= 50
        ? 'Elevated Forecast'
        : operationalForecastScore >= 25
          ? 'Moderate Forecast'
          : 'Stable Forecast'

  const forecastTone =
    operationalForecastScore >= 75
      ? 'bg-red-50 text-red-600 border-red-200'
      : operationalForecastScore >= 50
        ? 'bg-orange-50 text-orange-600 border-orange-200'
        : operationalForecastScore >= 25
          ? 'bg-amber-50 text-amber-600 border-amber-200'
          : 'bg-emerald-50 text-emerald-600 border-emerald-200'

  const predictedRisks = [
    predictedSlaBreaches.length > 0
      ? `${predictedSlaBreaches.length} operation(s) are likely to breach SLA if not resolved.`
      : null,

    unassignedCritical.length > 0
      ? `${unassignedCritical.length} critical operation(s) may escalate due to missing ownership.`
      : null,

    overloadProbability >= 60
      ? 'Operational workload may exceed current team response capacity.'
      : null,

    waiting.length > 0
      ? `${waiting.length} waiting operation(s) may increase backlog pressure.`
      : null,

    highRisk.length > 0
      ? `${highRisk.length} high-risk operation(s) require proactive command monitoring.`
      : null,
  ].filter(Boolean)

  const cards = [
    {
      title: 'Escalation Probability',
      value: escalationProbability,
      icon: <ShieldAlert className="h-6 w-6" />,
      tone: 'text-red-600 bg-red-50',
    },
    {
      title: 'SLA Forecast Risk',
      value: slaRiskScore,
      icon: <Clock3 className="h-6 w-6" />,
      tone: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Overload Probability',
      value: overloadProbability,
      icon: <Users className="h-6 w-6" />,
      tone: 'text-orange-600 bg-orange-50',
    },
    {
      title: 'Operational Forecast',
      value: operationalForecastScore,
      icon: <BrainCircuit className="h-6 w-6" />,
      tone: 'text-indigo-600 bg-indigo-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl border p-6 shadow-sm ${forecastTone}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />

              <h2 className="text-2xl font-black">
                Predictive Operations Engine
              </h2>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-7 opacity-90">
              AI-powered forecast for future SLA breaches, escalation probability,
              workload pressure and operational degradation.
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 px-5 py-4 text-center">
            <p className="text-4xl font-black">{operationalForecastScore}%</p>
            <p className="mt-1 text-xs font-black uppercase">
              {forecastLevel}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${card.tone}`}
            >
              {card.icon}
            </div>

            <p className="text-3xl font-black text-slate-950">
              {card.value}%
            </p>

            <p className="mt-1 text-sm font-bold text-slate-500">
              {card.title}
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-950"
                style={{ width: `${card.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Predicted Operational Risks
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Forecasted risks generated from current operations, SLA status and workload.
              </p>
            </div>

            <Activity className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {predictedRisks.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                No predictive risks detected.
              </div>
            ) : (
              predictedRisks.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-black text-indigo-600">
                    {index + 1}
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    {risk}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-950">
              Forecast Signals
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Current signals used by the prediction engine.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-red-50 p-4 text-red-600">
              <AlertTriangle className="mb-2 h-5 w-5" />
              <p className="text-2xl font-black">{highRisk.length}</p>
              <p className="text-xs font-bold uppercase">High Risk Ops</p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
              <Clock3 className="mb-2 h-5 w-5" />
              <p className="text-2xl font-black">
                {predictedSlaBreaches.length}
              </p>
              <p className="text-xs font-bold uppercase">
                Predicted SLA Risk
              </p>
            </div>

            <div className="rounded-2xl bg-orange-50 p-4 text-orange-600">
              <Gauge className="mb-2 h-5 w-5" />
              <p className="text-2xl font-black">{waiting.length}</p>
              <p className="text-xs font-bold uppercase">Waiting Pressure</p>
            </div>

            <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
              <BrainCircuit className="mb-2 h-5 w-5" />
              <p className="text-2xl font-black">
                {unassignedCritical.length}
              </p>
              <p className="text-xs font-bold uppercase">
                Ownership Gaps
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}