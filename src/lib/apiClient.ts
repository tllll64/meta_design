export type HealthResponse = {
  success: boolean;
  message: string;
};

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return (await res.json()) as HealthResponse;
}

