'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileText,
  GitBranch,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Layers3,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface OperationsAnalyticsProps {
  operations: any[]
}

export default function OperationsAnalytics({
  operations,
}: OperationsAnalyticsProps) {
  const [workflows, setWorkflows] = useState<any[]>([])
  const [documentsCount, setDocumentsCount] = useState(0)

  const fetchAnalytics = async () => {
    const { data: workflowData } = await supabase
      .from('operation_workflows')
      .select('*')

    const { count } = await supabase
      .from('generated_documents')
      .select('*', { count: 'exact', head: true })

    setWorkflows(workflowData || [])
    setDocumentsCount(count || 0)
  }

  useEffect(() => {
    fetchAnalytics()
  }, [operations])

  const analytics = useMemo(() => {
    const totalOperations = operations.length

    const completedOperations = operations.filter(
      (op) => op.status === 'completed'
    ).length

    const newOperations = operations.filter(
      (op) => op.status === 'new'
    ).length

    const inProgressOperations = operations.filter(
      (op) => op.status === 'in_progress'
    ).length

    const waitingOperations = operations.filter(
      (op) => op.status === 'waiting'
    ).length

    const cancelledOperations = operations.filter(
      (op) => op.status === 'cancelled'
    ).length

    const highPriorityOperations = operations.filter(
      (op) =>
        op.priority?.toLowerCase() === 'high' ||
        op.ai_urgency?.toLowerCase() === 'high' ||
        op.priority?.toLowerCase() === 'critical' ||
        op.ai_urgency?.toLowerCase() === 'critical'
    ).length

    const criticalOperations = workflows.filter(
      (workflow) =>
        workflow.mission_impact === 'Critical' ||
        workflow.severity_score >= 80
    ).length

    const commandEscalations = workflows.filter(
      (workflow) => workflow.escalation_level === 'Command'
    ).length

    const averageSeverity =
      workflows.length > 0
        ? Math.round(
            workflows.reduce(
              (sum, workflow) => sum + (workflow.severity_score || 0),
              0
            ) / workflows.length
          )
        : 0

    const highComplexity = workflows.filter(
      (workflow) =>
        workflow.resolution_complexity === 'Complex' ||
        workflow.resolution_complexity === 'Critical'
    ).length

    return {
      totalOperations,
      completedOperations,
      newOperations,
      inProgressOperations,
      waitingOperations,
      cancelledOperations,
      highPriorityOperations,
      criticalOperations,
      commandEscalations,
      averageSeverity,
      highComplexity,
      totalWorkflows: workflows.length,
    }
  }, [operations, workflows])

  const statusRows = [
    {
      label: 'New',
      value: analytics.newOperations,
      className: 'bg-blue-500',
    },
    {
      label: 'In Progress',
      value: analytics.inProgressOperations,
      className: 'bg-violet-500',
    },
    {
      label: 'Waiting',
      value: analytics.waitingOperations,
      className: 'bg-amber-500',
    },
    {
      label: 'Completed',
      value: analytics.completedOperations,
      className: 'bg-emerald-500',
    },
    {
      label: 'Cancelled',
      value: analytics.cancelledOperations,
      className: 'bg-slate-400',
    },
  ]

  const priorityRows = [
    {
      label: 'Critical / High',
      value: analytics.highPriorityOperations,
      className: 'bg-red-500',
    },
    {
      label: 'Command Escalations',
      value: analytics.commandEscalations,
      className: 'bg-purple-500',
    },
    {
      label: 'High Complexity',
      value: analytics.highComplexity,
      className: 'bg-orange-500',
    },
  ]

  const recentCriticalOperations = operations
    .filter(
      (op) =>
        op.priority?.toLowerCase() === 'high' ||
        op.ai_urgency?.toLowerCase() === 'high' ||
        op.priority?.toLowerCase() === 'critical' ||
        op.ai_urgency?.toLowerCase() === 'critical'
    )
    .slice(0, 5)

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    tone = 'slate',
  }: any) => {
    const tones: any = {
      indigo: 'bg-indigo-50 text-indigo-600',
      green: 'bg-emerald-50 text-emerald-600',
      orange: 'bg-orange-50 text-orange-600',
      blue: 'bg-blue-50 text-blue-600',
      red: 'bg-red-50 text-red-600',
      slate: 'bg-slate-100 text-slate-600',
      purple: 'bg-purple-50 text-purple-600',
    }

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              tones[tone] || tones.slate
            }`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 text-3xl font-black tracking-tight text-slate-950">
              {value}
            </p>

            {subtitle && (
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                {trend === 'up' && (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                )}
                {trend === 'down' && (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                )}
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  const ProgressRow = ({ label, value, total, className }: any) => {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0

    return (
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
            <span className="font-medium text-slate-600">{label}</span>
          </div>
          <span className="font-semibold text-slate-900">
            {value} <span className="text-slate-400">({percent}%)</span>
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${className}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total Operations"
          value={analytics.totalOperations}
          subtitle="Real-time operational cases"
          icon={<Layers3 className="h-7 w-7" />}
          tone="indigo"
          trend="up"
        />

        <MetricCard
          title="Total Workflows"
          value={analytics.totalWorkflows}
          subtitle="AI workflow engine records"
          icon={<GitBranch className="h-7 w-7" />}
          tone="green"
          trend="up"
        />

        <MetricCard
          title="Critical Operations"
          value={analytics.criticalOperations}
          subtitle="Mission impact or severity +80"
          icon={<AlertTriangle className="h-7 w-7" />}
          tone="red"
          trend="down"
        />

        <MetricCard
          title="Completed Ops"
          value={analytics.completedOperations}
          subtitle="Closed operational items"
          icon={<CheckCircle2 className="h-7 w-7" />}
          tone="blue"
          trend="up"
        />

        <MetricCard
          title="Documents"
          value={documentsCount}
          subtitle={`High complexity: ${analytics.highComplexity}`}
          icon={<FileText className="h-7 w-7" />}
          tone="purple"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Operations by Status
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Current operational distribution
              </p>
            </div>

            <Clock3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-5">
            {statusRows.map((row) => (
              <ProgressRow
                key={row.label}
                label={row.label}
                value={row.value}
                total={analytics.totalOperations}
                className={row.className}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Priority & Escalation
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                AI operational prioritization signals
              </p>
            </div>

            <ShieldAlert className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-5">
            {priorityRows.map((row) => (
              <ProgressRow
                key={row.label}
                label={row.label}
                value={row.value}
                total={Math.max(analytics.totalOperations, analytics.totalWorkflows)}
                className={row.className}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-950">
                Workflow Intelligence
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Severity and command escalation overview
              </p>
            </div>

            <BarChart3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                Avg Severity
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {analytics.averageSeverity}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                Escalations
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {analytics.commandEscalations}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                High Complexity
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {analytics.highComplexity}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">
                Generated Docs
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {documentsCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-950">
                Recent Critical Operations
              </h3>
              <p className="text-sm text-slate-500">
                Highest priority operational items requiring attention
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-6 py-3 font-semibold">Priority</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Assigned To</th>
                <th className="px-6 py-3 font-semibold">Due Date</th>
                <th className="px-6 py-3 font-semibold">AI Category</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {recentCriticalOperations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    No critical operations found.
                  </td>
                </tr>
              ) : (
                recentCriticalOperations.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50">
                    <td className="max-w-[280px] px-6 py-4">
                      <p className="line-clamp-1 font-semibold text-slate-900">
                        {op.title || 'Untitled Operation'}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {op.description || 'No description provided'}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                        {op.ai_urgency || op.priority || 'High'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold capitalize text-indigo-600">
                        {(op.status || 'new').replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {op.assigned_to || 'Unassigned'}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {op.due_date || 'No due date'}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {op.ai_category || 'General'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}