'use client'

import {
  Activity,
  AlertTriangle,
  Brain,
  Clock3,
  ShieldAlert,
  UserCheck,
} from 'lucide-react'

interface CommandTimelineProps {
  operations: any[]
}

export default function CommandTimeline({
  operations,
}: CommandTimelineProps) {
  const timeline = operations
    .flatMap((op) => {
      const events: any[] = []

      events.push({
        id: `${op.id}-created`,
        type: 'created',
        title: 'Operation Created',
        description: op.title,
        time: op.created_at,
      })

      if (
        op.priority === 'high' ||
        op.priority === 'critical'
      ) {
        events.push({
          id: `${op.id}-risk`,
          type: 'risk',
          title: 'Critical Risk Detected',
          description: 'AI flagged operation as high-risk.',
          time: op.created_at,
        })
      }

      if (op.assigned_to) {
        events.push({
          id: `${op.id}-assigned`,
          type: 'assigned',
          title: 'Team Assigned',
          description: `Assigned to ${op.assigned_to}`,
          time: op.created_at,
        })
      }

      if (op.status === 'waiting') {
        events.push({
          id: `${op.id}-waiting`,
          type: 'waiting',
          title: 'Waiting State Detected',
          description: 'Operation moved into waiting status.',
          time: op.created_at,
        })
      }

      if (
        op.ai_suggested_action
      ) {
        events.push({
          id: `${op.id}-ai`,
          type: 'ai',
          title: 'AI Recommendation Generated',
          description: op.ai_suggested_action,
          time: op.created_at,
        })
      }

      return events
    })
    .sort(
      (a, b) =>
        new Date(b.time).getTime() -
        new Date(a.time).getTime()
    )
    .slice(0, 20)

  const getIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
        )

      case 'assigned':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <UserCheck className="h-5 w-5" />
          </div>
        )

      case 'ai':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Brain className="h-5 w-5" />
          </div>
        )

      case 'waiting':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        )

      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
            <Activity className="h-5 w-5" />
          </div>
        )
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-950">
            Command Timeline
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Live operational timeline and command activity stream.
          </p>
        </div>

        <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
          LIVE
        </div>
      </div>

      <div className="space-y-5">
        {timeline.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
            No command activity available.
          </div>
        ) : (
          timeline.map((event, index) => (
            <div
              key={event.id}
              className="relative flex gap-4"
            >
              {index !== timeline.length - 1 && (
                <div className="absolute left-5 top-12 h-full w-px bg-slate-200" />
              )}

              <div className="relative z-10">
                {getIcon(event.type)}
              </div>

              <div className="flex-1 rounded-2xl border border-slate-100 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-black text-slate-900">
                      {event.title}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {event.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 className="h-3.5 w-3.5" />

                    <span>
                      {new Date(
                        event.time
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}