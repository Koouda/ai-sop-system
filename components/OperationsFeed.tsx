'use client'

import { Search } from 'lucide-react'
import OperationCard from './OperationCard'

interface OperationsFeedProps {
  operations: any[]
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  onDelete: (id: string) => void
  refreshOperations: () => void

  role: string
  canCreate: boolean
  canDelete: boolean
}

export default function OperationsFeed({
  operations,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onDelete,
  refreshOperations,

  role,
  canCreate,
  canDelete,
}: OperationsFeedProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search operations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5">
        {operations.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">
              No operations found.
            </p>
          </div>
        ) : (
          operations.map((operation) => (
            <OperationCard
              key={operation.id}
              operation={operation}
              onDelete={onDelete}
              refreshOperations={refreshOperations}
              role={role}
              canCreate={canCreate}
              canDelete={canDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}