import { Link } from 'react-router-dom';
import { FileDown, RotateCcw } from 'lucide-react';
import { slides as baseSlides, slideSections } from '@/apps/demo/slides/slidesData';
import { useSlidesEdits } from '@/apps/demo/slides/useSlidesEdits';
import { ReportSection } from '@/apps/demo/report/ReportSection';

export default function Report() {
  const { slides, updateSlideField, updateBlock, clearAll } = useSlidesEdits(baseSlides);
  const cover = slides[0];

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-zinc-900">
      <div className="sticky top-0 z-40 border-b border-black/8 bg-[#f7f4ee]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-zinc-900">{cover?.title ?? 'HTML 报告'}</div>
            <div className="text-xs text-zinc-500">连续排版，可直接点击文内文字编辑</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            >
              <RotateCcw className="h-4 w-4" />
              重置编辑
            </button>
            <Link
              to="/report/print"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 transition hover:bg-zinc-100"
            >
              <FileDown className="h-4 w-4" />
              打印/PDF
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-black/8 bg-white/75 p-5">
            <div className="text-xs uppercase tracking-[0.22em] text-zinc-500">目录</div>
            <div className="mt-4 space-y-4">
              {slideSections.map(section => (
                <div key={section.name}>
                  <div className="text-xs font-medium text-zinc-400">{section.name}</div>
                  <div className="mt-2 space-y-2">
                    {section.slideIds
                      .map(id => slides.find(s => s.id === id))
                      .filter(Boolean)
                      .map(slide => (
                        <a key={slide!.id} href={`#${slide!.id}`} className="block text-sm text-zinc-700 transition hover:text-zinc-950">
                          {slide!.title}
                        </a>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <section className="rounded-[32px] border border-black/8 bg-white px-8 py-10 md:px-12 md:py-14">
            <div className="max-w-4xl">
              <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">Midterm Report</div>
              <h1 className="slide-type-title mt-4 text-5xl leading-tight text-zinc-950 md:text-7xl">{cover?.title ?? 'HTML 报告'}</h1>
              <p className="slide-type-body mt-6 max-w-2xl text-zinc-600">
                这是一份连续阅读的 HTML 报告页面。你可以直接点击正文内容修改文案，随后再整理为最终版中期汇报材料。
              </p>
            </div>
          </section>

          <div className="mt-8 rounded-[32px] border border-black/8 bg-white px-8 py-10 md:px-12 md:py-14">
            <div className="max-w-4xl">
              {slides.map((slide, index) => (
                <ReportSection
                  key={slide.id}
                  slide={slide}
                  index={index}
                  editable
                  edit={{
                    updateSlideField: (field, value) => updateSlideField(slide.id, field, value),
                    updateBlock: (blockIndex, override) => updateBlock(slide.id, blockIndex, override),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
