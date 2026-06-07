import type { Slide, SlideSection } from '@/apps/demo/slides/types';
import { cn } from '@/lib/utils';
import { ChevronRight, X } from 'lucide-react';

export function TocDrawer({
  open,
  onClose,
  sections,
  slides,
  currentIndex,
  onJump,
}: {
  open: boolean;
  onClose: () => void;
  sections: SlideSection[];
  slides: Slide[];
  currentIndex: number;
  onJump: (index: number) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="关闭目录"
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-zinc-200 bg-white/95 p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-zinc-900">目录</div>
            <div className="mt-1 text-xs text-zinc-500">点击跳转（快捷键：T）</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 hover:bg-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 h-[calc(100vh-96px)] overflow-auto pr-1">
          <div className="space-y-4">
            {sections.map(sec => (
              <div key={sec.name} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <div className="text-xs font-medium tracking-wide text-zinc-600">{sec.name}</div>
                <div className="mt-2 space-y-1">
                  {sec.slideIds
                    .map(id => slides.find(s => s.id === id))
                    .filter(Boolean)
                    .map(s => {
                      const slide = s as Slide;
                      const idx = slides.findIndex(x => x.id === slide.id);
                      const active = idx === currentIndex;
                      return (
                        <button
                          key={slide.id}
                          type="button"
                          onClick={() => onJump(idx)}
                          className={cn(
                            'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition',
                            active
                              ? 'border-indigo-600/20 bg-indigo-600/10 text-indigo-900'
                              : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100'
                          )}
                        >
                          <div className="min-w-0">
                            <div className="truncate">{slide.title}</div>
                            <div className="mt-1 text-xs text-zinc-500">
                              {idx + 1}/{slides.length}
                              {slide.todo ? ' · TODO' : ''}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 opacity-60" />
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
