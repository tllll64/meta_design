import { Link } from 'react-router-dom';
import { ArrowLeft, FileDown } from 'lucide-react';
import { slides as baseSlides } from '@/apps/demo/slides/slidesData';
import { useSlidesEdits } from '@/apps/demo/slides/useSlidesEdits';
import { ReportSection } from '@/apps/demo/report/ReportSection';

export default function ReportPrint() {
  const { slides } = useSlidesEdits(baseSlides);

  return (
    <div className="min-h-screen bg-white text-zinc-900 print:bg-white">
      <div className="no-print sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <div>
            <div className="text-sm font-semibold">HTML 报告打印</div>
            <div className="mt-1 text-xs text-zinc-500">建议：浏览器打印后保存为 PDF</div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 transition hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              返回报告
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

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="no-print mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          <div className="font-medium text-zinc-900">导出前检查</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>确认 TODO 标记内容是否已补完</li>
            <li>确认图片资源是否已导入</li>
            <li>建议保存为 A4 纵向 PDF</li>
          </ul>
        </div>

        <article className="rounded-[28px] border border-zinc-200 bg-white px-8 py-10 md:px-12">
          {slides.map((slide, index) => (
            <ReportSection key={slide.id} slide={slide} index={index} editable={false} />
          ))}
        </article>
      </main>
    </div>
  );
}
