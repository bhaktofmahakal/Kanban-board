import React from 'react'
import { Task, TaskStatus } from '../types'
import { TaskCard } from './TaskCard'

interface TaskColumnProps {
  status: TaskStatus
  title: string
  tasks: Task[]
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onMove: (id: string, status: TaskStatus) => void
}

const columnColors: Record<TaskStatus, string> = {
  todo: 'border-t-4 border-t-red-500',
  inprogress: 'border-t-4 border-t-yellow-500',
  done: 'border-t-4 border-t-green-500',
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  onDelete,
  onEdit,
  onMove,
}) => {
  return (
    <div className={`flex-1 min-h-screen max-h-screen overflow-y-auto p-4 bg-gray-50 rounded-lg ${columnColors[status]}`}>
      <div className="mb-4 sticky top-0 bg-gray-50 pb-2">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{tasks.length} task(s)</p>
      </div>

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No tasks yet</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
            />
          ))
        )}
      </div>
    </div>
  )
}
