import { useCallback, useEffect, useRef, type RefObject } from "react";

function getViewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function calculateKeyboardInset(
  restingViewportHeight: number,
  currentViewportHeight: number,
): number {
  return Math.max(0, Math.round(restingViewportHeight - currentViewportHeight));
}

export function useNativeKeyboard(
  inputRef: RefObject<HTMLInputElement | null>,
  boardsRef: RefObject<HTMLElement | null>,
  rootRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const restingViewportHeightRef = useRef<number | null>(null);

  const syncKeyboardInset = useCallback(() => {
    const root = rootRef.current;
    const restingViewportHeight = restingViewportHeightRef.current;
    if (root === null || restingViewportHeight === null) {
      return;
    }

    root.style.setProperty(
      "--native-keyboard-inset",
      `${calculateKeyboardInset(restingViewportHeight, getViewportHeight())}px`,
    );
  }, [rootRef]);

  const handleNativeInputFocus = useCallback(() => {
    const root = rootRef.current;
    const boards = boardsRef.current;
    if (root === null || boards === null) {
      return;
    }

    restingViewportHeightRef.current ??= getViewportHeight();
    root.style.setProperty(
      "--native-keyboard-boards-height",
      `${boards.getBoundingClientRect().height}px`,
    );
    root.style.setProperty("--native-keyboard-inset", "0px");
    root.dataset.nativeKeyboardOpen = "true";
    requestAnimationFrame(syncKeyboardInset);
  }, [boardsRef, rootRef, syncKeyboardInset]);

  const handleNativeInputBlur = useCallback(() => {
    const root = rootRef.current;
    restingViewportHeightRef.current = null;
    if (root === null) {
      return;
    }

    delete root.dataset.nativeKeyboardOpen;
    root.style.removeProperty("--native-keyboard-boards-height");
    root.style.removeProperty("--native-keyboard-inset");
    root.scrollTop = 0;
  }, [rootRef]);

  const focusNativeInput = useCallback(() => {
    const input = inputRef.current;
    if (input === null) {
      return;
    }

    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
  }, [inputRef]);

  useEffect(() => {
    if (!enabled) {
      handleNativeInputBlur();
    }
  }, [enabled, handleNativeInputBlur]);

  useEffect(() => {
    const viewport = window.visualViewport;
    window.addEventListener("resize", syncKeyboardInset);
    viewport?.addEventListener("resize", syncKeyboardInset);
    viewport?.addEventListener("scroll", syncKeyboardInset);

    return () => {
      window.removeEventListener("resize", syncKeyboardInset);
      viewport?.removeEventListener("resize", syncKeyboardInset);
      viewport?.removeEventListener("scroll", syncKeyboardInset);
    };
  }, [syncKeyboardInset]);

  useEffect(() => {
    const dismissOutsideBoards = (event: MouseEvent) => {
      const input = inputRef.current;
      if (input === null || document.activeElement !== input) {
        return;
      }

      const pressedBoard = event
        .composedPath()
        .some(
          (target) =>
            target instanceof Element && target.hasAttribute("data-game-board"),
        );
      if (!pressedBoard) {
        input.blur();
      }
    };

    document.addEventListener("click", dismissOutsideBoards, true);
    return () =>
      document.removeEventListener("click", dismissOutsideBoards, true);
  }, [inputRef]);

  useEffect(
    () => () => {
      const root = rootRef.current;
      if (root !== null) {
        delete root.dataset.nativeKeyboardOpen;
        root.style.removeProperty("--native-keyboard-boards-height");
        root.style.removeProperty("--native-keyboard-inset");
      }
    },
    [rootRef],
  );

  return {
    focusNativeInput,
    handleNativeInputBlur,
    handleNativeInputFocus,
  };
}
