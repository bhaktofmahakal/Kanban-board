import { useState } from 'react'
import { Task, TaskInput, TaskStatus } from './types'
import { TaskColumn } from './components/TaskColumn'
import { TaskForm } from './components/TaskForm'
import { useTasks } from './hooks/useTasks'
import { Plus } from 'lucide-react'

function App() {
  const { tasks, loading, error, addTask, updateTask, deleteTask, moveTask } = useTasks()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>('todo')
  const [formLoading, setFormLoading] = useState(false)

  const handleAddTask = async (data: TaskInput) => {
    setFormLoading(true)
    try {
      await addTask(data)
      setShowForm(false)
      setEditingTask(null)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateTask = async (data: TaskInput) => {
    if (!editingTask) return
    setFormLoading(true)
    try {
      await updateTask(editingTask.id, data)
      setShowForm(false)
      setEditingTask(null)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTask(null)
    setNewTaskStatus('todo')
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo')
  const inprogressTasks = tasks.filter((t) => t.status === 'inprogress')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)',
        }}
      />

      <div className="relative z-10">
        <header className="bg-white bg-opacity-80 backdrop-blur-sm shadow-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
                <p className="text-sm text-gray-600">Organize your tasks with ease</p>
              </div>
              <button
                onClick={() => {
                  setEditingTask(null)
                  setNewTaskStatus('todo')
                  setShowForm(true)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus size={20} />
                New Task
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          </div>
        ) : (
          <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TaskColumn
                status="todo"
                title="To Do"
                tasks={todoTasks}
                onDelete={deleteTask}
                onEdit={handleEdit}
                onMove={moveTask}
              />
              <TaskColumn
                status="inprogress"
                title="In Progress"
                tasks={inprogressTasks}
                onDelete={deleteTask}
                onEdit={handleEdit}
                onMove={moveTask}
              />
              <TaskColumn
                status="done"
                title="Done"
                tasks={doneTasks}
                onDelete={deleteTask}
                onEdit={handleEdit}
                onMove={moveTask}
              />
            </div>
          </main>
        )}
      </div>

      {showForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onClose={handleCloseForm}
          initialTask={editingTask || undefined}
          initialStatus={newTaskStatus}
          isLoading={formLoading}
        />
      )}
    </div>
  )
}

export default App
