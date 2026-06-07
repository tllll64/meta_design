import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Slide } from '@/apps/demo/slides/types';
import {
  STORAGE_KEY,
  clearSlidesEdits,
  loadSlidesEdits,
  mergeSlidesWithEdits,
  saveSlidesEdits,
  type SlideBlockOverride,
  type SlidesEdits,
} from '@/apps/demo/slides/slideEdits';
import type { SlideBlock } from '@/apps/demo/slides/types';

export function useSlidesEdits(baseSlides: Slide[]) {
  const [edits, setEdits] = useState<SlidesEdits>(() => loadSlidesEdits());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== null && e.key !== STORAGE_KEY) return;
      setEdits(loadSlidesEdits());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const slides = useMemo(() => mergeSlidesWithEdits(baseSlides, edits), [baseSlides, edits]);

  const persist = useCallback((next: SlidesEdits) => {
    setEdits(next);
    saveSlidesEdits(next);
  }, []);

  const updateSlideField = useCallback(
    (slideId: string, field: 'title' | 'section', value: string) => {
      persist({
        slides: {
          ...edits.slides,
          [slideId]: {
            ...edits.slides[slideId],
            [field]: value,
          },
        },
      });
    },
    [edits.slides, persist]
  );

  const updateBlock = useCallback(
    (slideId: string, blockIndex: number, override: SlideBlockOverride) => {
      const current = edits.slides[slideId];
      persist({
        slides: {
          ...edits.slides,
          [slideId]: {
            ...current,
            blocks: {
              ...(current?.blocks ?? {}),
              [blockIndex]: override,
            },
          },
        },
      });
    },
    [edits.slides, persist]
  );

  const appendBlock = useCallback(
    (slideId: string, block: SlideBlock) => {
      const current = edits.slides[slideId];
      const next = [...(current?.appendBlocks ?? []), block];
      persist({
        slides: {
          ...edits.slides,
          [slideId]: {
            ...current,
            appendBlocks: next,
          },
        },
      });
    },
    [edits.slides, persist]
  );

  const clearAll = useCallback(() => {
    clearSlidesEdits();
    setEdits({ slides: {} });
  }, []);

  return {
    slides,
    edits,
    updateSlideField,
    updateBlock,
    appendBlock,
    clearAll,
  };
}
