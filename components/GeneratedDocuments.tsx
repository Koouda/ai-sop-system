'use client'

import { useEffect, useState } from 'react'
import { Download, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface GeneratedDocumentsProps {
  operationId: string
}

export default function GeneratedDocuments({
  operationId,
}: GeneratedDocumentsProps) {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const fetchDocuments = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('generated_documents')
      .select('*')
      .eq('operation_id', operationId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setDocuments(data || [])
    setLoading(false)
  }

  const downloadFile = async (
    documentId: string,
    title: string,
    format: 'docx' | 'pdf'
  ) => {
    try {
      setDownloadingId(`${documentId}-${format}`)

      const res = await fetch(`/api/export-${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
        }),
      })

      if (!res.ok) {
        alert(`Failed to export ${format.toUpperCase()}`)
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `${title}.${format}`

      document.body.appendChild(a)
      a.click()
      a.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      alert(`${format.toUpperCase()} export failed`)
    } finally {
      setDownloadingId(null)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [operationId])

  if (loading) {
    return (
      <p className="text-sm text-slate-400">
        Loading generated documents...
      </p>
    )
  }

  if (documents.length === 0) {
    return null
  }

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Generated Documents
        </p>

        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
          {documents.length}
        </span>
      </div>

      <div className="space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <FileText size={18} className="text-slate-500" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  {doc.title}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-400">
                  {doc.document_type}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <button
                onClick={() => downloadFile(doc.id, doc.title, 'docx')}
                disabled={downloadingId === `${doc.id}-docx`}
                className="flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={14} />
                {downloadingId === `${doc.id}-docx`
                  ? 'Downloading...'
                  : 'DOCX'}
              </button>

              <button
                onClick={() => downloadFile(doc.id, doc.title, 'pdf')}
                disabled={downloadingId === `${doc.id}-pdf`}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download size={14} />
                {downloadingId === `${doc.id}-pdf`
                  ? 'Downloading...'
                  : 'PDF'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}