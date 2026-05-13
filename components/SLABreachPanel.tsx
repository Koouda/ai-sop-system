'use client'

import {
  AlertTriangle,
  CalendarClock,
  CircleAlert,
  UserX,
} from 'lucide-react'

interface SLABreachPanelProps {
  operations: any[]
}

export default function SLABreachPanel({
  operations,
}: SLABreachPanelProps) {
  const today = new Date().toISOString().split('T')[0]

  const overdueOperations = operations.filter(
    (op) =>
      op.due_date &&
      op.due_date < today &&
      op.status !== 'completed' &&
      op.status !== 'cancelled'
  )

  const dueTodayOperations = operations.filter(
    (op) =>
      op.due_date &&
      op.due_date === today &&
      op.status !== 'completed' &&
      op.status !== 'cancelled'
  )

  const unassignedCritical = operations.filter(
    (op) =>
      !op.assigned_to &&
      (op.priority === 'high' ||
        op.priority === 'critical' ||
        op.ai_urgency === 'high' ||
        op.ai_urgency === 'critical')
  )

  const waitingOperations = operations.filter(
    (op) => op.status === 'waiting'
  )

  const slaRiskScore = Math.min(
    100,
    overdueOperations.length * 25 +
      dueTodayOperations.length * 10 +
      unassignedCritical.length * 20 +
      waitingOperations.length * 8
  )

  const riskTone =
    slaRiskScore >= 70
      ? 'text-red-600 bg-red-50'
      : slaRiskScore >= 40
        ? 'text-amber-600 bg-amber-50'
        : 'text-emerald-600 bg-emerald-50'

  const riskLabel =
    slaRiskScore >= 70
      ? 'High Risk'
      : slaRiskScore >= 40
        ? 'Moderate Risk'
        : 'Controlled'

  const rows = [
    {
      title: 'Overdue Operations',
      value: overdueOperations.length,
      icon: <CalendarClock className="h-5 w-5" />,
      tone: 'bg-red-50 text-red-600',
    },
    {
      title: 'Due Today',
      value: dueTodayOperations.length,
      icon: <CircleAlert className="h-5 w-5" />,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Unassigned Critical',
      value: unassignedCritical.length,
      icon: <UserX className="h-5 w-5" />,
      tone: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Waiting Too Long',
      value: waitingOperations.length,
      icon: <AlertTriangle className="h-5 w-5" />,
      tone: 'bg-orange-50 text-orange-600',
    },
  ]

  const escalationItems = [
    ...overdueOperations,
    ...unassignedCritical,
    ...waitingOperations,
  ].slice(0, 6)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">
            SLA Breach Detection
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Automatic detection of overdue, waiting and unassigned critical operations.
          </p>
        </div>

        <div className={`rounded-2xl px-4 py-3 text-center ${riskTone}`}>
          <p className="text-3xl font-black">{slaRiskScore}</p>
          <p className="text-xs font-bold">{riskLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rows.map((row) => (
          <div
            key={row.title}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${row.tone}`}
              >
                {row.icon}
              </div>

              <p className="text-2xl font-black text-slate-950">
                {row.value}
              </p>
            </div>

            <p className="text-sm font-bold text-slate-700">
              {row.title}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-black text-slate-950">
            Escalation Required
          </h4>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {escalationItems.length}
          </span>
        </div>

        <div className="space-y-3">
          {escalationItems.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
              No SLA escalation required.
            </div>
          ) : (
            escalationItems.map((op) => (
              <div
                key={op.id}
                className="rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="line-clamp-1 text-sm font-bold text-slate-900">
                      {op.title || 'Untitled Operation'}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Due: {op.due_date || 'No due date'} · Assigned:{' '}
                      {op.assigned_to || 'Unassigned'}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                    Escalate
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}