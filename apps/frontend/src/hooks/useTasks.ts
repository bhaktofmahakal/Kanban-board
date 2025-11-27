import { useState, useEffect, useCallback } from 'react'
import { Task, TaskInput, TaskStatus } from '../types'
import { taskService } from '../services/taskService'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await taskService.getTasks()
      setTasks(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks'
      setError(message)
      console.error('Load tasks error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const addTask = useCallback(
    async (input: TaskInput) => {
      try {
        setError(null)
        const newTask = await taskService.createTask(input)
        setTasks((prev) => [...prev, newTask])
        return newTask
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add task'
        setError(message)
        console.error('Add task error:', err)
        throw err
      }
    },
    []
  )

  const updateTask = useCallback(
    async (id: string, updates: Partial<TaskInput>) => {
      try {
        setError(null)
        const updated = await taskService.updateTask(id, updates)
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updated : task))
        )
        return updated
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update task'
        setError(message)
        console.error('Update task error:', err)
        throw err
      }
    },
    []
  )

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        setError(null)
        await taskService.deleteTask(id)
        setTasks((prev) => prev.filter((task) => task.id !== id))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete task'
        setError(message)
        console.error('Delete task error:', err)
        throw err
      }
    },
    []
  )

  const moveTask = useCallback(
    async (id: string, status: TaskStatus) => {
      return updateTask(id, { status })
    },
    [updateTask]
  )

  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return tasks.filter((task) => task.status === status)
    },
    [tasks]
  )

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByStatus,
    refetch: loadTasks,
  }
}
