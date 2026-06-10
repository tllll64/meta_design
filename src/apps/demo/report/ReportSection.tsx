import type { Slide, SlideBlock } from '@/apps/demo/slides/types';
import { EditableText } from '@/apps/demo/slides/EditableText';
import type { SlideBlockOverride } from '@/apps/demo/slides/slideEdits';
import { cn } from '@/lib/utils';
import { AlertTriangle, Image as ImageIcon } from 'lucide-react';

export type ReportEditApi = {
  updateSlideField: (field: 'title' | 'section', value: string) => void;
  updateBlock: (blockIndex: number, override: SlideBlockOverride) => void;
};

function ReportBlock({
  block,
  editable,
  onCommit,
}: {
  block: SlideBlock;
  editable: boolean;
  onCommit: (override: SlideBlockOverride) => void;
}) {
  const textMain = 'text-zinc-900';
  const textMuted = 'text-zinc-500';

  if (block.type === 'bullets') {
    return (
      <ul className="mt-6 list-disc space-y-3 pl-6 text-[18px] leading-8 text-zinc-800">
        {block.items.map((it, idx) => (
          <li key={idx}>
            {editable ? (
              <EditableText
                value={it}
                onCommit={next => {
                  const nextItems = block.items.slice();
                  nextItems[idx] = next;
                  onCommit({ type: 'bullets', items: nextItems });
                }}
                className="inline"
                placeholder="点击编辑"
              />
            ) : (
              it
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === 'text') {
    const style =
      block.variant === 'subtitle'
        ? 'slide-type-subtitle'
        : block.variant === 'quote'
          ? 'slide-type-quote'
          : 'slide-type-body';

    return (
      <div className={cn('mt-6', style)}>
        {editable ? (
          <EditableText
            value={block.text}
            multiline={block.variant !== 'subtitle'}
            onCommit={next => onCommit({ type: 'text', text: next, variant: block.variant })}
            className={cn('block', block.variant !== 'subtitle' ? 'whitespace-pre-wrap' : '')}
            placeholder={block.variant === 'subtitle' ? '小标题（点击编辑）' : block.variant === 'quote' ? '引用（点击编辑）' : '正文（点击编辑）'}
          />
        ) : (
          <div className={cn(block.variant !== 'subtitle' ? 'whitespace-pre-wrap' : '')}>{block.text}</div>
        )}
      </div>
    );
  }

  if (block.type === 'figure') {
    return (
      <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50/70 p-6">
        <div className={cn('text-sm font-medium', textMain)}>
          {editable ? (
            <EditableText
              value={block.title}
              onCommit={next => onCommit({ type: 'figure', title: next })}
              className="inline"
              placeholder="图表标题"
            />
          ) : (
            block.title
          )}
        </div>
        {editable ? (
          <div className={cn('mt-2 text-xs', textMuted)}>
            <EditableText
              value={block.note ?? ''}
              onCommit={next => onCommit({ type: 'figure', note: next })}
              className="inline"
              placeholder="图表备注（可选）"
            />
          </div>
        ) : block.note ? (
          <div className={cn('mt-2 text-xs', textMuted)}>{block.note}</div>
        ) : null}
        <div className="mt-5 grid min-h-56 place-items-center rounded-2xl border border-dashed border-zinc-300 bg-white text-sm text-zinc-400">
          图表占位
        </div>
      </div>
    );
  }

  const hasSrc = Boolean(block.src);
  return (
    <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50/70 p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
        <ImageIcon className="h-4 w-4 text-zinc-500" />
        图片
      </div>
      <div
        className={cn(
          'mt-5 grid min-h-56 place-items-center rounded-2xl border bg-white',
          hasSrc ? 'border-zinc-200' : 'border-dashed border-amber-500/40'
        )}
      >
        {hasSrc ? (
          <img src={block.src} alt={block.caption ?? ''} className="max-h-80 w-auto rounded-xl" />
        ) : (
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <AlertTriangle className="h-4 w-4" />
            图片未设置
          </div>
        )}
      </div>
      {editable ? (
        <div className="mt-3 text-xs text-zinc-500">
          <EditableText
            value={block.caption ?? ''}
            onCommit={next => onCommit({ type: 'image', caption: next })}
            className="inline"
            placeholder="图片说明（可选）"
          />
        </div>
      ) : block.caption ? (
        <div className="mt-3 text-xs text-zinc-500">{block.caption}</div>
      ) : null}
    </div>
  );
}

export function ReportSection({
  slide,
  index,
  editable,
  edit,
}: {
  slide: Slide;
  index: number;
  editable: boolean;
  edit?: ReportEditApi;
}) {
  return (
    <section id={slide.id} className="report-section scroll-mt-28 border-t border-zinc-200 py-16 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-500">
            {editable ? (
              <EditableText value={slide.section} onCommit={next => edit?.updateSlideField('section', next)} className="inline" />
            ) : (
              slide.section
            )}
          </div>
          <h2 className="slide-type-title mt-3 text-4xl leading-tight text-zinc-950 md:text-5xl">
            {editable ? (
              <EditableText value={slide.title} onCommit={next => edit?.updateSlideField('title', next)} className="inline" />
            ) : (
              slide.title
            )}
          </h2>
        </div>
        <div className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-500">{String(index + 1).padStart(2, '0')}</div>
      </div>

      {slide.todo ? (
        <div className="mt-5 inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs text-amber-800">
          TODO
        </div>
      ) : null}

      <div className="mt-8">
        {slide.blocks.map((block, idx) => (
          <ReportBlock
            key={idx}
            block={block}
            editable={editable}
            onCommit={override => {
              if (!edit || block.type !== override.type) return;
              if (override.type === 'bullets' && block.type === 'bullets') {
                edit.updateBlock(idx, { type: 'bullets', items: override.items ?? block.items });
                return;
              }
              if (override.type === 'figure' && block.type === 'figure') {
                edit.updateBlock(idx, { type: 'figure', title: override.title ?? block.title, note: override.note ?? block.note });
                return;
              }
              if (override.type === 'image' && block.type === 'image') {
                edit.updateBlock(idx, { type: 'image', src: override.src ?? block.src, caption: override.caption ?? block.caption });
                return;
              }
              if (override.type === 'text' && block.type === 'text') {
                edit.updateBlock(idx, { type: 'text', text: override.text ?? block.text, variant: override.variant ?? block.variant });
              }
            }}
          />
        ))}
      </div>
    </section>
  );
}
