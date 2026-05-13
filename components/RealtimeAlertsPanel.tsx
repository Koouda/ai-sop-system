'use client'

import {
  AlertCircle,
  AlertTriangle,
  BellRing,
  Clock3,
  Radio,
  ShieldAlert,
  UserX,
} from 'lucide-react'

interface RealtimeAlertsPanelProps {
  operations: any[]
}

export default function RealtimeAlertsPanel({
  operations,
}: RealtimeAlertsPanelProps) {
  const today = new Date().toISOString().split('T')[0]

  const alerts = operations
    .flatMap((op) => {
      const generatedAlerts: any[] = []

      const isHighRisk =
        op.priority === 'high' ||
        op.priority === 'critical' ||
        op.ai_urgency === 'high' ||
        op.ai_urgency === 'critical'

      const isOverdue =
        op.due_date &&
        op.due_date < today &&
        op.status !== 'completed' &&
        op.status !== 'cancelled'

      const isUnassignedCritical = isHighRisk && !op.assigned_to

      const isWaiting = op.status === 'waiting'

      if (isHighRisk) {
        generatedAlerts.push({
          id: `${op.id}-risk`,
          title: 'High Risk Operation',
          message: op.title || 'Untitled Operation',
          severity: 'critical',
          icon: <ShieldAlert className="h-4 w-4" />,
          time: op.created_at,
        })
      }

      if (isOverdue) {
        generatedAlerts.push({
          id: `${op.id}-sla`,
          title: 'SLA Breach Detected',
          message: op.title || 'Untitled Operation',
          severity: 'high',
          icon: <Clock3 className="h-4 w-4" />,
          time: op.due_date,
        })
      }

      if (isUnassignedCritical) {
        generatedAlerts.push({
          id: `${op.id}-unassigned`,
          title: 'Unassigned Critical Operation',
          message: op.title || 'Untitled Operation',
          severity: 'high',
          icon: <UserX className="h-4 w-4" />,
          time: op.created_at,
        })
      }

      if (isWaiting) {
        generatedAlerts.push({
          id: `${op.id}-waiting`,
          title: 'Operation Waiting',
          message: op.title || 'Untitled Operation',
          severity: 'medium',
          icon: <AlertTriangle className="h-4 w-4" />,
          time: op.created_at,
        })
      }

      return generatedAlerts
    })
    .slice(0, 12)

  const criticalCount = alerts.filter(
    (alert) => alert.severity === 'critical'
  ).length

  const highCount = alerts.filter(
    (alert) => alert.severity === 'high'
  ).length

  const mediumCount = alerts.filter(
    (alert) => alert.severity === 'medium'
  ).length

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50 text-red-700'
      case 'high':
        return 'border-orange-200 bg-orange-50 text-orange-700'
      case 'medium':
        return 'border-amber-200 bg-amber-50 text-amber-700'
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700'
    }
  }

  const getBadgeStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white'
      case 'high':
        return 'bg-orange-600 text-white'
      case 'medium':
        return 'bg-amber-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-orange-500" />

            <h3 className="text-lg font-black text-slate-950">
              Realtime Alerts Center
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            AI-triggered alerts for risk, SLA breaches, waiting cases and unassigned critical operations.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          LIVE
        </div>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-red-50 p-4 text-center text-red-600">
          <p className="text-2xl font-black">{criticalCount}</p>
          <p className="mt-1 text-xs font-bold uppercase">Critical</p>
        </div>

        <div className="rounded-2xl bg-orange-50 p-4 text-center text-orange-600">
          <p className="text-2xl font-black">{highCount}</p>
          <p className="mt-1 text-xs font-bold uppercase">High</p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-4 text-center text-amber-600">
          <p className="text-2xl font-black">{mediumCount}</p>
          <p className="mt-1 text-xs font-bold uppercase">Medium</p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
            No realtime alerts detected.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-2xl border p-4 ${getAlertStyle(alert.severity)}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{alert.icon}</div>

                  <div>
                    <p className="text-sm font-black">
                      {alert.title}
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm opacity-90">
                      {alert.message}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-xs opacity-75">
                      <Radio className="h-3.5 w-3.5" />
                      <span>
                        {alert.time
                          ? new Date(alert.time).toLocaleString()
                          : 'Live alert'}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase ${getBadgeStyle(
                    alert.severity
                  )}`}
                >
                  {alert.severity}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}