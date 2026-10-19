import { useCallback } from 'react';

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  duration?: number;
}

export function useConfetti() {
  const fire = useCallback((options: ConfettiOptions = {}) => {
    const {
      particleCount = 50,
      spread = 70,
      origin = { x: 0.5, y: 0.5 },
      colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
      duration = 3000,
    } = options;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      maxLife: number;
      size: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = canvas.width * origin.x;
        this.y = canvas.height * origin.y;

        const angle = (Math.random() - 0.5) * (spread * Math.PI / 180);
        const velocity = 5 + Math.random() * 10;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity - 5;

        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.maxLife = duration / 16; // Convert to frames (~60fps)
        this.life = this.maxLife;
        this.size = 8 + Math.random() * 8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
      }

      update() {
        this.vy += 0.3; // Gravity
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.life--;
        this.vx *= 0.98; // Air resistance
        this.vy *= 0.98;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }

      isDead() {
        return this.life <= 0 || this.y > canvas.height;
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    let animationId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        if (particle.isDead()) {
          particles.splice(index, 1);
        }
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        // Clean up
        canvas.remove();
      }
    }

    animate();

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      canvas.remove();
    };
  }, []);

  const celebrate = useCallback(() => {
    // Multiple bursts for celebration
    fire({ origin: { x: 0.25, y: 0.5 }, particleCount: 75 });
    setTimeout(() => fire({ origin: { x: 0.75, y: 0.5 }, particleCount: 75 }), 150);
    setTimeout(() => fire({ origin: { x: 0.5, y: 0.3 }, particleCount: 100, spread: 120 }), 300);
  }, [fire]);

  return {
    fire,
    celebrate,
  };
}
