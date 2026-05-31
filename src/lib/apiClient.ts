export type ApiErrorBody = {
  code: string;
  message: string;
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type HealthResponse = {
  message: string;
  service: string;
};

async function parseApiResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    if (!json.success && 'error' in json) {
      throw new Error(`${json.error.code}: ${json.error.message}`);
    }
    throw new Error(`HTTP ${res.status}`);
  }

  if (!json.success && 'error' in json) {
    throw new Error(`${json.error.code}: ${json.error.message}`);
  }

  return json.data;
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  return parseApiResponse<HealthResponse>(res);
}
