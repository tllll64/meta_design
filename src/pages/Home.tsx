import { useEffect, useMemo, useState } from 'react';
import { getHealth, type HealthResponse } from '@/lib/apiClient';

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: HealthResponse; ms: number }
  | { status: 'error'; message: string };

export default function Home() {
  const [state, setState] = useState<LoadState>({ status: 'idle' });

  const badge = useMemo(() => {
    if (state.status === 'success') return { label: '已连通', cls: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/20' };
    if (state.status === 'error') return { label: '未连通', cls: 'bg-rose-500/15 text-rose-200 border-rose-500/20' };
    if (state.status === 'loading') return { label: '检测中', cls: 'bg-amber-500/15 text-amber-200 border-amber-500/20' };
    return { label: '未检测', cls: 'bg-zinc-500/15 text-zinc-200 border-zinc-500/20' };
  }, [state.status]);

  async function ping() {
    setState({ status: 'loading' });
    const t0 = performance.now();
    try {
      const data = await getHealth();
      const ms = Math.round(performance.now() - t0);
      setState({ status: 'success', data, ms });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setState({ status: 'error', message });
    }
  }

  useEffect(() => {
    void ping();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Meta Design · 原型骨架</h1>
            <p className="mt-2 text-sm text-zinc-400">
              这是最小可运行的 React + Node.js（Express）骨架：前端通过 Vite 代理调用后端 <span className="font-mono">/api/health</span>。
            </p>
          </div>
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${badge.cls}`}>{badge.label}</span>
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">后端连通性</div>
              <div className="mt-1 text-xs text-zinc-400">目标接口：GET /api/health（后端默认端口 3001）</div>
            </div>
            <button
              type="button"
              onClick={() => void ping()}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 transition hover:bg-zinc-800 active:translate-y-px"
            >
              重新检测
            </button>
          </div>

          <div className="mt-4">
            {state.status === 'loading' && (
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-2/3 rounded bg-zinc-800" />
                <div className="h-4 w-1/2 rounded bg-zinc-800" />
              </div>
            )}

            {state.status === 'success' && (
              <div className="grid gap-3">
                <div className="text-xs text-zinc-400">耗时：{state.ms}ms</div>
                <pre className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-200">
                  {JSON.stringify(state.data, null, 2)}
                </pre>
              </div>
            )}

            {state.status === 'error' && (
              <div className="grid gap-3">
                <div className="text-xs text-rose-300">请求失败</div>
                <pre className="overflow-auto rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-100">
                  {state.message}
                </pre>
                <div className="text-xs text-zinc-400">
                  常见原因：后端未启动 / 端口不一致 / 代理未生效。
                </div>
              </div>
            )}

            {state.status === 'idle' && <div className="text-sm text-zinc-400">点击“重新检测”开始。</div>}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="text-sm font-medium">下一步你可以做什么</div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            <li>把 <span className="font-mono">/api/health</span> 替换成你的业务 API（项目/生成/导出）。</li>
            <li>把 <span className="font-mono">proposal.md</span> 的研究问题落到页面与数据模型上。</li>
            <li>继续用 <span className="font-mono">test.html</span> 做交互/能力验证草稿。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
