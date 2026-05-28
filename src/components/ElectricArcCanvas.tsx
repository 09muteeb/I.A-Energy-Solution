import { useRef, useEffect } from "react";

interface Point {
  x: number;
  y: number;
}

export default function ElectricArcCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frameCount = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawArc = (
      leftX: number,
      rightX: number,
      centerY: number,
      _width: number,
      isFlash: boolean
    ) => {
      if (!ctx) return;

      const stepSize = 10;
      const jitter = 30;
      const forkChance = 0.02;

      ctx.beginPath();
      ctx.moveTo(leftX, centerY);

      let currentX = leftX;
      const points: Point[] = [{ x: leftX, y: centerY }];

      while (currentX < rightX) {
        const nextX = Math.min(currentX + stepSize, rightX);
        const midX = (currentX + nextX) / 2;
        const offsetY = Math.random() * jitter - jitter / 2;

        points.push({ x: midX, y: centerY + offsetY });
        points.push({ x: nextX, y: centerY });

        // Sub-fork
        if (Math.random() < forkChance && nextX < rightX - 50) {
          ctx.quadraticCurveTo(midX, centerY + offsetY - 20, nextX + 30, centerY - 40);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(nextX, centerY);
        }

        currentX = nextX;
      }

      // Draw the main arc
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 1; i += 2) {
        ctx.quadraticCurveTo(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
      }

      if (isFlash) {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 6;
        ctx.shadowBlur = 40;
        ctx.shadowColor = "#FFFFFF";
        ctx.globalCompositeOperation = "lighter";
      } else {
        ctx.strokeStyle = "#00D4FF";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#00D4FF";
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      frameCount++;

      // Fade effect every 10th frame
      if (frameCount % 10 === 0) {
        ctx.fillStyle = "rgba(10, 10, 10, 0.25)";
        ctx.fillRect(0, 0, width, height);
      }

      const leftElectrodeX = width * 0.2;
      const rightElectrodeX = width * 0.8;
      const electrodeY = height * 0.5;

      // Draw 10 arcs per frame
      for (let i = 0; i < 10; i++) {
        const isFlash = frameCount % 30 === 0 && i === 0;
        drawArc(leftElectrodeX, rightElectrodeX, electrodeY, width, isFlash);
      }

      animationId = requestAnimationFrame(animate);
    };

    // Initial fill
    ctx.fillStyle = "rgba(10, 10, 10, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
