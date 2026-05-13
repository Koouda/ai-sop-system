'use client'

import {
  Settings,
  ShieldCheck,
  Bot,
  Database,
  Activity,
} from 'lucide-react'

interface SettingsPageProps {
  role: string
  operationsCount: number
}

export default function SettingsPage({
  role,
  operationsCount,
}: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-indigo-600" />

          <div>
            <h2 className="text-2xl font-black text-slate-950">
              System Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage system profile, AI status and operational configuration.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <InfoCard
          title="Current Role"
          value={role}
          icon={<ShieldCheck className="h-6 w-6" />}
          tone="bg-emerald-50 text-emerald-600"
        />

        <InfoCard
          title="AI Engine"
          value="Active"
          icon={<Bot className="h-6 w-6" />}
          tone="bg-indigo-50 text-indigo-600"
        />

        <InfoCard
          title="Database"
          value="Supabase"
          icon={<Database className="h-6 w-6" />}
          tone="bg-sky-50 text-sky-600"
        />

        <InfoCard
          title="Operations"
          value={operationsCount}
          icon={<Activity className="h-6 w-6" />}
          tone="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">
          Platform Configuration
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <SettingRow label="System Name" value="AI Operations Layer" />
          <SettingRow label="Mode" value="Realtime Monitoring" />
          <SettingRow label="Workflow Automation" value="Enabled" />
          <SettingRow label="Smart Assignment" value="Enabled" />
          <SettingRow label="Predictive Operations" value="Enabled" />
          <SettingRow label="Notifications Hub" value="Enabled" />
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, value, icon, tone }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
        {icon}
      </div>

      <p className="text-3xl font-black capitalize text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-500">
        {title}
      </p>
    </div>
  )
}

function SettingRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <p className="text-sm font-bold text-slate-600">{label}</p>
      <p className="text-sm font-black text-slate-950">{value}</p>
    </div>
  )
}