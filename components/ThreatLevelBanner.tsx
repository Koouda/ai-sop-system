'use client'

import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'

interface ThreatLevelBannerProps {
  operations: any[]
}

export default function ThreatLevelBanner({
  operations,
}: ThreatLevelBannerProps) {
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

  const overdue = operations.filter((op) => {
    if (!op.due_date) return false

    const today = new Date().toISOString().split('T')[0]

    return (
      op.due_date < today &&
      op.status !== 'completed' &&
      op.status !== 'cancelled'
    )
  }).length

  const riskScore =
    highRisk * 20 +
    waiting * 10 +
    overdue * 15

  let level = 'LOW'
  let description = 'Operational status stable.'
  let style =
    'bg-emerald-50 border-emerald-200 text-emerald-700'
  let icon = <ShieldCheck className="h-7 w-7" />

  if (riskScore >= 200) {
    level = 'CRITICAL'
    description =
      'Severe operational pressure detected across active incidents.'

    style =
      'bg-red-50 border-red-200 text-red-700'

    icon = <ShieldX className="h-7 w-7" />
  } else if (riskScore >= 120) {
    level = 'HIGH'

    description =
      'Operational escalation level elevated. Immediate monitoring recommended.'

    style =
      'bg-orange-50 border-orange-200 text-orange-700'

    icon = <ShieldAlert className="h-7 w-7" />
  } else if (riskScore >= 60) {
    level = 'ELEVATED'

    description =
      'Operational load above normal baseline.'

    style =
      'bg-amber-50 border-amber-200 text-amber-700'

    icon = <ShieldAlert className="h-7 w-7" />
  }

  return (
    <div
      className={`rounded-3xl border p-6 shadow-sm ${style}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-start gap-4">
          <div className="mt-1">
            {icon}
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
              Operational Threat Level
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {level}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 opacity-90">
              {description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">

          <div className="rounded-2xl bg-white/60 p-4 text-center">
            <p className="text-3xl font-black">
              {highRisk}
            </p>

            <p className="mt-1 text-xs font-bold uppercase opacity-70">
              High Risk
            </p>
          </div>

          <div className="rounded-2xl bg-white/60 p-4 text-center">
            <p className="text-3xl font-black">
              {waiting}
            </p>

            <p className="mt-1 text-xs font-bold uppercase opacity-70">
              Waiting
            </p>
          </div>

          <div className="rounded-2xl bg-white/60 p-4 text-center">
            <p className="text-3xl font-black">
              {overdue}
            </p>

            <p className="mt-1 text-xs font-bold uppercase opacity-70">
              Overdue
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}