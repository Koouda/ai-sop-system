'use client'

import {
  Activity,
  Gauge,
  Radio,
  TrendingUp,
} from 'lucide-react'

interface OperationalPulseProps {
  operations: any[]
}

export default function OperationalPulse({
  operations,
}: OperationalPulseProps) {
  const total = operations.length || 1

  const completed = operations.filter(
    (op) => op.status === 'completed'
  ).length

  const highRisk = operations.filter(
    (op) =>
      op.priority === 'high' ||
      op.priority === 'critical' ||
      op.ai_urgency === 'high' ||
      op.ai_urgency === 'critical'
  ).length

  const waiting = operations.filter(
    (op) => op.status === 'waiting'
  ).length

  const inProgress = operations.filter(
    (op) => op.status === 'in_progress'
  ).length

  const completionRate = Math.round((completed / total) * 100)
  const riskRate = Math.round((highRisk / total) * 100)
  const waitingRate = Math.round((waiting / total) * 100)
  const loadRate = Math.round((inProgress / total) * 100)

  const healthScore = Math.max(
    0,
    Math.min(
      100,
      completionRate - riskRate - waitingRate + 40
    )
  )

  const healthLabel =
    healthScore >= 80
      ? 'System Stable'
      : healthScore >= 60
        ? 'Operational Load Elevated'
        : healthScore >= 40
          ? 'Pressure Increasing'
          : 'Critical Pressure'

  const healthTone =
    healthScore >= 80
      ? 'text-emerald-600 bg-emerald-50'
      : healthScore >= 60
        ? 'text-amber-600 bg-amber-50'
        : healthScore >= 40
          ? 'text-orange-600 bg-orange-50'
          : 'text-red-600 bg-red-50'

  const bars = [
    {
      label: 'Response Efficiency',
      value: completionRate,
    },
    {
      label: 'Operational Load',
      value: loadRate,
    },
    {
      label: 'Risk Exposure',
      value: riskRate,
    },
    {
      label: 'Waiting Pressure',
      value: waitingRate,
    },
  ]

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-indigo-600" />

            <h3 className="text-lg font-black text-slate-950">
              Operational Pulse
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            AI-calculated live health indicator for operational performance.
          </p>
        </div>

        <div className={`rounded-2xl px-5 py-3 ${healthTone}`}>
          <p className="text-sm font-black">{healthLabel}</p>
          <p className="mt-1 text-3xl font-black">{healthScore}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
        {bars.map((bar) => (
          <div
            key={bar.label}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-700">
                {bar.label}
              </p>

              <span className="text-sm font-black text-slate-950">
                {bar.value}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-950"
                style={{ width: `${bar.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
          <Activity className="mb-3 h-5 w-5" />
          <p className="text-2xl font-black">{operations.length}</p>
          <p className="text-xs font-bold uppercase">Total Ops</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
          <Gauge className="mb-3 h-5 w-5" />
          <p className="text-2xl font-black">{completionRate}%</p>
          <p className="text-xs font-bold uppercase">Efficiency</p>
        </div>

        <div className="rounded-2xl bg-red-50 p-4 text-red-600">
          <TrendingUp className="mb-3 h-5 w-5" />
          <p className="text-2xl font-black">{riskRate}%</p>
          <p className="text-xs font-bold uppercase">Risk</p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-amber-600">
          <Radio className="mb-3 h-5 w-5" />
          <p className="text-2xl font-black">{waitingRate}%</p>
          <p className="text-xs font-bold uppercase">Waiting</p>
        </div>
      </div>
    </div>
  )
}