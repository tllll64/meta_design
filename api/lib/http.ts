export type ApiErrorBody = {
  code: string
  message: string
}

export type ApiSuccess<T> = {
  success: true
  data: T
}

export type ApiFailure = {
  success: false
  error: ApiErrorBody
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export class AppError extends Error {
  statusCode: number
  code: string

  constructor(message: string, options?: { statusCode?: number; code?: string }) {
    super(message)
    this.name = 'AppError'
    this.statusCode = options?.statusCode ?? 500
    this.code = options?.code ?? 'INTERNAL_ERROR'
  }
}

export function success<T>(data: T): ApiSuccess<T> {
  return {
    success: true,
    data,
  }
}

export function failure(code: string, message: string): ApiFailure {
  return {
    success: false,
    error: {
      code,
      message,
    },
  }
}
