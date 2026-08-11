import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { Bounds } from "./definitions";
import {
  clearBoardZoom,
  playBoardRestore,
  playBoardZoom,
  refreshBoardZoom,
} from "./animations";

type PendingAnimation = "restore" | "zoom" | null;

function boardBounds(board: HTMLElement): Bounds {
  const bounds = board.getBoundingClientRect();
  return {
    height: bounds.height,
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
  };
}

function getBoard(root: HTMLElement, boardIndex: number): HTMLElement | null {
  return root.querySelector<HTMLElement>(
    `[data-game-board][data-board-index="${boardIndex}"]`,
  );
}

export function useBoardZoom(
  boardsRef: RefObject<HTMLElement | null>,
  closeButtonRef: RefObject<HTMLButtonElement | null>,
) {
  const [focusedBoardIndex, setFocusedBoardIndex] = useState<number | null>(
    null,
  );
  const [layoutBoardIndex, setLayoutBoardIndex] = useState<number | null>(null);
  const focusedBoardIndexRef = useRef<number | null>(null);
  const layoutBoardIndexRef = useRef<number | null>(null);
  const firstBoundsRef = useRef<Bounds | null>(null);
  const pendingAnimationRef = useRef<PendingAnimation>(null);

  const zoomBoard = useCallback(
    (boardIndex: number) => {
      const root = boardsRef.current;
      if (root === null || focusedBoardIndexRef.current !== null) {
        return;
      }
      const board = getBoard(root, boardIndex);
      if (board === null) {
        return;
      }

      firstBoundsRef.current = boardBounds(board);
      focusedBoardIndexRef.current = boardIndex;
      layoutBoardIndexRef.current = boardIndex;
      pendingAnimationRef.current = "zoom";
      setFocusedBoardIndex(boardIndex);
      setLayoutBoardIndex(boardIndex);
    },
    [boardsRef],
  );

  const restoreBoards = useCallback(() => {
    const root = boardsRef.current;
    const boardIndex = focusedBoardIndexRef.current;
    if (
      root === null ||
      boardIndex === null ||
      layoutBoardIndexRef.current === null
    ) {
      return;
    }
    const board = getBoard(root, boardIndex);
    if (board === null) {
      return;
    }

    firstBoundsRef.current = boardBounds(board);
    layoutBoardIndexRef.current = null;
    pendingAnimationRef.current = "restore";
    setLayoutBoardIndex(null);
  }, [boardsRef]);

  useLayoutEffect(() => {
    const root = boardsRef.current;
    const closeButton = closeButtonRef.current;
    const boardIndex = focusedBoardIndexRef.current;
    const firstBounds = firstBoundsRef.current;
    const pendingAnimation = pendingAnimationRef.current;
    if (
      root === null ||
      closeButton === null ||
      boardIndex === null ||
      firstBounds === null ||
      pendingAnimation === null
    ) {
      return;
    }

    pendingAnimationRef.current = null;
    if (pendingAnimation === "zoom") {
      playBoardZoom(root, boardIndex, closeButton, firstBounds);
      return;
    }

    playBoardRestore(root, boardIndex, closeButton, firstBounds, () => {
      focusedBoardIndexRef.current = null;
      firstBoundsRef.current = null;
      setFocusedBoardIndex(null);
      getBoard(root, boardIndex)
        ?.querySelector<HTMLButtonElement>("button")
        ?.focus({ preventScroll: true });
    });
  }, [boardsRef, closeButtonRef, layoutBoardIndex]);

  useEffect(() => {
    if (layoutBoardIndex === null) {
      return;
    }
    const root = boardsRef.current;
    const closeButton = closeButtonRef.current;
    if (root === null || closeButton === null) {
      return;
    }

    let previousWidth = root.clientWidth;
    let previousHeight = root.clientHeight;
    const refresh = () => {
      refreshBoardZoom(root, layoutBoardIndex, closeButton);
    };
    const observer = new ResizeObserver(() => {
      if (
        root.clientWidth === previousWidth &&
        root.clientHeight === previousHeight
      ) {
        return;
      }
      previousWidth = root.clientWidth;
      previousHeight = root.clientHeight;
      refresh();
    });
    observer.observe(root);
    window.addEventListener("resize", refresh);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [boardsRef, closeButtonRef, layoutBoardIndex]);

  useEffect(() => {
    if (focusedBoardIndex === null) {
      return;
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        restoreBoards();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [focusedBoardIndex, restoreBoards]);

  useLayoutEffect(
    () => () => {
      const root = boardsRef.current;
      const closeButton = closeButtonRef.current;
      if (root !== null && closeButton !== null) {
        clearBoardZoom(root, closeButton);
      }
    },
    [boardsRef, closeButtonRef],
  );

  return {
    focusedBoardIndex,
    layoutBoardIndex,
    restoreBoards,
    zoomBoard,
  };
}
