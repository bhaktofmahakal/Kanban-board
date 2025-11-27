import express from 'express'
import cors, { CorsOptions } from 'cors'
import { config } from 'dotenv'
import { initializeDatabase, closeDatabase } from './db/index.js'
import taskRoutes from './routes/tasks.js'

config()

const app = express()
const PORT = process.env.PORT || 3000

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ''))

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true)
    }
    const normalizedOrigin = origin.replace(/\/$/, '')
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}

app.use(express.json())
app.use(cors(corsOptions))

app.get('/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' })
})

app.use(['/api/tasks', '/tasks'], taskRoutes)

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

const startServer = async () => {
  try {
    await initializeDatabase()

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await closeDatabase()
  process.exit(0)
})

startServer()
