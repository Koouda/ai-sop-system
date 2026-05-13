'use client'

import { useEffect, useState } from 'react'
import {
  Trash2,
  CalendarDays,
  User2,
  MoreHorizontal,
  Sparkles,
} from 'lucide-react'

import { supabase } from '../lib/supabase'

interface OperationCardProps {
  operation: any
  onDelete: (id: string) => void
  refreshOperations: () => void
  role: string
  canCreate: boolean
  canDelete: boolean
}

export default function OperationCard({
  operation,
  onDelete,
  refreshOperations,
  role,
  canCreate,
  canDelete,
}: OperationCardProps) {
  const [generating, setGenerating] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [documentMessage, setDocumentMessage] = useState('')
  const [workflowPriority, setWorkflowPriority] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const priorityColors: any = {
    low: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
    critical: 'bg-red-100 text-red-700',
  }

  const statusColors: any = {
    new: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-violet-100 text-violet-700',
    waiting: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-slate-200 text-slate-700',
  }

  const loadSavedWorkflow = async () => {
    const { data, error } = await supabase
      .from('operation_workflows')
      .select('workflow_priority')
      .eq('operation_id', operation.id)
      .maybeSingle()

    if (error) {
      console.error(error)
      return
    }

    setWorkflowPriority(data?.workflow_priority || '')
  }

  useEffect(() => {
    loadSavedWorkflow()
  }, [operation.id])

  const generateDocument = async (documentType: string) => {
    if (!canCreate) {
      setDocumentMessage('No permission')
      return
    }

    setGenerating(true)
    setDocumentMessage('')

    try {
      const res = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationId: operation.id,
          documentType,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setDocumentMessage(data.error || 'Generation failed')
        return
      }

      setDocumentMessage(`${documentType} generated`)
      setMenuOpen(false)
      await refreshOperations()
    } catch (error) {
      setDocumentMessage('Generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const suggestDocuments = async () => {
    if (!canCreate) return

    setSuggesting(true)
    setDocumentMessage('')

    try {
      const res = await fetch('/api/workflow-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationId: operation.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setDocumentMessage(data.error || 'Suggestion failed')
        return
      }

      setWorkflowPriority(data.workflow_priority || workflowPriority)
      setDocumentMessage('AI suggestions updated')
      setMenuOpen(false)
      await refreshOperations()
    } catch (error) {
      setDocumentMessage('Suggestion failed')
    } finally {
      setSuggesting(false)
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              priorityColors[operation.priority] ||
              'bg-slate-100 text-slate-700'
            }`}
          >
            {operation.priority || 'unknown'}
          </span>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              statusColors[operation.status] ||
              'bg-slate-100 text-slate-700'
            }`}
          >
            {(operation.status || 'unknown').replace('_', ' ')}
          </span>

          {workflowPriority && (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
              {workflowPriority}
            </span>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
          >
            <MoreHorizontal size={18} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              {canCreate && (
                <>
                  <button
                    type="button"
                    onClick={suggestDocuments}
                    disabled={suggesting}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Sparkles size={16} />
                    {suggesting ? 'Suggesting...' : 'AI Suggest'}
                  </button>

                  <button
                    type="button"
                    onClick={() => generateDocument('Incident Report')}
                    disabled={generating}
                    className="flex w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Incident Report
                  </button>

                  <button
                    type="button"
                    onClick={() => generateDocument('Action Checklist')}
                    disabled={generating}
                    className="flex w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Action Checklist
                  </button>

                  <button
                    type="button"
                    onClick={() => generateDocument('SOP')}
                    disabled={generating}
                    className="flex w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    SOP
                  </button>

                  <button
                    type="button"
                    onClick={() => generateDocument('Risk Assessment')}
                    disabled={generating}
                    className="flex w-full rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Risk Assessment
                  </button>
                </>
              )}

              {canDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(operation.id)}
                  className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <h3 className="line-clamp-2 text-xl font-black leading-8 tracking-tight text-slate-950">
        {operation.title || 'Untitled Operation'}
      </h3>

      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
        {operation.description || 'No description provided'}
      </p>

      <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500">
        {operation.assigned_to && (
          <div className="flex items-center gap-2">
            <User2 size={15} />
            <span className="line-clamp-1">{operation.assigned_to}</span>
          </div>
        )}

        {operation.due_date && (
          <div className="flex items-center gap-2">
            <CalendarDays size={15} />
            <span>{operation.due_date}</span>
          </div>
        )}
      </div>

      {documentMessage && (
        <p className="mt-4 line-clamp-1 text-xs font-medium text-slate-500">
          {documentMessage}
        </p>
      )}
    </div>
  )
}