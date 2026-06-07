import { useEffect, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

export function useGlobalKeydown(handler: KeyHandler, enabled = true) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      handlerRef.current(event);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [enabled]);
}
