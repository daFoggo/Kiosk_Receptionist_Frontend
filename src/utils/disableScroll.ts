// src/utils/scrollUtils.ts

interface DisableScrollOptions {
  disableZoom?: boolean;
  disableRightClick?: boolean;
  disableWheelScroll?: boolean;
  disableTouchScroll?: boolean;
  excludeSelector?: string;
}

export const useDisableScroll = (options: DisableScrollOptions = {}) => {
  const {
    disableZoom = true,
    disableRightClick = true,
    disableWheelScroll = true,
    disableTouchScroll = true,
    excludeSelector,
  } = options;

  const shouldAllowScroll = (event: Event): boolean => {
    if (!excludeSelector) return false;
    const excludeElement = document.querySelector(excludeSelector);
    return !!(excludeElement && excludeElement.contains(event.target as Node));
  };

  const handlers = {
    handleZoom: (e: KeyboardEvent) => {
      if (disableZoom && e.ctrlKey && (e.key === "+" || e.key === "-")) {
        e.preventDefault();
      }
    },

    handleRightClick: (e: MouseEvent) => {
      if (disableRightClick) {
        e.preventDefault();
      }
    },

    handleWheel: (e: WheelEvent) => {
      if (disableWheelScroll && !shouldAllowScroll(e)) {
        e.preventDefault();
      }
    },

    handleTouchMove: (e: TouchEvent) => {
      if (disableTouchScroll && !shouldAllowScroll(e)) {
        e.preventDefault();
      }
    },
  };

  const enableScrollDisable = () => {
    if (disableZoom) {
      document.addEventListener("keydown", handlers.handleZoom);
    }
    if (disableRightClick) {
      document.addEventListener("contextmenu", handlers.handleRightClick);
    }
    if (disableWheelScroll) {
      document.addEventListener("wheel", handlers.handleWheel, {
        passive: false,
      });
    }
    if (disableTouchScroll) {
      document.addEventListener("touchmove", handlers.handleTouchMove, {
        passive: false,
      });
    }
  };

  const disableScrollDisable = () => {
    if (disableZoom) {
      document.removeEventListener("keydown", handlers.handleZoom);
    }
    if (disableRightClick) {
      document.removeEventListener("contextmenu", handlers.handleRightClick);
    }
    if (disableWheelScroll) {
      document.removeEventListener("wheel", handlers.handleWheel);
    }
    if (disableTouchScroll) {
      document.removeEventListener("touchmove", handlers.handleTouchMove);
    }
  };

  return {
    enableScrollDisable,
    disableScrollDisable,
  };
};
