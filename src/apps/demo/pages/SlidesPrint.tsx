import { Link } from 'react-router-dom';
import { slides as baseSlides } from '@/apps/demo/slides/slidesData';
import { SlideView } from '@/apps/demo/slides/SlideView';
import { FileDown, ArrowLeft } from 'lucide-react';
import { useSlidesEdits } from '@/apps/demo/slides/useSlidesEdits';

export default function SlidesPrint() {
  const { slides } = useSlidesEdits(baseSlides);
  return (
    <div className="min-h-screen bg-white text-zinc-900 print:bg-white">
      <div className="no-print sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-6 py-4">
          <div>
            <div className="text-sm font-semibold">打印 / 导出 PDF</div>
            <div className="mt-1 text-xs text-zinc-500">建议：浏览器打印 → 保存为 PDF（每页 16:9）</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/slides"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 transition hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              返回演示
            </Link>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-500"
            >
              <FileDown className="h-4 w-4" />
              打开打印对话框
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="no-print mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          <div className="font-medium text-zinc-900">导出前检查</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>确认 TODO 标记的页面是否已替换为真实内容</li>
            <li>确认图片占位是否已补齐（避免空白页）</li>
            <li>打印设置建议：开启“背景图形”（如果你想保留深色背景）</li>
          </ul>
        </div>

        <div className="space-y-10">
          {slides.map((s, idx) => (
            <div key={s.id} className="print-page">
              <div className="aspect-video w-full">
                <SlideView slide={s} indexLabel={`${idx + 1}/${slides.length}`} variant="print" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
