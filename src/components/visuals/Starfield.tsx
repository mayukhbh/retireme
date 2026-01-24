import { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    z: number; // depth for parallax
    size: number;
    baseOpacity: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    color: string;
}

const Starfield = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        let time = 0;

        // Star colors - mostly white with occasional purple/cyan tints
        const starColors = [
            '#FFFFFF',
            '#FFFFFF',
            '#FFFFFF',
            '#E0E7FF', // slight blue
            '#F5D0FE', // slight purple
            '#A5F3FC', // slight cyan
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initStars();
        };

        const initStars = () => {
            const starCount = Math.floor((window.innerWidth * window.innerHeight) / 2500);
            stars = [];

            for (let i = 0; i < starCount; i++) {
                const z = Math.random(); // 0 = far, 1 = close
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z,
                    size: 0.5 + z * 1.5, // Closer stars are bigger
                    baseOpacity: 0.3 + z * 0.5, // Closer stars are brighter
                    twinkleSpeed: 0.5 + Math.random() * 2,
                    twinkleOffset: Math.random() * Math.PI * 2,
                    color: starColors[Math.floor(Math.random() * starColors.length)],
                });
            }

            // Sort by depth so far stars render first
            stars.sort((a, b) => a.z - b.z);
        };

        const animate = () => {
            time += 0.016; // ~60fps
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                // Twinkling effect
                const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
                const opacity = star.baseOpacity * (0.6 + twinkle * 0.4);

                // Parallax movement - closer stars move faster
                const speed = 0.02 + star.z * 0.15;
                star.y -= speed;

                // Wrap around
                if (star.y < -10) {
                    star.y = canvas.height + 10;
                    star.x = Math.random() * canvas.width;
                }

                // Draw star with glow effect for brighter ones
                ctx.globalAlpha = opacity;

                if (star.z > 0.7) {
                    // Brighter stars get a subtle glow
                    const gradient = ctx.createRadialGradient(
                        star.x, star.y, 0,
                        star.x, star.y, star.size * 3
                    );
                    gradient.addColorStop(0, star.color);
                    gradient.addColorStop(0.5, star.color.replace('FF', '40'));
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                // Core star
                ctx.fillStyle = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-60"
        />
    );
};

export default Starfield;
