import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

function normalizeText(value: string) {
  return value.replace(/\u00a0/g, ' ').replace(/\r\n/g, '\n');
}

export function EditableText({
  value,
  onCommit,
  className,
  multiline = false,
  placeholder,
  disabled = false,
}: {
  value: string;
  onCommit: (next: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const draftRef = useRef(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) return;
    draftRef.current = value;
    const el = ref.current;
    if (!el) return;
    el.innerText = value;
  }, [editing, value]);

  useEffect(() => {
    if (!editing) return;
    const el = ref.current;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    el.focus();
  }, [editing]);

  const display = useMemo(() => (value ? value : placeholder ?? ''), [placeholder, value]);

  function commit(next: string) {
    const normalized = normalizeText(next);
    onCommit(normalized);
  }

  return (
    <span
      ref={ref}
      role={disabled ? undefined : 'textbox'}
      tabIndex={disabled ? -1 : 0}
      contentEditable={!disabled && editing}
      suppressContentEditableWarning
      data-editing={editing ? '1' : '0'}
      className={cn(
        'outline-none rounded-md transition',
        disabled
          ? ''
          : 'cursor-text hover:bg-indigo-600/5 focus:bg-indigo-600/5 focus:ring-2 focus:ring-indigo-600/20',
        !value && placeholder ? 'text-zinc-400' : '',
        className
      )}
      onClick={() => {
        if (disabled) return;
        draftRef.current = value;
        setEditing(true);
      }}
      onInput={e => {
        if (!editing) return;
        const raw = multiline ? e.currentTarget.innerText : e.currentTarget.textContent ?? '';
        draftRef.current = raw.replace(/\r\n/g, '\n');
      }}
      onBlur={() => {
        if (!editing) return;
        setEditing(false);
        commit(draftRef.current);
      }}
      onKeyDown={e => {
        if (!editing) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          setEditing(false);
          draftRef.current = value;
          return;
        }
        if (!multiline && e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLSpanElement).blur();
        }
      }}
    >
      {editing ? null : display}
    </span>
  );
}
