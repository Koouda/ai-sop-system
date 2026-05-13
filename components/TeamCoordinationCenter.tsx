'use client'

import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface TeamCoordinationCenterProps {
  operations: any[]
}

export default function TeamCoordinationCenter({
  operations,
}: TeamCoordinationCenterProps) {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('operation_team_members')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) {
      console.error(error)
      setMembers([])
    } else {
      setMembers(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const getMemberLoad = (name: string) => {
    return operations.filter(
      (op) =>
        op.assigned_to === name &&
        op.status !== 'completed' &&
        op.status !== 'cancelled'
    ).length
  }

  const totalCapacity = members.reduce(
    (sum, member) => sum + (member.max_active_operations || 0),
    0
  )

  const activeLoad = members.reduce(
    (sum, member) => sum + getMemberLoad(member.full_name),
    0
  )

  const availableMembers = members.filter(
    (member) => member.is_available
  ).length

  const overloadedMembers = members.filter((member) => {
    const load = getMemberLoad(member.full_name)
    return load > (member.max_active_operations || 0)
  }).length

  const workloadRate =
    totalCapacity > 0 ? Math.round((activeLoad / totalCapacity) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6 text-indigo-600" />

              <h2 className="text-2xl font-black text-slate-950">
                Team Coordination Center
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Monitor team workload, availability, specialization and operational capacity.
            </p>
          </div>

          <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
            {availableMembers} Available Members
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <Users className="mb-4 h-6 w-6 text-indigo-600" />
          <p className="text-3xl font-black text-slate-950">
            {members.length}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Team Members
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <Activity className="mb-4 h-6 w-6 text-amber-600" />
          <p className="text-3xl font-black text-slate-950">
            {workloadRate}%
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Workload Rate
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <UserCheck className="mb-4 h-6 w-6 text-emerald-600" />
          <p className="text-3xl font-black text-slate-950">
            {availableMembers}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Available
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <AlertTriangle className="mb-4 h-6 w-6 text-red-600" />
          <p className="text-3xl font-black text-slate-950">
            {overloadedMembers}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Overloaded
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-black text-slate-950">
            Team Workload Distribution
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Active operations per team member compared with capacity.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-sm text-slate-500">
              Loading team members...
            </div>
          ) : members.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No team members found.
            </div>
          ) : (
            members.map((member) => {
              const load = getMemberLoad(member.full_name)
              const capacity = member.max_active_operations || 1
              const percent = Math.min(
                100,
                Math.round((load / capacity) * 100)
              )

              const overloaded = load > capacity
              const nearCapacity = percent >= 80 && !overloaded

              const statusLabel = overloaded
                ? 'Overloaded'
                : !member.is_available
                  ? 'Unavailable'
                  : nearCapacity
                    ? 'Near Capacity'
                    : 'Available'

              const statusStyle = overloaded
                ? 'bg-red-50 text-red-600'
                : !member.is_available
                  ? 'bg-slate-100 text-slate-500'
                  : nearCapacity
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-emerald-50 text-emerald-600'

              const barStyle = overloaded
                ? 'bg-red-500'
                : nearCapacity
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'

              return (
                <div
                  key={member.id}
                  className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${statusStyle}`}>
                        {statusLabel}
                      </span>

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                        {member.specialization}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-950">
                      {member.full_name}
                    </h4>

                    <p className="mt-1 text-sm text-slate-500">
                      Active load: {load}/{capacity} operations
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${barStyle}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-2xl font-black text-slate-950">
                        {load}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        Active
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-2xl font-black text-slate-950">
                        {capacity}
                      </p>
                      <p className="text-xs font-bold text-slate-500">
                        Capacity
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                      {member.is_available ? (
                        <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-emerald-600" />
                      ) : (
                        <UserX className="mx-auto mb-1 h-5 w-5 text-slate-500" />
                      )}
                      <p className="text-xs font-bold text-slate-500">
                        Status
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}