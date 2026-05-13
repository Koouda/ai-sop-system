'use client'

import {
  BellRing,
  AlertTriangle,
  Clock3,
  ShieldAlert,
  UserX,
  Zap,
} from 'lucide-react'

interface NotificationsHubProps {
  operations: any[]
}

export default function NotificationsHub({
  operations,
}: NotificationsHubProps) {
  const today = new Date().toISOString().split('T')[0]

  const notifications = operations.flatMap((op) => {
    const items: any[] = []

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

    if (isHighRisk) {
      items.push({
        id: `${op.id}-risk`,
        title: 'High Risk Operation',
        message: op.title,
        type: 'Risk',
        severity: 'critical',
        icon: <ShieldAlert className="h-5 w-5" />,
      })
    }

    if (isOverdue) {
      items.push({
        id: `${op.id}-sla`,
        title: 'SLA Breach',
        message: op.title,
        type: 'SLA',
        severity: 'high',
        icon: <Clock3 className="h-5 w-5" />,
      })
    }

    if (isHighRisk && !op.assigned_to) {
      items.push({
        id: `${op.id}-owner`,
        title: 'Unassigned Critical Case',
        message: op.title,
        type: 'Assignment',
        severity: 'high',
        icon: <UserX className="h-5 w-5" />,
      })
    }

    if (op.status === 'waiting') {
      items.push({
        id: `${op.id}-waiting`,
        title: 'Waiting Operation',
        message: op.title,
        type: 'Workflow',
        severity: 'medium',
        icon: <AlertTriangle className="h-5 w-5" />,
      })
    }

    return items
  })

  const critical = notifications.filter((n) => n.severity === 'critical').length
  const high = notifications.filter((n) => n.severity === 'high').length
  const medium = notifications.filter((n) => n.severity === 'medium').length

  const getStyle = (severity: string) => {
    if (severity === 'critical') return 'bg-red-50 text-red-600 border-red-100'
    if (severity === 'high') return 'bg-orange-50 text-orange-600 border-orange-100'
    return 'bg-amber-50 text-amber-600 border-amber-100'
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <BellRing className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-950">
              Notifications Hub
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Centralized operational notifications from SLA, risk, workflow and assignment signals.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <BellRing className="mb-4 h-6 w-6 text-indigo-600" />
          <p className="text-3xl font-black text-slate-950">{notifications.length}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Total Notifications</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldAlert className="mb-4 h-6 w-6 text-red-600" />
          <p className="text-3xl font-black text-slate-950">{critical}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Critical</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <Zap className="mb-4 h-6 w-6 text-orange-600" />
          <p className="text-3xl font-black text-slate-950">{high}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">High</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <AlertTriangle className="mb-4 h-6 w-6 text-amber-600" />
          <p className="text-3xl font-black text-slate-950">{medium}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Medium</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-black text-slate-950">
            Live Notification Stream
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Prioritized alerts generated from the current operational state.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No active notifications.
            </div>
          ) : (
            notifications.slice(0, 50).map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-5">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${getStyle(
                    item.severity
                  )}`}
                >
                  {item.icon}
                </div>

                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h4 className="font-black text-slate-950">
                      {item.title}
                    </h4>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {item.type}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${getStyle(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    {item.message || 'Untitled operation'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}