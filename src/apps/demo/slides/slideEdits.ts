import type { Slide, SlideBlock } from '@/apps/demo/slides/types';

export type SlideBlockOverride =
  | { type: 'bullets'; items?: string[] }
  | { type: 'image'; src?: string; caption?: string }
  | { type: 'figure'; title?: string; note?: string }
  | { type: 'text'; variant?: 'subtitle' | 'body' | 'quote'; text?: string };

export type SlideOverride = {
  section?: string;
  title?: string;
  blocks?: Record<number, SlideBlockOverride>;
  appendBlocks?: SlideBlock[];
};

export type SlidesEdits = {
  slides: Record<string, SlideOverride>;
};

export const STORAGE_KEY = 'meta_design.slides.edits.v1';

export function loadSlidesEdits(): SlidesEdits {
  if (typeof window === 'undefined') return { slides: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { slides: {} };
    const parsed = JSON.parse(raw) as SlidesEdits;
    if (!parsed || typeof parsed !== 'object' || !parsed.slides || typeof parsed.slides !== 'object') return { slides: {} };
    return parsed;
  } catch {
    return { slides: {} };
  }
}

export function saveSlidesEdits(edits: SlidesEdits) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
}

export function clearSlidesEdits() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function mergeBlock(base: SlideBlock, override?: SlideBlockOverride): SlideBlock {
  if (!override) return base;
  if (base.type !== override.type) return base;

  if (base.type === 'bullets' && override.type === 'bullets') {
    return { ...base, items: override.items ?? base.items };
  }
  if (base.type === 'figure' && override.type === 'figure') {
    return { ...base, title: override.title ?? base.title, note: override.note ?? base.note };
  }
  if (base.type === 'image' && override.type === 'image') {
    return { ...base, src: override.src ?? base.src, caption: override.caption ?? base.caption };
  }
  if (base.type === 'text' && override.type === 'text') {
    return { ...base, variant: override.variant ?? base.variant, text: override.text ?? base.text };
  }
  return base;
}

export function mergeSlidesWithEdits(baseSlides: Slide[], edits: SlidesEdits): Slide[] {
  return baseSlides.map(s => {
    const e = edits.slides[s.id];
    if (!e) return s;
    const blocks = s.blocks.map((b, idx) => mergeBlock(b, e.blocks?.[idx]));
    const appended = Array.isArray(e.appendBlocks) ? e.appendBlocks : [];
    return {
      ...s,
      section: e.section ?? s.section,
      title: e.title ?? s.title,
      blocks: appended.length ? [...blocks, ...appended] : blocks,
    };
  });
}
