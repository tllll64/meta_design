import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { slides as baseSlides, slideSections } from '@/apps/demo/slides/slidesData';
import { SlideView } from '@/apps/demo/slides/SlideView';
import { TocDrawer } from '@/apps/demo/slides/TocDrawer';
import { useGlobalKeydown } from '@/hooks/useGlobalKeydown';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileDown, Keyboard, LayoutList, Maximize, Minimize } from 'lucide-react';
import { useSlidesEdits } from '@/apps/demo/slides/useSlidesEdits';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function toggleFullscreen() {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

export function SlidesDeck() {
  const { slides, updateSlideField, updateBlock, appendBlock, clearAll } = useSlidesEdits(baseSlides);
  const [params, setParams] = useSearchParams();
  const initialIndex = useMemo(() => {
    const raw = params.get('i');
    const num = raw ? Number(raw) : 0;
    return Number.isFinite(num) ? clamp(Math.trunc(num), 0, baseSlides.length - 1) : 0;
  }, [params]);

  const [index, setIndex] = useState(initialIndex);
  const [tocOpen, setTocOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [typeOpen, setTypeOpen] = useState(false);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const progress = ((index + 1) / slides.length) * 100;

  function jump(next: number) {
    const clamped = clamp(next, 0, slides.length - 1);
    setIndex(clamped);
    setParams({ i: String(clamped) }, { replace: true });
  }

  function next() {
    jump(index + 1);
  }

  function prev() {
    jump(index - 1);
  }

  useGlobalKeydown(
    e => {
      if (e.defaultPrevented) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      const editing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement | null)?.isContentEditable;
      if (editing) return;

      if (typeOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setTypeOpen(false);
        }
        return;
      }

      if (helpOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setHelpOpen(false);
        }
        return;
      }

      if (tocOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setTocOpen(false);
        }
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        next();
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === ' ' && !e.shiftKey) {
        e.preventDefault();
        next();
        return;
      }
      if (e.key === ' ' && e.shiftKey) {
        e.preventDefault();
        prev();
        return;
      }
      if (e.key === 'Home') {
        e.preventDefault();
        jump(0);
        return;
      }
      if (e.key === 'End') {
        e.preventDefault();
        jump(slides.length - 1);
        return;
      }
      if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        setTocOpen(v => !v);
        return;
      }
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        void toggleFullscreen();
        return;
      }
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setHelpOpen(true);
      }
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          e.preventDefault();
          void toggleFullscreen();
        }
      }
    },
    true
  );

  const slide = slides[index];
  const indexLabel = `${index + 1}/${slides.length}`;

  function addText(kind: 'subtitle' | 'body' | 'quote') {
    appendBlock(slide.id, { type: 'text', variant: kind, text: '' });
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-[min(96vw,1680px)] items-center justify-between gap-4 px-6 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900">{slide.title}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
                index === 0
                  ? 'cursor-not-allowed border-zinc-200 bg-white text-zinc-300'
                  : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100'
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </button>
            <button
              type="button"
              onClick={next}
              disabled={index === slides.length - 1}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
                index === slides.length - 1
                  ? 'cursor-not-allowed border-zinc-200 bg-white text-zinc-300'
                  : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100'
              )}
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="mx-1 h-6 w-px bg-zinc-200" />

            <button
              type="button"
              onClick={() => setTocOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            >
              <LayoutList className="h-4 w-4" />
              目录
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            >
              重置编辑
            </button>
            <Link
              to="/slides/print"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            >
              <FileDown className="h-4 w-4" />
              打印/PDF
            </Link>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            >
              <Keyboard className="h-4 w-4" />
              快捷键
            </button>
            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              {isFullscreen ? '退出全屏' : '全屏'}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[min(96vw,1680px)] px-6 pb-3">
          <div className="flex items-center justify-between gap-4">
            <div className="h-1 w-full max-w-xl overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto px-6 py-6">
        <div className="mx-auto aspect-video w-[min(96vw,1680px,calc((100svh-200px)*1.7778))]">
          <SlideView
            slide={slide}
            indexLabel={indexLabel}
            edit={{
              updateSlideField: (field, value) => updateSlideField(slide.id, field, value),
              updateBlock: (blockIndex, override) => updateBlock(slide.id, blockIndex, override),
            }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            提示：←/→ 翻页 · T 目录 · F 全屏 · ? 快捷键 · Esc 退出全屏
          </div>
          <Link to="/" className="text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline">
            返回首页
          </Link>
        </div>
      </main>

      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
        <div className="relative">
          {typeOpen ? (
            <div className="absolute bottom-14 left-1/2 w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100"
                  onClick={() => {
                    addText('subtitle');
                    setTypeOpen(false);
                  }}
                >
                  小标题
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100"
                  onClick={() => {
                    addText('body');
                    setTypeOpen(false);
                  }}
                >
                  正文
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100"
                  onClick={() => {
                    addText('quote');
                    setTypeOpen(false);
                  }}
                >
                  引用
                </button>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            aria-label="添加文本"
            className="grid h-12 w-12 place-items-center rounded-full border border-zinc-200 bg-white text-base font-semibold text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.10)] hover:bg-zinc-100"
            onClick={() => setTypeOpen(v => !v)}
          >
            T
          </button>
        </div>
      </div>

      <TocDrawer
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        sections={slideSections}
        slides={slides}
        currentIndex={index}
        onJump={idx => {
          jump(idx);
          setTocOpen(false);
        }}
      />

      {helpOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="关闭"
            className="absolute inset-0 bg-black/25"
            onClick={() => setHelpOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[min(640px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-zinc-200 bg-white/95 p-6 backdrop-blur">
            <div className="text-sm font-semibold text-zinc-900">快捷键</div>
            <div className="mt-1 text-xs text-zinc-500">用于答辩现场快速控制</div>
            <div className="mt-4 grid gap-2 text-sm text-zinc-900">
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <span>上一页 / 下一页</span>
                <span className="font-mono text-xs text-zinc-600">←/→ 或 PgUp/PgDn 或 Space</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <span>首页 / 末页</span>
                <span className="font-mono text-xs text-zinc-600">Home / End</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <span>目录</span>
                <span className="font-mono text-xs text-zinc-600">T</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <span>全屏</span>
                <span className="font-mono text-xs text-zinc-600">F</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                <span>退出全屏</span>
                <span className="font-mono text-xs text-zinc-600">Esc</span>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
