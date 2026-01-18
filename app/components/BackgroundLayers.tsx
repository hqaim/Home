import React, { useEffect, useRef } from 'react';
import { Particle } from '@/types';

interface BackgroundLayersProps {
  theme: string;
}

const BackgroundLayers: React.FC<BackgroundLayersProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];
    let animationFrameId: number;

    const colorConfig = {
      dark: { primary: 'rgba(34, 211, 238, ', secondary: 'rgba(139, 92, 246, ', line: 'rgba(148, 163, 184, ' },
      light: { primary: 'rgba(15, 23, 42, ', secondary: 'rgba(37, 99, 235, ', line: 'rgba(203, 213, 225, ' }
    };

    const particleCount = 70;
    const connectionDistance = 150;
    const mouseDistance = 200;
    let mouse = { x: -1000, y: -1000 };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          type: Math.random() > 0.5 ? 'primary' : 'secondary'
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // @ts-ignore
      const palette = theme === 'light' ? colorConfig.light : colorConfig.dark;

      particles.forEach((p, i) => {
        // Update
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = (p.type === 'primary' ? palette.primary : palette.secondary) + '0.6)';
        ctx.fill();

        // Connect
        for (let j = i; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = palette.line + `${0.15 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse Interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < mouseDistance) {
          if(dist < 80) {
            const angle = Math.atan2(dy, dx);
            const force = (80 - dist) / 80;
            p.x += Math.cos(angle) * force * 1.5;
            p.y += Math.sin(angle) * force * 1.5;
          }
          ctx.beginPath();
          ctx.strokeStyle = palette.primary + `${0.2 * (1 - dist / mouseDistance)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <>
      <div className="bg-solid-base"></div>
      <div className="bg-grid"></div>
      <div className="bg-vignette"></div>
      <canvas id="neural-canvas" ref={canvasRef} />
      <div className="ambient-noise"></div>
    </>
  );
};

export default BackgroundLayers;
