import pkg from 'pg'
import { config } from 'dotenv'

config()

const { Pool } = pkg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params)
}

export const getClient = async () => {
  return pool.connect()
}

export const initializeDatabase = async (): Promise<void> => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) NOT NULL CHECK (status IN ('todo', 'inprogress', 'done')) DEFAULT 'todo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
    `)
    console.log('Database initialized successfully')
  } catch (err) {
    console.error('Failed to initialize database:', err)
    throw err
  }
}

export const closeDatabase = async (): Promise<void> => {
  await pool.end()
}
