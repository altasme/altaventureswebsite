import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";

export type SignaturePadHandle = {
  clear: () => void;
  isEmpty: () => boolean;
  toDataUrl: () => string;
};

type Props = {
  onChangeEmpty?: (isEmpty: boolean) => void;
};

const SignaturePad = forwardRef<SignaturePadHandle, Props>(function SignaturePad(
  { onChangeEmpty },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const hasInkRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const ratioRef = useRef(1);
  const boundsRef = useRef<{ minX: number; minY: number; maxX: number; maxY: number } | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const onChangeEmptyRef = useRef(onChangeEmpty);
  useEffect(() => {
    onChangeEmptyRef.current = onChangeEmpty;
  }, [onChangeEmpty]);

  const getContext = () => canvasRef.current?.getContext("2d") ?? null;

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    ratioRef.current = ratio;
    const rect = canvas.getBoundingClientRect();
    const nextWidth = Math.round(rect.width * ratio);
    const nextHeight = Math.round(rect.height * ratio);

    // Reassigning canvas.width/height wipes any drawn pixels, even when set
    // to the same value. Skip the no-op case, and if a real size change
    // (window resize, orientation change, on-screen keyboard toggling on
    // mobile) wipes an in-progress signature, treat it as cleared rather
    // than silently letting a blank signature pass validation.
    if (canvas.width === nextWidth && canvas.height === nextHeight) return;
    const hadInk = hasInkRef.current;

    canvas.width = nextWidth;
    canvas.height = nextHeight;
    const ctx = getContext();
    if (ctx) {
      ctx.scale(ratio, ratio);
      ctx.lineWidth = 2.25;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#02256F";
    }

    if (hadInk) {
      hasInkRef.current = false;
      boundsRef.current = null;
      setIsEmpty(true);
      onChangeEmptyRef.current?.(true);
    }
  }, []);

  const extendBounds = (x: number, y: number) => {
    const b = boundsRef.current;
    if (!b) {
      boundsRef.current = { minX: x, minY: y, maxX: x, maxY: y };
      return;
    }
    b.minX = Math.min(b.minX, x);
    b.minY = Math.min(b.minY, y);
    b.maxX = Math.max(b.maxX, x);
    b.maxY = Math.max(b.maxY, y);
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = getContext();
    const last = lastPointRef.current;
    const point = pointFromEvent(e);
    if (!ctx || !last) return;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
    extendBounds(last.x, last.y);
    extendBounds(point.x, point.y);
    if (!hasInkRef.current) {
      hasInkRef.current = true;
      setIsEmpty(false);
      onChangeEmptyRef.current?.(false);
    }
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasInkRef.current = false;
    boundsRef.current = null;
    setIsEmpty(true);
    onChangeEmptyRef.current?.(true);
  };

  const toDataUrl = () => {
    const canvas = canvasRef.current;
    const bounds = boundsRef.current;
    if (!canvas || !bounds) return "";

    const ratio = ratioRef.current;
    const rect = canvas.getBoundingClientRect();
    const pad = 6;
    const minX = Math.max(0, bounds.minX - pad);
    const minY = Math.max(0, bounds.minY - pad);
    const maxX = Math.min(rect.width, bounds.maxX + pad);
    const maxY = Math.min(rect.height, bounds.maxY + pad);

    const sx = minX * ratio;
    const sy = minY * ratio;
    const sw = Math.max(1, (maxX - minX) * ratio);
    const sh = Math.max(1, (maxY - minY) * ratio);

    const cropped = document.createElement("canvas");
    cropped.width = sw;
    cropped.height = sh;
    const croppedCtx = cropped.getContext("2d");
    croppedCtx?.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);
    return cropped.toDataURL("image/png");
  };

  useImperativeHandle(ref, () => ({
    clear,
    isEmpty: () => !hasInkRef.current,
    toDataUrl,
  }));

  return (
    <div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
          className="h-44 w-full touch-none rounded-xl border border-ink/15 bg-white"
          aria-label="Signature pad. Draw your signature using your mouse or touchscreen."
          role="img"
        />
        {isEmpty && (
          <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-sm text-ink/35">
            Sign here
          </p>
        )}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p className="text-xs text-ink/50">Draw your signature above using your mouse, trackpad, or finger.</p>
        <button
          type="button"
          onClick={clear}
          className="shrink-0 text-xs font-semibold text-brand-blue hover:underline"
        >
          Clear
        </button>
      </div>
    </div>
  );
});

export default SignaturePad;
