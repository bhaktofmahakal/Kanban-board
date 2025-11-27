import axios from 'axios'
import { Task, TaskInput } from '../types'

const rawApiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api'
const normalizedApiUrl = rawApiUrl.replace(/\/$/, '')
const API_URL = normalizedApiUrl.endsWith('/api') ? normalizedApiUrl : `${normalizedApiUrl}/api`
const STORAGE_KEY = 'kanban_tasks'

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

export const taskService = {
  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>('/tasks')
      return response.data
    } catch (error) {
      console.warn('Failed to fetch from API, using local storage')
      return taskService.getLocalTasks()
    }
  },

  async createTask(data: TaskInput): Promise<Task> {
    try {
      const response = await api.post<Task>('/tasks', data)
      return response.data
    } catch (error) {
      console.warn('Failed to create task via API, using local storage')
      return taskService.createLocalTask(data)
    }
  },

  async updateTask(id: string, data: Partial<TaskInput>): Promise<Task> {
    try {
      const response = await api.patch<Task>(`/tasks/${id}`, data)
      return response.data
    } catch (error) {
      console.warn('Failed to update task via API, using local storage')
      return taskService.updateLocalTask(id, data)
    }
  },

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`)
    } catch (error) {
      console.warn('Failed to delete task via API, using local storage')
      taskService.deleteLocalTask(id)
    }
  },

  getLocalTasks(): Task[] {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveLocalTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  createLocalTask(data: TaskInput): Task {
    const tasks = taskService.getLocalTasks()
    const newTask: Task = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    tasks.push(newTask)
    taskService.saveLocalTasks(tasks)
    return newTask
  },

  updateLocalTask(id: string, data: Partial<TaskInput>): Task {
    const tasks = taskService.getLocalTasks()
    const index = tasks.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Task not found')

    tasks[index] = {
      ...tasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    taskService.saveLocalTasks(tasks)
    return tasks[index]
  },

  deleteLocalTask(id: string): void {
    const tasks = taskService.getLocalTasks()
    const filtered = tasks.filter((t) => t.id !== id)
    taskService.saveLocalTasks(filtered)
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}
