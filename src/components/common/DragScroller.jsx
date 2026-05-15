import { useRef } from "react";

export default function DragScroller({ children, ariaLabel }) {
  const scrollerRef = useRef(null);
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    hasMoved: false,
    suppressClick: false,
  });

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    if (event.target.closest("button")) return;

    const scroller = scrollerRef.current;
    if (!scroller) return;

    dragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      scrollLeft: scroller.scrollLeft,
      hasMoved: false,
      suppressClick: false,
    };
  };

  const handlePointerMove = (event) => {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;
    if (!scroller || !dragState.isDragging) return;

    const movedX = event.clientX - dragState.startX;
    const deltaX = Math.abs(movedX);

    if (deltaX > 5) {
      dragStateRef.current.hasMoved = true;
      dragStateRef.current.suppressClick = true;
      event.preventDefault();
    }

    if (dragStateRef.current.hasMoved) {
      scroller.scrollLeft = dragState.scrollLeft - movedX * 1.1;
    }
  };

  const stopDragging = () => {
    dragStateRef.current.isDragging = false;
  };

  const handleClickCapture = (event) => {
    if (!dragStateRef.current.suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
    dragStateRef.current.suppressClick = false;
    dragStateRef.current.hasMoved = false;
  };

  return (
    <div
      ref={scrollerRef}
      aria-label={ariaLabel}
      role="region"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
      onClickCapture={handleClickCapture}
      onDragStart={(event) => event.preventDefault()}
      className="cursor-grab overflow-x-auto select-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      style={{ touchAction: "pan-y" }}
    >
      <div className="my-6 flex w-max gap-6 px-6">{children}</div>
    </div>
  );
}
