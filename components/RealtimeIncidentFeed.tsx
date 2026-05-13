'use client'

import {
  AlertTriangle,
  Clock3,
  ShieldAlert,
  Siren,
} from 'lucide-react'

interface RealtimeIncidentFeedProps {
  operations: any[]
}

export default function RealtimeIncidentFeed({
  operations,
}: RealtimeIncidentFeedProps) {

  const sortedOperations = [...operations]
    .sort((a, b) => {
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      )
    })
    .slice(0, 12)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'critical':
        return 'bg-red-500'

      case 'medium':
        return 'bg-amber-500'

      default:
        return 'bg-emerald-500'
    }
  }

  const getIcon = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'critical':
        return <Siren className="h-4 w-4 text-red-600" />

      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />

      default:
        return <ShieldAlert className="h-4 w-4 text-emerald-600" />
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-slate-950">
            Realtime Incident Feed
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Live operational events and incidents
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          LIVE
        </div>
      </div>

      <div className="space-y-4">

        {sortedOperations.map((op) => (
          <div
            key={op.id}
            className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
          >

            <div
              className={`mt-1 h-3 w-3 rounded-full ${getPriorityColor(
                op.priority
              )}`}
            />

            <div className="flex-1">

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {getIcon(op.priority)}

                  <h4 className="font-bold text-slate-900">
                    {op.title}
                  </h4>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {(op.status || 'new').replace('_', ' ')}
                </span>
              </div>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                {op.description || 'No description provided'}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">

                <div className="flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />

                  <span>
                    {new Date(op.created_at).toLocaleString()}
                  </span>
                </div>

                {op.assigned_to && (
                  <div>
                    Assigned to:
                    <span className="ml-1 font-semibold text-slate-700">
                      {op.assigned_to}
                    </span>
                  </div>
                )}

                <div className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">
                  {op.priority || 'low'}
                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}