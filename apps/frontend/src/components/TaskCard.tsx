import React from 'react'
import { Task, TaskStatus } from '../types'
import { Trash2, ChevronRight, ChevronLeft } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onMove: (id: string, status: TaskStatus) => void
}

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-red-100 text-red-800',
  inprogress: 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800',
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
}

const statusOrder: Record<TaskStatus, number> = {
  todo: 0,
  inprogress: 1,
  done: 2,
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onEdit,
  onMove,
}) => {
  const canMovePrev = statusOrder[task.status] > 0
  const canMoveNext = statusOrder[task.status] < 2

  const handleMovePrev = () => {
    const statuses: TaskStatus[] = ['todo', 'inprogress', 'done']
    const currentIndex = statusOrder[task.status]
    if (currentIndex > 0) {
      onMove(task.id, statuses[currentIndex - 1])
    }
  }

  const handleMoveNext = () => {
    const statuses: TaskStatus[] = ['todo', 'inprogress', 'done']
    const currentIndex = statusOrder[task.status]
    if (currentIndex < 2) {
      onMove(task.id, statuses[currentIndex + 1])
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 flex-1 pr-2 break-words">
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors flex-shrink-0"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 break-words">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>

        <div className="flex gap-1">
          <button
            onClick={handleMovePrev}
            disabled={!canMovePrev}
            className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Move to previous status"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleMoveNext}
            disabled={!canMoveNext}
            className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed p-1 rounded hover:bg-gray-100 transition-colors"
            aria-label="Move to next status"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={() => onEdit(task)}
        className="w-full mt-3 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 py-1 rounded transition-colors"
      >
        Edit
      </button>
    </div>
  )
}
