/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { AppError, failure, success } from './lib/http.js'
import generateRouter from './routes/generate.js'
import chatRouter from './routes/chat.js'

// load env
dotenv.config()

const app: express.Application = express()
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
const isDev = process.env.NODE_ENV !== 'production'

app.use(
  cors({
    origin: corsOrigin,
  }),
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!isDev) {
    next()
    return
  }

  const startedAt = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - startedAt
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`)
  })
  next()
})

/**
 * health
 */
app.use(
  '/api/health',
  (_req: Request, res: Response): void => {
    res.status(200).json(
      success({
        message: 'ok',
        service: 'meta_design_api',
      }),
    )
  },
)

app.use('/api/error-test', () => {
  throw new AppError('这是一个用于验证错误处理的测试接口', {
    statusCode: 400,
    code: 'ERROR_TEST',
  })
})

app.use('/api', generateRouter)
app.use('/api', chatRouter)

/**
 * error handler middleware
 */
app.use((error: Error, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(error)
    return
  }
  const appError = error instanceof AppError
    ? error
    : new AppError('Server internal error', {
        statusCode: 500,
        code: 'INTERNAL_ERROR',
      })

  res.status(appError.statusCode).json(failure(appError.code, appError.message))
})

/**
 * 404 handler
 */
app.use((_req: Request, res: Response) => {
  res.status(404).json(failure('NOT_FOUND', 'API not found'))
})

export default app
