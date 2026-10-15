
const canvas = document.getElementById("ocean");
const ctx = canvas.getContext("2d");

let width, height;
let time = 0;
let particles = [];

function resizeCanvas() {
    width = canvas.clientWidth;
    height = canvas.clientHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Membuat partikel sesuai ukuran layar
    particles = Array.from(
        { length: Math.floor(width / 5) },
        () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.8 + 0.4,
            speed: Math.random() * 0.6 + 0.2,
            alpha: Math.random() * 0.7 + 0.2
        })
    );
}

function drawOcean() {
    ctx.clearRect(0, 0, width, height);

    // Background gelap
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#020611");
    bg.addColorStop(0.5, "#041a31");
    bg.addColorStop(1, "#01040b");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Cahaya biru di tengah
    const glow = ctx.createRadialGradient(
        width * 0.5, height * 0.55, 0,
        width * 0.5, height * 0.55, width * 0.55
    );

    glow.addColorStop(0, "rgba(0, 130, 255, 0.18)");
    glow.addColorStop(1, "rgba(0, 30, 80, 0)");

    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // Partikel bercahaya
    for (const p of particles) {
        p.y -= p.speed;

        if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
        }

        const flicker =
            0.5 + 0.5 * Math.sin(time * 0.04 + p.x);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle =
            `rgba(0, 210, 255, ${p.alpha * flicker})`;

        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00cfff";
        ctx.fill();
    }

    ctx.shadowBlur = 0;

    // Gelombang laut digital
    const horizon = height * 0.58;
    const rows = 24;
    const columns = Math.ceil(width / 12);

    for (let row = 0; row < rows; row++) {
        ctx.beginPath();

        for (let col = 0; col <= columns; col++) {
            const x = (col / columns) * width;

            const depth = row / rows;
            const y =
                horizon +
                depth * height * 0.55 +
                Math.sin(col * 0.16 + time * 0.035 + row * 0.3)
                    * (5 + depth * 13) +
                Math.sin(col * 0.06 - time * 0.025)
                    * (3 + depth * 8);

            if (col === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        const opacity = 0.15 + (row / rows) * 0.65;

        ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
        ctx.lineWidth = 0.6 + (row / rows) * 0.7;
        ctx.shadowBlur = 5;
        ctx.shadowColor = "#008cff";
        ctx.stroke();
    }

    // Titik pada permukaan gelombang
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col += 3) {
            const x = (col / columns) * width;
            const depth = row / rows;

            const y =
                horizon +
                depth * height * 0.55 +
                Math.sin(col * 0.16 + time * 0.035 + row * 0.3)
                    * (5 + depth * 13) +
                Math.sin(col * 0.06 - time * 0.025)
                    * (3 + depth * 8);

            ctx.fillStyle =
                `rgba(0, 220, 255, ${0.2 + depth * 0.6})`;

            ctx.fillRect(x, y, 1.5, 1.5);
        }
    }

    ctx.shadowBlur = 0;

    // Garis cahaya melintas
    if (Math.sin(time * 0.025) > 0.96) {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.65;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 15, y - 10);

        ctx.strokeStyle = "rgba(0, 220, 255, 0.9)";
        ctx.stroke();
    }

    time++;
    requestAnimationFrame(drawOcean);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawOcean();
