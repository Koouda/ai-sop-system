'use client'

import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Gauge,
  Radio,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  TrendingUp,
  Users,
  Clock3,
} from 'lucide-react'

interface ExecutiveCommandViewProps {
  operations: any[]
  t: any
}

export default function ExecutiveCommandView({
  operations,
  t,
}: ExecutiveCommandViewProps) {
  const today = new Date().toISOString().split('T')[0]
  const total = operations.length || 1

  const highRisk = operations.filter(
    (op) =>
      op.priority === 'high' ||
      op.priority === 'critical' ||
      op.ai_urgency === 'high' ||
      op.ai_urgency === 'critical'
  )

  const criticalOps = operations.filter(
    (op) => op.priority === 'critical' || op.ai_urgency === 'critical'
  )

  const overdue = operations.filter(
    (op) =>
      op.due_date &&
      op.due_date < today &&
      op.status !== 'completed' &&
      op.status !== 'cancelled'
  )

  const waiting = operations.filter((op) => op.status === 'waiting')
  const inProgress = operations.filter((op) => op.status === 'in_progress')
  const completed = operations.filter((op) => op.status === 'completed')
  const unassignedCritical = highRisk.filter((op) => !op.assigned_to)

  const completionRate = Math.round((completed.length / total) * 100)
  const waitingRate = Math.round((waiting.length / total) * 100)
  const highRiskRate = Math.round((highRisk.length / total) * 100)
  const activeLoadRate = Math.round(
    ((inProgress.length + waiting.length) / total) * 100
  )

  const forecastRisk = Math.min(
    100,
    highRisk.length * 8 +
      criticalOps.length * 12 +
      overdue.length * 12 +
      waiting.length * 5 +
      unassignedCritical.length * 10
  )

  const readiness = Math.max(
    0,
    Math.min(
      100,
      completionRate + 45 - highRiskRate - waitingRate - overdue.length * 3
    )
  )

  const operationalPulse = Math.max(
    0,
    Math.min(100, readiness - forecastRisk * 0.3 + completionRate * 0.2)
  )

  const threatScore = Math.min(
    100,
    criticalOps.length * 25 +
      highRisk.length * 10 +
      overdue.length * 12 +
      waiting.length * 5
  )

  const threatLevel =
    threatScore >= 80
      ? t.critical
      : threatScore >= 55
        ? t.high
        : threatScore >= 30
          ? t.elevatedOperationalPressure
          : t.operationalPictureStable

  const threatTone =
    threatScore >= 80
      ? 'border-red-200 bg-red-50 text-red-700'
      : threatScore >= 55
        ? 'border-orange-200 bg-orange-50 text-orange-700'
        : threatScore >= 30
          ? 'border-amber-200 bg-amber-50 text-amber-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'

  const threatIcon =
    threatScore >= 80 ? (
      <ShieldX className="h-8 w-8" />
    ) : threatScore < 30 ? (
      <ShieldCheck className="h-8 w-8" />
    ) : (
      <ShieldAlert className="h-8 w-8" />
    )

  const executiveStatus =
    forecastRisk >= 70
      ? t.criticalCommandAttention
      : forecastRisk >= 45
        ? t.elevatedOperationalPressure
        : t.operationalPictureStable

  const executiveTone =
    forecastRisk >= 70
      ? 'border-red-200 bg-red-50 text-red-700'
      : forecastRisk >= 45
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700'

  const recommendations = [
    overdue.length > 0
      ? `${t.slaBreaches}: ${overdue.length} ${t.overdue}`
      : null,
    unassignedCritical.length > 0
      ? `${t.unassigned}: ${unassignedCritical.length} ${t.critical}`
      : null,
    highRisk.length > 0
      ? `${t.high}: ${highRisk.length} ${t.activeOperations}`
      : null,
    waiting.length > 0
      ? `${t.waitingQueue}: ${waiting.length}`
      : null,
    activeLoadRate >= 60
      ? t.teamLoadSummary
      : null,
    readiness < 70
      ? t.operationalReadiness
      : null,
  ].filter(Boolean)

  const watchlist = [...highRisk]
    .sort((a, b) => {
      const scoreA =
        (a.priority === 'critical' || a.ai_urgency === 'critical' ? 3 : 0) +
        (a.priority === 'high' || a.ai_urgency === 'high' ? 2 : 0) +
        (!a.assigned_to ? 1 : 0)

      const scoreB =
        (b.priority === 'critical' || b.ai_urgency === 'critical' ? 3 : 0) +
        (b.priority === 'high' || b.ai_urgency === 'high' ? 2 : 0) +
        (!b.assigned_to ? 1 : 0)

      return scoreB - scoreA
    })
    .slice(0, 6)

  const latestExecutiveEvents = operations
    .filter(
      (op) =>
        op.priority === 'critical' ||
        op.priority === 'high' ||
        op.ai_urgency === 'critical' ||
        op.ai_urgency === 'high' ||
        op.status === 'waiting' ||
        (op.due_date && op.due_date < today)
    )
    .slice(0, 6)

  const formatStatus = (status: string) => {
    if (status === 'in_progress') return t.inProgress
    if (status === 'waiting') return t.waiting
    if (status === 'completed') return t.completed
    if (status === 'cancelled') return t.cancelled
    return t.new
  }

  const formatPriority = (priority: string) => {
    if (priority === 'critical') return t.critical
    if (priority === 'high') return t.high
    if (priority === 'medium') return t.medium
    return t.low
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl border p-6 shadow-sm ${executiveTone}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
              {t.executiveCommandView}
            </p>

            <h2 className="mt-2 text-4xl font-black">
              {executiveStatus}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 opacity-90">
              {t.executiveCommandDescription}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <CommandScore label={t.readiness} value={`${readiness}%`} />
            <CommandScore label={t.forecast} value={`${forecastRisk}%`} />
            <CommandScore
              label={t.pulse}
              value={`${Math.round(operationalPulse)}%`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className={`rounded-3xl border p-6 shadow-sm ${threatTone}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
                {t.threatLevel}
              </p>

              <h3 className="mt-2 text-4xl font-black">
                {threatLevel}
              </h3>

              <p className="mt-3 text-sm leading-7 opacity-90">
                {t.forecastRiskSignals}
              </p>
            </div>

            <div className="rounded-2xl bg-white/60 p-4">
              {threatIcon}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {t.operationalPulse}
              </p>
              <h3 className="mt-2 text-4xl font-black text-slate-950">
                {Math.round(operationalPulse)}%
              </h3>
            </div>
            <Gauge className="h-7 w-7 text-indigo-600" />
          </div>

          <PulseBar label={t.completion} value={completionRate} />
          <PulseBar label={t.activeLoad} value={activeLoadRate} />
          <PulseBar label={t.riskExposure} value={highRiskRate} />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                {t.teamLoadSummary}
              </p>
              <h3 className="mt-2 text-4xl font-black text-slate-950">
                {activeLoadRate}%
              </h3>
            </div>
            <Users className="h-7 w-7 text-amber-600" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <MiniStat label={t.inProgress} value={inProgress.length} />
            <MiniStat label={t.waiting} value={waiting.length} />
            <MiniStat label={t.unassigned} value={unassignedCritical.length} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <ExecutiveCard
          title={t.activeOperations}
          value={operations.length}
          icon={<Activity className="h-6 w-6" />}
          tone="bg-indigo-50 text-indigo-600"
        />

        <ExecutiveCard
          title={t.criticalWatchlist}
          value={watchlist.length}
          icon={<ShieldAlert className="h-6 w-6" />}
          tone="bg-red-50 text-red-600"
        />

        <ExecutiveCard
          title={t.slaBreaches}
          value={overdue.length}
          icon={<Clock3 className="h-6 w-6" />}
          tone="bg-amber-50 text-amber-600"
        />

        <ExecutiveCard
          title={t.forecastRisk}
          value={`${forecastRisk}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          tone="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                {t.aiExecutiveRecommendations}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {t.executiveRecommendationsSubtitle}
              </p>
            </div>

            <BrainCircuit className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {recommendations.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                {t.noImmediateExecutiveAction}
              </div>
            ) : (
              recommendations.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-black text-indigo-600">
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">
            {t.forecastRiskSignals}
          </h3>

          <div className="mt-5 space-y-4">
            <SignalRow label={t.operationalReadiness} value={`${readiness}%`} />
            <SignalRow label={t.forecastRisk} value={`${forecastRisk}%`} />
            <SignalRow label={t.threatScore} value={`${threatScore}%`} />
            <SignalRow label={t.waitingQueue} value={waiting.length} />
            <SignalRow label={t.completedOps} value={completed.length} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-black text-slate-950">
              {t.criticalWatchlist}
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {watchlist.length === 0 ? (
              <div className="col-span-full rounded-2xl bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
                {t.noCriticalWatchlistItems}
              </div>
            ) : (
              watchlist.map((op) => (
                <div
                  key={op.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-sm font-black text-slate-950">
                      {op.title || t.noData}
                    </p>

                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                      {formatPriority(op.priority || op.ai_urgency || 'high')}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                    {op.description || t.noDescription}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">
                      {op.assigned_to || t.unassigned}
                    </span>

                    <span className="font-bold capitalize text-slate-500">
                      {formatStatus(op.status || 'new')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Radio className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-950">
              {t.executiveLiveFeed}
            </h3>
          </div>

          <div className="space-y-3">
            {latestExecutiveEvents.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                {t.noExecutiveEvents}
              </div>
            ) : (
              latestExecutiveEvents.map((op) => (
                <div
                  key={op.id}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <p className="line-clamp-1 text-sm font-black text-slate-950">
                    {op.title || t.noData}
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-500">
                    {formatStatus(op.status || 'new')} ·{' '}
                    {formatPriority(op.priority || op.ai_urgency || 'low')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ExecutiveCard({ title, value, icon, tone }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}
      >
        {icon}
      </div>

      <p className="text-3xl font-black text-slate-950">{value}</p>

      <p className="mt-1 text-sm font-bold text-slate-500">{title}</p>
    </div>
  )
}

function CommandScore({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-white/70 px-4 py-3 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black uppercase opacity-70">
        {label}
      </p>
    </div>
  )
}

function MiniStat({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3 text-center">
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </div>
  )
}

function PulseBar({ label, value }: any) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-600">{label}</p>
        <p className="text-sm font-black text-slate-950">{value}%</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-950"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function SignalRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-600">{label}</p>
      <p className="text-sm font-black text-slate-950">{value}</p>
    </div>
  )
}
