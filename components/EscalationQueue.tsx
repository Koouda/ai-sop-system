'use client'

import {
  AlertTriangle,
  ArrowUpRight,
  Clock3,
  ShieldAlert,
  UserX,
} from 'lucide-react'

interface EscalationQueueProps {
  operations: any[]
}

export default function EscalationQueue({
  operations,
}: EscalationQueueProps) {
  const today = new Date().toISOString().split('T')[0]

  const queue = operations
    .map((op) => {
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

      const isUnassigned = !op.assigned_to
      const isWaiting = op.status === 'waiting'

      let score = 0
      const reasons: string[] = []

      if (op.priority === 'critical' || op.ai_urgency === 'critical') {
        score += 40
        reasons.push('Critical priority')
      }

      if (op.priority === 'high' || op.ai_urgency === 'high') {
        score += 30
        reasons.push('High-risk operation')
      }

      if (isOverdue) {
        score += 25
        reasons.push('SLA breach')
      }

      if (isUnassigned && isHighRisk) {
        score += 20
        reasons.push('Unassigned critical case')
      }

      if (isWaiting) {
        score += 15
        reasons.push('Waiting status')
      }

      return {
        ...op,
        escalation_score: score,
        escalation_reasons: reasons,
      }
    })
    .filter((op) => op.escalation_score > 0)
    .sort((a, b) => b.escalation_score - a.escalation_score)
    .slice(0, 8)

  const getSeverity = (score: number) => {
    if (score >= 70) return 'CRITICAL'
    if (score >= 45) return 'HIGH'
    if (score >= 25) return 'MEDIUM'
    return 'LOW'
  }

  const getSeverityStyle = (score: number) => {
    if (score >= 70) return 'bg-red-600 text-white'
    if (score >= 45) return 'bg-orange-500 text-white'
    if (score >= 25) return 'bg-amber-500 text-white'
    return 'bg-slate-500 text-white'
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />

            <h3 className="text-lg font-black text-slate-950">
              Escalation Queue
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            AI-ranked queue for operations that require escalation or command attention.
          </p>
        </div>

        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
          {queue.length} ACTIVE
        </span>
      </div>

      <div className="space-y-3">
        {queue.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500">
            No escalation cases detected.
          </div>
        ) : (
          queue.map((op) => (
            <div
              key={op.id}
              className="rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="line-clamp-1 text-sm font-black text-slate-900">
                    {op.title || 'Untitled Operation'}
                  </p>

                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                    {op.description || 'No description provided'}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${getSeverityStyle(
                    op.escalation_score
                  )}`}
                >
                  {getSeverity(op.escalation_score)}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {op.escalation_reasons.map((reason: string) => (
                  <span
                    key={reason}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                  >
                    {reason}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Score: {op.escalation_score}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 className="h-3.5 w-3.5" />
                  Due: {op.due_date || 'No due date'}
                </div>

                <div className="flex items-center gap-2">
                  <UserX className="h-3.5 w-3.5" />
                  {op.assigned_to || 'Unassigned'}
                </div>

                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {(op.status || 'new').replace('_', ' ')}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}