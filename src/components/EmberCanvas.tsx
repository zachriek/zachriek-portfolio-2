import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  fadeSpeed: number;
  baseAlpha: number;
  swaySpeed: number;
  swayDist: number;
  initialX: number;
  color: string;
}

export const EmberCanvas: React.FC<{ density?: 'low' | 'normal' | 'high' }> = ({
  density = 'normal',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const count = density === 'low' ? 35 : density === 'high' ? 110 : 65;
    const particles: Particle[] = [];

    const colors = [
      '#ff8833', // orange amber
      '#ffaa44', // warm gold
      '#ff5522', // deep ember
      '#ffd888', // bright hot spark
      '#ffeedd', // white-hot tiny ember
    ];

    const createParticle = (randomY = false): Particle => {
      const initialX = Math.random() * width;
      const size = Math.random() * 2.8 + 1.0;
      return {
        x: initialX,
        y: randomY ? Math.random() * height : height + Math.random() * 20,
        size,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.7 + 0.3,
        fadeSpeed: Math.random() * 0.003 + 0.001,
        baseAlpha: Math.random() * 0.7 + 0.3,
        swaySpeed: Math.random() * 0.02 + 0.01,
        swayDist: Math.random() * 25 + 10,
        initialX,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(true));
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x = p.initialX + Math.sin(time * p.swaySpeed + i) * p.swayDist;
        p.opacity -= p.fadeSpeed;

        if (p.y < -10 || p.opacity <= 0) {
          particles[i] = createParticle(false);
          continue;
        }

        // Draw glowing ember
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 4;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        // Slightly elongated oval for vertical drift motion
        ctx.ellipse(p.x, p.y, p.size * 0.8, p.size * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
};
