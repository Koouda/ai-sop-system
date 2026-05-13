'use client'

import {
  DragDropContext,
  Droppable,
  Draggable,
} from '@hello-pangea/dnd'

import OperationCard from './OperationCard'
import { supabase } from '../lib/supabase'

const columns = [
  { key: 'new', label: 'New', dot: 'bg-blue-500' },
  { key: 'in_progress', label: 'In Progress', dot: 'bg-violet-500' },
  { key: 'waiting', label: 'Waiting', dot: 'bg-amber-500' },
  { key: 'completed', label: 'Completed', dot: 'bg-emerald-500' },
  { key: 'cancelled', label: 'Cancelled', dot: 'bg-slate-400' },
]

export default function KanbanBoard({
  operations,
  onDelete,
  refreshOperations,
  role,
  canCreate,
  canDelete,
}: any) {
  async function handleDragEnd(result: any) {
    if (!result.destination) return
    if (!canCreate) return

    const operationId = result.draggableId
    const newStatus = result.destination.droppableId

    const operation = operations.find(
      (op: any) => op.id.toString() === operationId
    )

    if (!operation) return
    if (operation.status === newStatus) return

    const { error } = await supabase
      .from('operations')
      .update({
        status: newStatus,
      })
      .eq('id', operationId)

    if (error) {
      console.error(error)
      return
    }

    await refreshOperations()
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex min-w-max gap-5">
          {columns.map((column) => {
            const columnOperations = operations.filter(
              (op: any) => op.status === column.key
            )

            return (
              <div
                key={column.key}
                className="flex h-[calc(100vh-320px)] min-h-[560px] w-[320px] flex-shrink-0 flex-col rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
                    <h3 className="text-base font-bold text-slate-950">
                      {column.label}
                    </h3>
                  </div>

                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                    {columnOperations.length}
                  </span>
                </div>

                <Droppable droppableId={column.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 space-y-3 overflow-y-auto rounded-2xl p-1 transition ${
                        snapshot.isDraggingOver
                          ? 'bg-indigo-50'
                          : 'bg-transparent'
                      }`}
                    >
                      {columnOperations.length === 0 && (
                        <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
                          <p className="text-sm font-medium text-slate-400">
                            No operations
                          </p>
                        </div>
                      )}

                      {columnOperations.map((op: any, index: number) => (
                        <Draggable
                          key={op.id}
                          draggableId={op.id.toString()}
                          index={index}
                          isDragDisabled={!canCreate}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition ${
                                snapshot.isDragging
                                  ? 'rotate-1 scale-[1.02] opacity-95'
                                  : ''
                              }`}
                            >
                              <OperationCard
                                operation={op}
                                onDelete={onDelete}
                                refreshOperations={refreshOperations}
                                role={role}
                                canCreate={canCreate}
                                canDelete={canDelete}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </div>
    </DragDropContext>
  )
}