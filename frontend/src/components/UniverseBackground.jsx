import { useEffect, useRef } from 'react';

export default function UniverseBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationId;
        let stars = [];
        let shootingStars = [];

        // Nebulae defined with warm gold/amber base hues that shift over time
        const nebulaeDefs = [
            { xPct: 0.2, yPct: 0.15, radius: 350, baseHue: 35, saturation: 70, lightness: 30, opacity: 0.10, hueSpeed: 0.08 },
            { xPct: 0.8, yPct: 0.1, radius: 300, baseHue: 25, saturation: 65, lightness: 35, opacity: 0.08, hueSpeed: 0.12 },
            { xPct: 0.5, yPct: 0.35, radius: 400, baseHue: 40, saturation: 60, lightness: 28, opacity: 0.07, hueSpeed: 0.06 },
            { xPct: 0.15, yPct: 0.55, radius: 250, baseHue: 30, saturation: 80, lightness: 40, opacity: 0.06, hueSpeed: 0.15 },
            { xPct: 0.85, yPct: 0.45, radius: 300, baseHue: 45, saturation: 70, lightness: 35, opacity: 0.06, hueSpeed: 0.10 },
            { xPct: 0.5, yPct: 0.7, radius: 350, baseHue: 20, saturation: 75, lightness: 32, opacity: 0.07, hueSpeed: 0.09 },
            { xPct: 0.3, yPct: 0.85, radius: 280, baseHue: 50, saturation: 65, lightness: 38, opacity: 0.08, hueSpeed: 0.13 },
        ];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = document.documentElement.scrollHeight;
            initStars();
        };

        const initStars = () => {
            stars = [];
            const count = Math.floor((canvas.width * canvas.height) / 3000);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5 + 0.3,
                    opacity: Math.random() * 0.8 + 0.2,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    baseHue: Math.random() > 0.85 ? Math.random() * 40 + 20
                        : Math.random() > 0.7 ? Math.random() * 30 + 35
                            : -1, // -1 = white
                    hueShift: Math.random() * 0.05 + 0.01,
                });
            }
        };

        const spawnShootingStar = () => {
            if (shootingStars.length > 3) return;
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.5,
                length: Math.random() * 120 + 60,
                speed: Math.random() * 8 + 6,
                angle: (Math.random() * 30 + 20) * (Math.PI / 180),
                opacity: 1,
                decay: Math.random() * 0.015 + 0.008,
                hue: Math.random() * 50 + 20,
            });
        };

        // ── HSL helper ──
        const hsl = (h, s, l, a) => `hsla(${((h % 360) + 360) % 360}, ${s}%, ${l}%, ${a})`;

        // ── Draw ──
        let time = 0;
        const draw = () => {
            time += 0.016;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // ── Continuously shifting background gradient (warm gold/amber tones) ──
            const bgHue1 = (30 + Math.sin(time * 0.05) * 15) % 360;
            const bgHue2 = (40 + Math.sin(time * 0.03 + 1) * 20) % 360;
            const bgGrad = ctx.createRadialGradient(
                canvas.width * 0.5, 0, 0,
                canvas.width * 0.5, 0, canvas.height * 0.8
            );
            bgGrad.addColorStop(0, hsl(bgHue1, 40, 6, 1));
            bgGrad.addColorStop(0.5, hsl(bgHue2, 30, 3, 1));
            bgGrad.addColorStop(1, 'hsl(0, 0%, 0%)');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // ── Draw nebulae with cycling warm hues ──
            for (const n of nebulaeDefs) {
                const nx = n.xPct * canvas.width;
                const ny = n.yPct * canvas.height;
                const currentHue = n.baseHue + Math.sin(time * n.hueSpeed) * 20;
                const breathe = Math.sin(time * 0.3 + n.baseHue) * 0.02;
                const op = n.opacity + breathe;

                const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.radius);
                grad.addColorStop(0, hsl(currentHue, n.saturation, n.lightness, op));
                grad.addColorStop(0.4, hsl(currentHue + 10, n.saturation - 10, n.lightness - 5, op * 0.5));
                grad.addColorStop(1, hsl(currentHue, n.saturation, n.lightness, 0));
                ctx.fillStyle = grad;
                ctx.fillRect(nx - n.radius, ny - n.radius, n.radius * 2, n.radius * 2);
            }

            // ── Draw stars with subtle warm hue drift ──
            for (const star of stars) {
                const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
                const opacity = star.opacity * (0.6 + twinkle * 0.4);
                if (opacity <= 0) continue;

                let color;
                if (star.baseHue < 0) {
                    color = `hsla(40, 20%, 95%, ${opacity})`;
                } else {
                    const h = star.baseHue + Math.sin(time * star.hueShift) * 15;
                    color = hsl(h, 75, 80, opacity);
                }

                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();

                if (star.radius > 1.2) {
                    const glowH = star.baseHue < 0 ? 40 : star.baseHue + Math.sin(time * star.hueShift) * 15;
                    const glowColor = star.baseHue < 0
                        ? `hsla(40, 20%, 95%, ${opacity * 0.3})`
                        : hsl(glowH, 75, 80, opacity * 0.3);
                    const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 4);
                    glow.addColorStop(0, glowColor);
                    glow.addColorStop(1, star.baseHue < 0 ? 'hsla(40,20%,95%,0)' : hsl(glowH, 75, 80, 0));
                    ctx.fillStyle = glow;
                    ctx.fillRect(star.x - star.radius * 4, star.y - star.radius * 4, star.radius * 8, star.radius * 8);
                }
            }

            // ── Draw shooting stars with warm gold color shift ──
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                const tailX = s.x - Math.cos(s.angle) * s.length;
                const tailY = s.y - Math.sin(s.angle) * s.length;
                const currentHue = s.hue + time * 10;

                const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
                grad.addColorStop(0, `rgba(255, 255, 240, ${s.opacity})`);
                grad.addColorStop(0.3, hsl(currentHue, 80, 75, s.opacity * 0.7));
                grad.addColorStop(1, hsl(currentHue + 15, 80, 60, 0));

                ctx.beginPath();
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(tailX, tailY);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
                headGlow.addColorStop(0, `rgba(255, 255, 240, ${s.opacity})`);
                headGlow.addColorStop(1, `rgba(255, 255, 240, 0)`);
                ctx.fillStyle = headGlow;
                ctx.fillRect(s.x - 6, s.y - 6, 12, 12);

                s.x += Math.cos(s.angle) * s.speed;
                s.y += Math.sin(s.angle) * s.speed;
                s.opacity -= s.decay;

                if (s.opacity <= 0 || s.x > canvas.width + 100 || s.y > canvas.height + 100) {
                    shootingStars.splice(i, 1);
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        draw();

        const shootingInterval = setInterval(spawnShootingStar, 2500);

        const resizeObserver = new ResizeObserver(() => {
            canvas.height = document.documentElement.scrollHeight;
        });
        resizeObserver.observe(document.documentElement);

        window.addEventListener('resize', resize);
        return () => {
            cancelAnimationFrame(animationId);
            clearInterval(shootingInterval);
            resizeObserver.disconnect();
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
        />
    );
}
