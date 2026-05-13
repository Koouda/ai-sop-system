'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

import AppShell from '../components/AppShell'
import LoginForm from '../components/LoginForm'
import OperationForm from '../components/OperationForm'
import OperationsFeed from '../components/OperationsFeed'
import KanbanBoard from '../components/KanbanBoard'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import AIInsightsPanel from '../components/AIInsightsPanel'
import OperationsAnalytics from '../components/OperationsAnalytics'
import AICommandCenter from '../components/AICommandCenter'
import AutomationControlCenter from '../components/AutomationControlCenter'
import TeamCoordinationCenter from '../components/TeamCoordinationCenter'
import PredictiveOperations from '../components/PredictiveOperations'
import NotificationsHub from '../components/NotificationsHub'
import SettingsPage from '../components/SettingsPage'
import ExecutiveCommandView from '../components/ExecutiveCommandView'
import AIMissionPlanning from '../components/AIMissionPlanning'
import { translations } from '../lib/i18n'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState('viewer')
  const [authLoading, setAuthLoading] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [dueDate, setDueDate] = useState('')

  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [message, setMessage] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)

  const [operations, setOperations] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [selectedOperation, setSelectedOperation] = useState<any>(null)

  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState('executive')

  const today = new Date().toISOString().split('T')[0]
  const t = translations[language]
  const isArabic = language === 'ar'

  const canCreate =
    role === 'admin' || role === 'manager' || role === 'operator'

  const canDelete = role === 'admin'

  const getDueStatus = (op: any) => {
    if (!op.due_date) return 'no_due_date'

    if (op.status === 'completed' || op.status === 'cancelled') {
      return 'closed'
    }

    if (op.due_date < today) return 'overdue'
    if (op.due_date === today) return 'due_today'

    return 'on_track'
  }

  const fetchRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error(error)
      setRole('viewer')
      return
    }

    setRole(data?.role || 'viewer')
  }

  const fetchOperations = async () => {
    const { data, error } = await supabase
      .from('operations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setOperations([...(data || [])])
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as
      | 'en'
      | 'ar'
      | null

    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await supabase.auth.getUser()

        setUser(data.user || null)

        if (data.user) {
          fetchRole(data.user.id)
        } else {
          setRole('viewer')
        }
      } catch (error) {
        console.error(error)
        setUser(null)
        setRole('viewer')
      } finally {
        setAuthLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)

      if (session?.user) {
        fetchRole(session.user.id)
      } else {
        setRole('viewer')
      }

      setAuthLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) return

    fetchOperations()

    const channel = supabase
      .channel('operations-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'operations',
        },
        () => {
          fetchOperations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      const matchesStatus =
        statusFilter === 'all' || op.status === statusFilter

      const text = `
        ${op.title || ''}
        ${op.description || ''}
        ${op.ai_summary || ''}
        ${op.ai_category || ''}
        ${op.ai_suggested_action || ''}
        ${op.assigned_to || ''}
        ${op.due_date || ''}
      `.toLowerCase()

      return matchesStatus && text.includes(searchTerm.toLowerCase())
    })
  }, [operations, statusFilter, searchTerm])

  const createLog = async ({
    operationId,
    action,
    oldValue = null,
    newValue = null,
    note = null,
  }: any) => {
    await supabase.from('operation_logs').insert([
      {
        operation_id: operationId,
        action,
        old_value: oldValue,
        new_value: newValue,
        note,
      },
    ])
  }

  const analyzeOperation = async () => {
    if (!canCreate) {
      setMessage(t.operationAnalyzeDenied)
      return
    }

    setAnalyzing(true)
    setMessage('')
    setAnalysis(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      const data = await res.json()
      const result = JSON.parse(data.result)

      setAnalysis(result)

      if (result.urgency) {
        setPriority(result.urgency.toLowerCase())
      }
    } catch (error) {
      setMessage(t.aiAnalysisFailed)
    }

    setAnalyzing(false)
  }

  const createOperation = async () => {
    if (!canCreate) {
      setMessage(t.operationCreateDenied)
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('operations')
      .insert([
        {
          title,
          description,
          type: 'task',
          source: 'manual',
          status: 'new',
          priority,
          assigned_to: assignedTo || null,
          due_date: dueDate || null,
          ai_summary: analysis?.summary || null,
          ai_category: analysis?.category || null,
          ai_urgency: analysis?.urgency || null,
          ai_suggested_action: analysis?.suggested_action || null,
          payload: analysis || {},
        },
      ])
      .select()
      .single()

    if (error) {
      setMessage('Error: ' + error.message)
      setLoading(false)
      return
    }

    await createLog({
      operationId: data.id,
      action: 'created',
      newValue: 'new',
      note: 'Operation created',
    })

    await fetch('/api/workflow-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationId: data.id }),
    })

    await fetch('/api/automation-engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationId: data.id }),
    })

    await fetch('/api/smart-assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operationId: data.id }),
    })

    setMessage(t.operationSaved)

    setTitle('')
    setDescription('')
    setPriority('medium')
    setAssignedTo('')
    setDueDate('')
    setAnalysis(null)

    await fetchOperations()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!canDelete) {
      alert(t.onlyAdminDelete)
      return
    }

    const confirmed = confirm(t.confirmDeleteOperation)

    if (!confirmed) return

    const { error } = await supabase.from('operations').delete().eq('id', id)

    if (error) {
      console.error(error)
      alert(t.failedDeleteOperation)
      return
    }

    setSelectedOperation(null)
    setLogs([])
    await fetchOperations()
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {t.loading}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <AppShell
      role={role}
      activeView={activeView}
      setActiveView={setActiveView}
      language={language}
      setLanguage={setLanguage}
      t={t}
    >
      <div className="min-h-screen bg-[#f3f6fb]">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <div
            className={`mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${
              isArabic ? 'text-right' : 'text-left'
            }`}
          >
            <div>
              <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                {t.pageKicker}
              </p>

              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                {t.operationsAnalytics}
              </h1>

              <p className="mt-2 text-sm font-medium text-slate-500">
                {t.operationsAnalyticsSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                {t.role}:{' '}
                <span className="font-black capitalize text-slate-900">
                  {role}
                </span>
              </div>

              <button
                onClick={() => setActiveView('create')}
                className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-slate-800"
              >
                + {t.newOperation}
              </button>
            </div>
          </div>

          {activeView === 'dashboard' && (
            <div className="space-y-6">
              <OperationsAnalytics operations={operations} />
            </div>
          )}

          {activeView === 'command' && (
            <AICommandCenter operations={operations} t={t} />
          )}

          {activeView === 'create' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`mb-5 ${isArabic ? 'text-right' : 'text-left'}`}>
                <h2 className="text-xl font-black text-slate-950">
                  {t.createNewOperation}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {t.createNewOperationSubtitle}
                </p>
              </div>

              {canCreate ? (
                <OperationForm
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  priority={priority}
                  setPriority={setPriority}
                  assignedTo={assignedTo}
                  setAssignedTo={setAssignedTo}
                  dueDate={dueDate}
                  setDueDate={setDueDate}
                  analyzing={analyzing}
                  analyzeOperation={analyzeOperation}
                  analysis={analysis}
                  loading={loading}
                  createOperation={createOperation}
                  message={message}
                />
              ) : (
                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                  {t.viewOnlyAccess}
                </div>
              )}
            </div>
          )}

          {activeView === 'feed' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <OperationsFeed
                operations={filteredOperations}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onDelete={handleDelete}
                refreshOperations={fetchOperations}
                role={role}
                canCreate={canCreate}
                canDelete={canDelete}
              />
            </div>
          )}

          {activeView === 'board' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <KanbanBoard
                operations={filteredOperations}
                onDelete={handleDelete}
                refreshOperations={fetchOperations}
                role={role}
                canCreate={canCreate}
                canDelete={canDelete}
              />
            </div>
          )}

          {activeView === 'analytics' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <AnalyticsDashboard operations={filteredOperations} />
            </div>
          )}

          {activeView === 'insights' && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <AIInsightsPanel operations={filteredOperations} />
            </div>
          )}

          {activeView === 'automation' && (
            <AutomationControlCenter operations={operations} />
          )}

          {activeView === 'team' && (
            <TeamCoordinationCenter operations={operations} />
          )}

          {activeView === 'predictive' && (
            <PredictiveOperations operations={operations} />
          )}

          {activeView === 'notifications' && (
            <NotificationsHub operations={operations} />
          )}

          {activeView === 'settings' && (
            <SettingsPage
              role={role}
              operationsCount={operations.length}
            />
          )}

          {activeView === 'executive' && (
            <ExecutiveCommandView operations={operations} t={t} />
          )}

          {activeView === 'mission' && (
            <AIMissionPlanning operations={operations} t={t} />
          )}
        </div>
      </div>
    </AppShell>
  )
}
