'use client'

import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  Clock3,
  Radar,
  ShieldAlert,
  Siren,
} from 'lucide-react'

import EscalationQueue from './EscalationQueue'
import OperationalPulse from './OperationalPulse'
import RealtimeIncidentFeed from './RealtimeIncidentFeed'
import RealtimeAlertsPanel from './RealtimeAlertsPanel'
import SLABreachPanel from './SLABreachPanel'
import ThreatLevelBanner from './ThreatLevelBanner'

interface AICommandCenterProps {
  operations: any[]
  t: any
}

export default function AICommandCenter({
  operations,
  t,
}: AICommandCenterProps) {
  const highRisk = operations.filter(
    (op) =>
      op.priority === 'high' ||
      op.priority === 'critical' ||
      op.ai_urgency === 'high' ||
      op.ai_urgency === 'critical'
  )

  const realtimeAlerts = operations.filter(
    (op) => op.status === 'waiting' || op.status === 'cancelled'
  )

  const inProgress = operations.filter(
    (op) => op.status === 'in_progress'
  )

  const formatPriority = (priority: string) => {
    if (priority === 'critical') return t.critical
    if (priority === 'high') return t.high
    if (priority === 'medium') return t.medium
    return t.low
  }

  return (
    <div className="space-y-6">
      <ThreatLevelBanner operations={operations} />

      <OperationalPulse operations={operations} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <CommandMetricCard
          title={t.liveOperations}
          value={operations.length}
          icon={<Activity className="h-7 w-7" />}
          tone="bg-indigo-50 text-indigo-600"
        />

        <CommandMetricCard
          title={t.aiRiskRadar}
          value={highRisk.length}
          icon={<Radar className="h-7 w-7" />}
          tone="bg-red-50 text-red-600"
        />

        <CommandMetricCard
          title={t.slaMonitoring}
          value={inProgress.length}
          icon={<Clock3 className="h-7 w-7" />}
          tone="bg-amber-50 text-amber-600"
        />

        <CommandMetricCard
          title={t.realtimeAlerts}
          value={realtimeAlerts.length}
          icon={<Siren className="h-7 w-7" />}
          tone="bg-orange-50 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RealtimeIncidentFeed operations={operations} />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  {t.aiRecommendations}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {t.suggestedOperationalActions}
                </p>
              </div>

              <BrainCircuit className="h-5 w-5 text-slate-400" />
            </div>

            <div className="space-y-4">
              {highRisk.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
                  {t.noImmediateExecutiveAction || t.noData}
                </div>
              ) : (
                highRisk.slice(0, 5).map((op) => (
                  <div key={op.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />

                      <p className="line-clamp-1 text-sm font-bold text-slate-900">
                        {op.title || t.noData}
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {op.ai_suggested_action || t.aiExecutiveRecommendations}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <SLABreachPanel operations={operations} />

          <RealtimeAlertsPanel operations={operations} />

          <EscalationQueue operations={operations} />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              {t.operationalHeatmap}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {t.operationalHeatmapSubtitle}
            </p>
          </div>

          <ShieldAlert className="h-5 w-5 text-slate-400" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {operations.length === 0 ? (
            <div className="col-span-full rounded-2xl bg-slate-50 p-6 text-center text-sm font-medium text-slate-500">
              {t.noData}
            </div>
          ) : (
            operations.slice(0, 12).map((op) => (
              <div
                key={op.id}
                className={`rounded-2xl p-4 text-white ${
                  op.priority === 'high' || op.priority === 'critical'
                    ? 'bg-red-500'
                    : op.priority === 'medium'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                }`}
              >
                <p className="text-xs font-bold uppercase opacity-80">
                  {formatPriority(op.priority || 'low')}
                </p>

                <p className="mt-3 line-clamp-2 text-sm font-bold leading-6">
                  {op.title || t.noData}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function CommandMetricCard({ title, value, icon, tone }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-4xl font-black text-slate-950">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tone}`}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
