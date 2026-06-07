import { useState } from 'react';
import type { Slide, SlideBlock } from '@/apps/demo/slides/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { EditableText } from '@/apps/demo/slides/EditableText';
import type { SlideBlockOverride } from '@/apps/demo/slides/slideEdits';

type Variant = 'screen' | 'print';

type EditApi = {
  updateSlideField: (field: 'title' | 'section', value: string) => void;
  updateBlock: (blockIndex: number, override: SlideBlockOverride) => void;
};

function BlockView({
  block,
  variant,
  editable,
  onCommit,
}: {
  block: SlideBlock;
  variant: Variant;
  editable: boolean;
  onCommit: (override: SlideBlockOverride) => void;
}) {
  const textMain = variant === 'print' ? 'text-zinc-900' : 'text-zinc-900';
  const textMuted = variant === 'print' ? 'text-zinc-600' : 'text-zinc-600';
  const panel = variant === 'print' ? 'border-zinc-200 bg-white' : 'border-zinc-200 bg-white';
  const inner = variant === 'print' ? 'border-zinc-200 bg-zinc-50' : 'border-dashed border-zinc-200 bg-zinc-50';

  if (block.type === 'bullets') {
    return (
      <ul className={cn('mt-4 list-disc space-y-2 pl-6 text-[18px] leading-relaxed', textMain)}>
        {block.items.map((it, idx) => (
          <li key={idx} className={textMain}>
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
    const textClass =
      block.variant === 'subtitle'
        ? 'slide-type-subtitle'
        : block.variant === 'quote'
          ? 'slide-type-quote'
          : 'slide-type-body';
    const multiline = block.variant !== 'subtitle';
    return (
      <div className={cn('mt-5', textClass)}>
        {editable ? (
          <EditableText
            value={block.text}
            multiline={multiline}
            onCommit={next => onCommit({ type: 'text', text: next, variant: block.variant })}
            className={cn('block', multiline ? 'whitespace-pre-wrap' : '')}
            placeholder={block.variant === 'subtitle' ? '小标题（点击编辑）' : block.variant === 'quote' ? '引用（点击编辑）' : '正文（点击编辑）'}
          />
        ) : (
          <div className={cn(multiline ? 'whitespace-pre-wrap' : '')}>{block.text}</div>
        )}
      </div>
    );
  }

  if (block.type === 'figure') {
    return (
      <div className={cn('mt-5 rounded-2xl border p-5', panel)}>
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
        <div className={cn('mt-4 grid place-items-center rounded-xl border py-10 text-zinc-500', inner)}>
          图表占位
        </div>
      </div>
    );
  }

  const hasSrc = Boolean(block.src);
  return (
    <div className={cn('mt-5 rounded-2xl border p-5', panel)}>
      <div className={cn('flex items-center gap-2 text-sm font-medium', textMain)}>
        <ImageIcon className={cn('h-4 w-4', textMuted)} />
        图片
      </div>
      <div
        className={cn(
          'mt-4 grid place-items-center rounded-xl border py-10',
          variant === 'print' ? 'bg-zinc-50' : 'bg-zinc-50',
          hasSrc ? (variant === 'print' ? 'border-zinc-200' : 'border-zinc-200') : 'border-dashed border-amber-500/40'
        )}
      >
        {hasSrc ? (
          <img src={block.src} alt={block.caption ?? ''} className="max-h-64 w-auto rounded-lg" />
        ) : (
          <div className={cn('flex items-center gap-2 text-sm', variant === 'print' ? 'text-amber-700' : 'text-amber-800')}>
            <AlertTriangle className="h-4 w-4" />
            图片未设置
          </div>
        )}
      </div>
      {editable ? (
        <div className={cn('mt-2 text-xs', textMuted)}>
          <EditableText
            value={block.caption ?? ''}
            onCommit={next => onCommit({ type: 'image', caption: next })}
            className="inline"
            placeholder="图片说明（可选）"
          />
        </div>
      ) : block.caption ? (
        <div className={cn('mt-2 text-xs', textMuted)}>{block.caption}</div>
      ) : null}
    </div>
  );
}

export function SlideView({
  slide,
  indexLabel,
  variant = 'screen',
  edit,
}: {
  slide: Slide;
  indexLabel: string;
  variant?: Variant;
  edit?: EditApi;
}) {
  const heading = variant === 'print' ? 'text-zinc-900' : 'text-zinc-900';
  const muted = variant === 'print' ? 'text-zinc-600' : 'text-zinc-600';
  const logoHeight = variant === 'print' ? 'h-7' : 'h-8';
  const [logoOk, setLogoOk] = useState(true);
  const editable = variant === 'screen' && Boolean(edit);

  return (
    <section
      className={cn(
        'slide-canvas relative h-full w-full overflow-hidden rounded-[28px] border p-10',
        variant === 'print'
          ? 'border-zinc-200 bg-white'
          : 'border-zinc-200 bg-white'
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className={cn('text-xs font-medium tracking-wide', muted)}>
            {editable ? (
              <EditableText value={slide.section} onCommit={next => edit?.updateSlideField('section', next)} className="inline" />
            ) : (
              slide.section
            )}
          </div>
          <h1 className={cn('slide-type-title mt-2 text-[34px] font-semibold leading-tight tracking-tight', heading)}>
            {editable ? (
              <EditableText value={slide.title} onCommit={next => edit?.updateSlideField('title', next)} className="inline" />
            ) : (
              slide.title
            )}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {slide.todo ? (
            <span
              className={cn(
                'inline-flex items-center rounded-full border px-3 py-1 text-xs',
                variant === 'print'
                  ? 'border-amber-400/40 bg-amber-400/15 text-amber-800'
                  : 'border-amber-500/30 bg-amber-500/15 text-amber-800'
              )}
            >
              TODO
            </span>
          ) : null}
          <span
            className={cn(
              'inline-flex items-center rounded-full border px-3 py-1 text-xs',
              variant === 'print' ? 'border-zinc-200 bg-white text-zinc-700' : 'border-zinc-200 bg-white text-zinc-700'
            )}
          >
            {indexLabel}
          </span>
        </div>
      </div>

      <div className={cn('mt-2 text-sm', muted)}>占位内容：你可以随时替换为真实中期汇报材料</div>

      <div className="mt-6">
        {slide.blocks.map((b, idx) => (
          <BlockView
            key={idx}
            block={b}
            variant={variant}
            editable={editable}
            onCommit={override => {
              if (!edit) return;
              if (b.type !== override.type) return;
              if (override.type === 'bullets') {
                edit.updateBlock(idx, { type: 'bullets', items: override.items ?? (b.type === 'bullets' ? b.items : []) });
                return;
              }
              if (override.type === 'figure' && b.type === 'figure') {
                edit.updateBlock(idx, { type: 'figure', title: override.title ?? b.title, note: override.note ?? b.note });
                return;
              }
              if (override.type === 'image' && b.type === 'image') {
                edit.updateBlock(idx, { type: 'image', src: override.src ?? b.src, caption: override.caption ?? b.caption });
                return;
              }
              if (override.type === 'text' && b.type === 'text') {
                edit.updateBlock(idx, { type: 'text', text: override.text ?? b.text, variant: override.variant ?? b.variant });
              }
            }}
          />
        ))}
      </div>

      {logoOk ? (
        <div className={cn('pointer-events-none absolute bottom-6 right-6 select-none opacity-80', variant === 'print' ? 'opacity-100' : '')}>
          <img
            src="/logos/cdi.png"
            alt=""
            className={cn('w-auto', logoHeight)}
            onError={() => setLogoOk(false)}
            draggable={false}
          />
        </div>
      ) : null}
    </section>
  );
}
