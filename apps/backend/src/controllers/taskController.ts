import { Request, Response } from 'express'
import { query } from '../db/index.js'
import { Task, TaskInput } from '../types/index.js'

const parseRow = (row: any): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const getTasks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    )
    const tasks: Task[] = result.rows.map(parseRow)
    res.json(tasks)
  } catch (err) {
    console.error('Get tasks error:', err)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
}

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status = 'todo' }: TaskInput = req.body

    if (!title?.trim()) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    if (!['todo', 'inprogress', 'done'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' })
      return
    }

    const result = await query(
      'INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *',
      [title, description || '', status]
    )

    const task: Task = parseRow(result.rows[0])
    res.status(201).json(task)
  } catch (err) {
    console.error('Create task error:', err)
    res.status(500).json({ error: 'Failed to create task' })
  }
}

export const getTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const result = await query('SELECT * FROM tasks WHERE id = $1', [id])

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const task: Task = parseRow(result.rows[0])
    res.json(task)
  } catch (err) {
    console.error('Get task error:', err)
    res.status(500).json({ error: 'Failed to fetch task' })
  }
}

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updates: Partial<TaskInput> = req.body

    const fields: string[] = []
    const values: unknown[] = []
    let paramCount = 1

    if (updates.title !== undefined) {
      if (!updates.title.trim()) {
        res.status(400).json({ error: 'Title cannot be empty' })
        return
      }
      fields.push(`title = $${paramCount++}`)
      values.push(updates.title)
    }

    if (updates.description !== undefined) {
      fields.push(`description = $${paramCount++}`)
      values.push(updates.description)
    }

    if (updates.status !== undefined) {
      if (!['todo', 'inprogress', 'done'].includes(updates.status)) {
        res.status(400).json({ error: 'Invalid status' })
        return
      }
      fields.push(`status = $${paramCount++}`)
      values.push(updates.status)
    }

    if (fields.length === 0) {
      res.status(400).json({ error: 'No fields to update' })
      return
    }

    fields.push(`updated_at = $${paramCount++}`)
    values.push(new Date().toISOString())
    values.push(id)

    const result = await query(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    const task: Task = parseRow(result.rows[0])
    res.json(task)
  } catch (err) {
    console.error('Update task error:', err)
    res.status(500).json({ error: 'Failed to update task' })
  }
}

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id])

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Task not found' })
      return
    }

    res.status(204).send()
  } catch (err) {
    console.error('Delete task error:', err)
    res.status(500).json({ error: 'Failed to delete task' })
  }
}
