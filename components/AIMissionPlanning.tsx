'use client'

import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Flag,
  GitBranch,
  Layers3,
  Lightbulb,
  Radio,
  ShieldAlert,
  Target,
  Users,
  Zap,
} from 'lucide-react'

interface AIMissionPlanningProps {
  operations: any[]
  t: any
}

export default function AIMissionPlanning({
  operations,
  t,
}: AIMissionPlanningProps) {
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

  const riskPressure = Math.min(
    100,
    criticalOps.length * 20 +
      highRisk.length * 8 +
      overdue.length * 12 +
      waiting.length * 5
  )

  const workloadPressure = Math.min(
    100,
    Math.round(((inProgress.length + waiting.length) / total) * 100)
  )

  const missionReadiness = Math.max(
    0,
    Math.min(
      100,
      completionRate + 45 - riskPressure * 0.35 - workloadPressure * 0.15
    )
  )

  const missionMode =
    riskPressure >= 70
      ? t.crisisStabilizationMission
      : riskPressure >= 45
        ? t.riskReductionMission
        : workloadPressure >= 55
          ? t.capacityOptimizationMission
          : t.readinessSustainmentMission

  const missionTone =
    riskPressure >= 70
      ? 'border-red-200 bg-red-50 text-red-700'
      : riskPressure >= 45
        ? 'border-orange-200 bg-orange-50 text-orange-700'
        : workloadPressure >= 55
          ? 'border-amber-200 bg-amber-50 text-amber-700'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'

  const missionObjective =
    riskPressure >= 70
      ? t.missionObjectiveCritical ||
        'Stabilize critical operations, recover SLA breaches and reduce command-level exposure.'
      : riskPressure >= 45
        ? t.missionObjectiveRiskReduction ||
          'Reduce high-risk operations, clear overdue cases and improve operational response discipline.'
        : workloadPressure >= 55
          ? t.missionObjectiveCapacity ||
            'Balance team workload, reduce waiting pressure and protect response capacity.'
          : t.missionObjectiveReadiness ||
            'Maintain operational readiness, continue monitoring and close low-risk backlog.'

  const missionSteps = [
    overdue.length > 0
      ? {
          title: t.recoverSlaBreaches || 'Recover SLA Breaches',
          description: `${t.overdue}: ${overdue.length}`,
          owner: t.operations || 'Operations',
          priority: t.critical || 'Critical',
        }
      : null,
    unassignedCritical.length > 0
      ? {
          title: t.assignCriticalOwners || 'Assign Critical Owners',
          description: `${t.unassigned}: ${unassignedCritical.length} ${t.critical}`,
          owner: t.teamCoordination,
          priority: t.critical,
        }
      : null,
    highRisk.length > 0
      ? {
          title: t.prioritizeHighRiskQueue || 'Prioritize High-Risk Queue',
          description: `${t.high}: ${highRisk.length} ${t.activeOperations}`,
          owner: t.executiveCommand,
          priority: t.high,
        }
      : null,
    waiting.length > 0
      ? {
          title: t.clearWaitingBacklog || 'Clear Waiting Backlog',
          description: `${t.waiting}: ${waiting.length}`,
          owner: t.operations,
          priority: t.medium,
        }
      : null,
    {
      title: t.rebalanceOperationalCapacity || 'Rebalance Operational Capacity',
      description:
        t.rebalanceOperationalCapacityDescription ||
        'Redistribute active operations across available team members to reduce overload risk.',
      owner: t.teamCoordination,
      priority: workloadPressure >= 55 ? t.high : t.medium,
    },
    {
      title: t.maintainExecutiveMonitoring || 'Maintain Executive Monitoring',
      description:
        t.maintainExecutiveMonitoringDescription ||
        'Track threat level, operational pulse and forecast risk during the next command cycle.',
      owner: t.executiveCommand,
      priority: t.active,
    },
  ].filter(Boolean)

  const resourcePlan = [
    {
      label: t.executiveCommand,
      value:
        criticalOps.length > 0 || overdue.length > 0
          ? t.required || 'Required'
          : t.realtimeMonitoringMode,
      icon: <ShieldAlert className="h-5 w-5" />,
      tone: 'bg-red-50 text-red-600',
    },
    {
      label: t.teamLoadSummary,
      value:
        workloadPressure >= 70
          ? t.high
          : workloadPressure >= 45
            ? t.medium
            : t.onTrack,
      icon: <Users className="h-5 w-5" />,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      label: t.workflowAutomation,
      value: t.enabled,
      icon: <Zap className="h-5 w-5" />,
      tone: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: t.missionTimeline || 'Mission Timeline',
      value:
        riskPressure >= 70
          ? '0–6h'
          : riskPressure >= 45
            ? '6–24h'
            : '24–72h',
      icon: <Clock3 className="h-5 w-5" />,
      tone: 'bg-sky-50 text-sky-600',
    },
  ]

  const simulationOutcomes = [
    {
      title: t.ifSlaCleared || 'If SLA breaches are cleared',
      result: `${t.forecastRisk}: -${Math.min(35, overdue.length * 8)}%`,
    },
    {
      title: t.ifCriticalUnassigned || 'If critical cases remain unassigned',
      result: `${t.unassigned}: ${unassignedCritical.length}`,
    },
    {
      title: t.ifWaitingReduced || 'If waiting backlog is reduced',
      result: `${t.waiting}: ${waiting.length}`,
    },
    {
      title: t.ifWorkloadRedistributed || 'If workload is redistributed',
      result:
        workloadPressure >= 55
          ? t.teamLoadSummary
          : t.operationalPictureStable,
    },
  ]

  const missionKPIs = [
    {
      title: t.missionReadiness,
      value: `${Math.round(missionReadiness)}%`,
      icon: <CheckCircle2 className="h-6 w-6" />,
      tone: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: t.riskPressure,
      value: `${riskPressure}%`,
      icon: <ShieldAlert className="h-6 w-6" />,
      tone: 'bg-red-50 text-red-600',
    },
    {
      title: t.workloadPressure,
      value: `${workloadPressure}%`,
      icon: <Users className="h-6 w-6" />,
      tone: 'bg-amber-50 text-amber-600',
    },
    {
      title: t.actionSteps,
      value: missionSteps.length,
      icon: <GitBranch className="h-6 w-6" />,
      tone: 'bg-indigo-50 text-indigo-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl border p-6 shadow-sm ${missionTone}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">
                {t.missionPlanningTitle}
              </p>
            </div>

            <h2 className="mt-3 text-4xl font-black">
              {missionMode}
            </h2>

            <p className="mt-3 max-w-4xl text-sm leading-7 opacity-90">
              {missionObjective}
            </p>
          </div>

          <div className="rounded-2xl bg-white/70 px-6 py-5 text-center">
            <p className="text-4xl font-black">
              {Math.round(missionReadiness)}%
            </p>
            <p className="mt-1 text-xs font-black uppercase">
              {t.readiness}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {missionKPIs.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.tone}`}
            >
              {item.icon}
            </div>

            <p className="text-3xl font-black text-slate-950">
              {item.value}
            </p>

            <p className="mt-1 text-sm font-bold text-slate-500">
              {item.title}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                {t.aiGeneratedMissionPlan}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {t.aiGeneratedMissionPlanSubtitle}
              </p>
            </div>

            <BrainCircuit className="h-5 w-5 text-slate-400" />
          </div>

          <div className="space-y-4">
            {missionSteps.map((step: any, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-black text-indigo-600">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-slate-950">
                        {step.title}
                      </h4>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {step.priority}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {step.description}
                    </p>

                    <p className="mt-3 text-xs font-bold text-slate-500">
                      {t.owner}: {step.owner}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Flag className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-950">
              {t.resourceAllocation}
            </h3>
          </div>

          <div className="space-y-4">
            {resourcePlan.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}
                  >
                    {item.icon}
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                {t.operationalSimulation}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {t.operationalSimulationSubtitle}
              </p>
            </div>

            <Layers3 className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {simulationOutcomes.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-indigo-600" />
                  <h4 className="text-sm font-black text-slate-950">
                    {item.title}
                  </h4>
                </div>

                <p className="text-sm leading-6 text-slate-600">
                  {item.result}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Radio className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-950">
              {t.missionSignals}
            </h3>
          </div>

          <div className="space-y-4">
            <SignalRow label={t.activeOperations} value={operations.length} />
            <SignalRow label={t.critical} value={criticalOps.length} />
            <SignalRow label={t.high} value={highRisk.length} />
            <SignalRow label={t.overdue} value={overdue.length} />
            <SignalRow label={t.waiting} value={waiting.length} />
            <SignalRow label={t.completed} value={completed.length} />
          </div>
        </div>
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
