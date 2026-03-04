import { FC, useEffect, useMemo, useRef } from 'react';

import { SnowConfig, SnowProps } from './types';
import './snow.css';

const DEFAULT_CONFIG: SnowConfig = {
  size: { min: 2, max: 9 },
  speed: { min: 15, max: 25 },
  count: 350,
  opacity: { min: 0.1, max: 0.5 },
  swing: { min: 20, max: 200 },
  color: 'white',
};

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  swing: number;
  swingPhase: number;
  rotation: number;
  aspectRatio: number;
  skew: number;
  time: number;
  path: Path2D;
  radius: number;
}

const CANVAS_SCALE = 0.5;

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export const Snow: FC<SnowProps> = ({ config = {}, className, style }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const snowflakesRef = useRef<Snowflake[]>([]);

  const finalConfig = useMemo<SnowConfig>(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
      size: { ...DEFAULT_CONFIG.size, ...config.size },
      speed: { ...DEFAULT_CONFIG.speed, ...config.speed },
      opacity: config.opacity
        ? { ...DEFAULT_CONFIG.opacity, ...config.opacity }
        : DEFAULT_CONFIG.opacity,
      swing: config.swing
        ? { ...DEFAULT_CONFIG.swing, ...config.swing }
        : DEFAULT_CONFIG.swing,
      color: config.color ?? DEFAULT_CONFIG.color,
    }),
    [config],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();
    const canvasWidth = width * CANVAS_SCALE;
    const canvasHeight = height * CANVAS_SCALE;

    snowflakesRef.current = Array.from({ length: finalConfig.count }, () => {
      const size = random(finalConfig.size.min, finalConfig.size.max);
      const speedSeconds = random(finalConfig.speed.min, finalConfig.speed.max);
      const speedPxPerSec = canvasHeight / speedSeconds;
      const x = Math.random() * canvasWidth;
      const initialY = -canvasHeight + Math.random() * canvasHeight;
      const opacity = random(
        finalConfig.opacity?.min ?? 0.5,
        finalConfig.opacity?.max ?? 1,
      );
      const swingCfg = finalConfig.swing ?? DEFAULT_CONFIG.swing!;
      const swing = random(swingCfg.min, swingCfg.max) * CANVAS_SCALE;
      const swingPhase = Math.random() * Math.PI * 2;
      const rotation = (Math.random() * 360 * Math.PI) / 180;
      const aspectRatio = 0.6 + Math.random() * 0.4;
      const skew = ((-15 + Math.random() * 30) * Math.PI) / 180;

      const radius = (size * CANVAS_SCALE) / 2;
      const path = new Path2D();
      path.arc(0, 0, radius, 0, Math.PI * 2);

      return {
        x,
        y: initialY,
        size,
        speed: speedPxPerSec,
        opacity,
        swing,
        swingPhase,
        rotation,
        aspectRatio,
        skew,
        time: 0,
        path,
        radius,
      };
    });
  }, [finalConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (): void => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);

      const color = finalConfig.color ?? 'white';

      snowflakesRef.current.forEach((snowflake) => {
        snowflake.y += snowflake.speed * deltaTime;

        if (snowflake.y > height + snowflake.radius * 2) {
          snowflake.y = -snowflake.radius * 2;
          snowflake.x = Math.random() * width;
        }

        const swingProgress = (snowflake.y / height) * Math.PI * 2;
        const swingOffset =
          Math.sin(snowflake.swingPhase + swingProgress) * snowflake.swing;
        const x = snowflake.x + swingOffset;

        ctx.save();
        ctx.translate(x, snowflake.y);
        ctx.rotate(snowflake.rotation);
        ctx.transform(1, Math.tan(snowflake.skew), 0, 1, 0, 0);
        ctx.globalAlpha = snowflake.opacity;
        ctx.fillStyle = color;
        ctx.fill(snowflake.path);
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [finalConfig.color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * CANVAS_SCALE;
      canvas.height = height * CANVAS_SCALE;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const containerClass = className
    ? `react-snow-container ${className}`
    : 'react-snow-container';

  return (
    <div className={containerClass} style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
};
