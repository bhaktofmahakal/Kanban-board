export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export type TaskStatus = 'todo' | 'inprogress' | 'done'
