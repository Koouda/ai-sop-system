'use client'

import { useEffect, useState } from 'react'
import {
  Bot,
  GitBranch,
  PlayCircle,
  Power,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AutomationControlCenterProps {
  operations: any[]
}

export default function AutomationControlCenter({
  operations,
}: AutomationControlCenterProps) {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRules = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setRules([])
    } else {
      setRules(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const toggleRule = async (rule: any) => {
    const { error } = await supabase
      .from('automation_rules')
      .update({
        is_active: !rule.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rule.id)

    if (error) {
      console.error(error)
      return
    }

    await fetchRules()
  }

  const activeRules = rules.filter((rule) => rule.is_active).length
  const inactiveRules = rules.length - activeRules

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-indigo-600" />

              <h2 className="text-2xl font-black text-slate-950">
                Automation Control Center
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Manage AI workflow automation rules, triggers and operational actions.
            </p>
          </div>

          <div className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-600">
            {activeRules} Active Rules
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <GitBranch className="mb-4 h-6 w-6 text-indigo-600" />
          <p className="text-3xl font-black text-slate-950">
            {rules.length}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Total Rules
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <ShieldCheck className="mb-4 h-6 w-6 text-emerald-600" />
          <p className="text-3xl font-black text-slate-950">
            {activeRules}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Active
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <Power className="mb-4 h-6 w-6 text-slate-500" />
          <p className="text-3xl font-black text-slate-950">
            {inactiveRules}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Disabled
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <Zap className="mb-4 h-6 w-6 text-amber-600" />
          <p className="text-3xl font-black text-slate-950">
            {operations.length}
          </p>
          <p className="mt-1 text-sm font-bold text-slate-500">
            Operations Scope
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-black text-slate-950">
            Active Automation Rules
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Enable, disable and review automation behavior.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-sm text-slate-500">
              Loading automation rules...
            </div>
          ) : rules.length === 0 ? (
            <div className="p-6 text-sm text-slate-500">
              No automation rules found.
            </div>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
                className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        rule.is_active
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {rule.is_active ? 'ACTIVE' : 'DISABLED'}
                    </span>

                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                      {rule.trigger_type}
                    </span>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-600">
                      {rule.action_type}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-950">
                    {rule.rule_name}
                  </h4>

                  <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                    {rule.description || 'No description provided.'}
                  </p>
                </div>

                <button
                  onClick={() => toggleRule(rule)}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition ${
                    rule.is_active
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  <PlayCircle className="h-4 w-4" />
                  {rule.is_active ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}