document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initTheme();
    initAmbientBackground();
    initCountdown();
    initLiveClock();
    initTypingEffect();
    initAudioEngine();
    initScrollReveal();
    initVanillaTilt();
    initInteractiveEnvelope();
    initSurpriseLinkLock(); // Updated logic for the surprise link
    initSparkleCursor();
    checkDateLock();
});

// Target Date Setup (Midnight July 25, 2026)
const TARGET_DATE = new Date("July 11, 2026 00:00:00").getTime();
const START_DATE = new Date("March 01, 2026 00:00:00").getTime();

let ambientCtx, celebrationCtx, aCanvas, cCanvas;
let particles = [];
let celebrationElements = [];
let isCelebrationActive = false;

/* --- 1. Preloader --- */
function initPreloader() {
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
        setTimeout(() => {
            loader.classList.add("fade-out");
        }, 800);
    });
}

/* --- 2. Theme Management --- */
function initTheme() {
    const toggleBtn = document.getElementById("theme-toggle");
    const icon = toggleBtn.querySelector("i");
    
    document.body.classList.add("dark-mode");
    
    toggleBtn.addEventListener("click", () => {
        if(document.body.classList.contains("dark-mode")) {
            document.body.classList.replace("dark-mode", "light-mode");
            icon.classList.replace("fa-moon", "fa-sun");
        } else {
            document.body.classList.replace("light-mode", "dark-mode");
            icon.classList.replace("fa-sun", "fa-moon");
        }
    });
}

/* --- 3. Ambient Particle Layer --- */
function initAmbientBackground() {
    aCanvas = document.getElementById("ambient-canvas");
    ambientCtx = aCanvas.getContext("2d");
    resizeCanvas(aCanvas);
    
    window.addEventListener("resize", () => resizeCanvas(aCanvas));

    for(let i = 0; i < 95; i++) {
        particles.push({
            x: Math.random() * aCanvas.width,
            y: Math.random() * aCanvas.height,
            size: Math.random() * 3 + 1,
            speedY: -(Math.random() * 0.6 + 0.15),
            speedX: (Math.random() - 0.5) * 0.25,
            type: Math.random() > 0.50 ? 'heart' : 'star',
            alpha: Math.random() * 0.8 + 0.2
        });
    }
    
    function animate() {
        ambientCtx.clearRect(0, 0, aCanvas.width, aCanvas.height);
        
        particles.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            if(p.y < -20) p.y = aCanvas.height + 20;
            if(p.x < -20 || p.x > aCanvas.width + 20) p.x = Math.random() * aCanvas.width;
            
            ambientCtx.save();
            ambientCtx.globalAlpha = p.alpha;
            
            if(p.type === 'heart') {
                ambientCtx.fillStyle = document.body.classList.contains("dark-mode") ? "#ff3b6f" : "#ff7da1";
                ambientCtx.font = `${p.size * 5 + 6}px sans-serif`;
                ambientCtx.fillText("❤️", p.x, p.y);
            } else {
                ambientCtx.fillStyle = document.body.classList.contains("dark-mode") ? "#ffffff" : "#8b5cf6";
                ambientCtx.beginPath();
                ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ambientCtx.fill();
            }
            ambientCtx.restore();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/* --- 4. Main Countdown Engine --- */
function initCountdown() {
    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");
    const timerContainer = document.getElementById("countdown-timer");
    const wishContainer = document.getElementById("birthday-wish");
    const progressBar = document.getElementById("countdown-progress");

    function update() {
        const now = Date.now();
        const distance = TARGET_DATE - now;
        
        const totalDuration = TARGET_DATE - START_DATE;
        const elapsed = now - START_DATE;
        let percentage = (elapsed / totalDuration) * 100;
        percentage = Math.max(0, Math.min(100, percentage)); 
        progressBar.style.width = `${percentage}%`;

        if (distance < 0) {
            clearInterval(interval);
            timerContainer.classList.add("hidden");
            wishContainer.classList.remove("hidden");
            progressBar.parentElement.classList.add("hidden");

            document.querySelectorAll(".locked-section").forEach(section => section.classList.remove("hidden-lock")); 

            if (!isCelebrationActive) triggerCelebration();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        dEl.innerText = String(days).padStart(2, '0');
        hEl.innerText = String(hours).padStart(2, '0');
        mEl.innerText = String(minutes).padStart(2, '0');
        sEl.innerText = String(seconds).padStart(2, '0');
    }

    const interval = setInterval(update, 1000);
    update();
}

/* --- 5. Live Clock --- */
function initLiveClock() {
    const clockEl = document.getElementById("live-clock-time");
    setInterval(() => {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString();
    }, 1000);
}

/* --- 6. Typing Animation --- */
function initTypingEffect() {
    const words = ["25 July", "My Girl's Special Day✨", "Who is Irreplaceable...❤️❤️"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const targetText = document.getElementById("typing-text");

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            targetText.innerText = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            targetText.innerText = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }
    type();
}

/* --- 7. Audio Infrastructure Management --- */
function initAudioEngine() {
    const music = document.getElementById("bg-music");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const volumeSlider = document.getElementById("volume-slider");
    const icon = playPauseBtn.querySelector("i");

    playPauseBtn.addEventListener("click", () => {
        if(music.paused) {
            music.play().catch(e => console.log("Interaction required before playback init."));
            icon.classList.replace("fa-play", "fa-pause");
        } else {
            music.pause();
            icon.classList.replace("fa-pause", "fa-play");
        }
    });

    volumeSlider.addEventListener("input", (e) => {
        music.volume = e.target.value;
    });

    document.body.addEventListener("click", () => {
        if(music.paused && icon.classList.contains("fa-play")) {
            music.play().then(() => {
                icon.classList.replace("fa-play", "fa-pause");
            }).catch(() => {});
        }
    }, { once: true });
}

/* --- 8. Intersection Observer for Scroll Animations --- */
function initScrollReveal() {
    const items = document.querySelectorAll(".scroll-reveal");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => observer.observe(item));
}

/* --- 9. Native Tilt Mechanics --- */
function initVanillaTilt() {
    const cards = document.querySelectorAll("[data-tilt]");
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const tiltX = (yc - y) / 15;
            const tiltY = (x - xc) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        
        card.addEventListener("mouseleave", () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });
}

/* --- 10. Date-Locked Envelope Mechanics --- */
function initInteractiveEnvelope() {
    const wrapper = document.getElementById("envelope-wrapper");
    const lockNotice = document.getElementById("letter-lock-notice");
    
    const now = Date.now();
    const isUnlocked = now >= TARGET_DATE;

    if (!isUnlocked) {
        wrapper.classList.add("locked");
        lockNotice.classList.remove("hidden");
    }

    wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        
        if (!isUnlocked) {
            wrapper.style.transform = "translateX(10px)";
            setTimeout(() => wrapper.style.transform = "translateX(-10px)", 70);
            setTimeout(() => wrapper.style.transform = "translateX(5px)", 140);
            setTimeout(() => wrapper.style.transform = "translateX(0)", 210);
            return;
        }

        wrapper.classList.toggle("open");
    });
}

/* --- 11. Date-Locked Surprise Link Engine --- */
function initSurpriseLinkLock() {
    const wrapperLink = document.querySelector(".glowing-btn-link");
    const btn = document.getElementById("open-surprise-btn");
    
    wrapperLink.addEventListener("click", (e) => {
        const now = Date.now();
        const isUnlocked = now >= TARGET_DATE;
        
        if (!isUnlocked) {
            // Block navigation from triggering
            e.preventDefault();
            
            // Premium shake visual warning feedback
            btn.style.transform = "scale(1.05) translateX(8px)";
            btn.style.background = "linear-gradient(45deg, #7b1fa2, #e91e63)"; // Temporary hue shift alert
            
            setTimeout(() => btn.style.transform = "scale(1.05) translateX(-8px)", 70);
            setTimeout(() => btn.style.transform = "scale(1.05) translateX(4px)", 140);
            setTimeout(() => {
                btn.style.transform = "none";
                btn.style.background = ""; // Restore premium default css configurations
            }, 210);
        }
    });
}

/* --- 12. Cursor Particle Tracking --- */
function initSparkleCursor() {
    const glow = document.getElementById("cursor-glow");
    window.addEventListener("mousemove", (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

/* --- 13. Celebration Engine --- */
function triggerCelebration() {
    isCelebrationActive = true;
    cCanvas = document.getElementById("celebration-canvas");
    celebrationCtx = cCanvas.getContext("2d");
    resizeCanvas(cCanvas);
    window.addEventListener("resize", () => resizeCanvas(cCanvas));

    setInterval(spawnFirework, 700);
    setInterval(spawnBalloon, 1200);
    for(let i=0; i<80; i++) spawnConfetti();

    function animate() {
        celebrationCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        
        celebrationElements.forEach((el, index) => {
            el.update();
            el.draw();
            if(el.alpha <= 0 || el.y < -100) {
                celebrationElements.splice(index, 1);
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function spawnFirework() {
    const targetX = Math.random() * cCanvas.width;
    const targetY = Math.random() * (cCanvas.height * 0.5);
    const colors = ["#ff3b6f", "#8b5cf6", "#d4af37", "#00f0ff", "#ff00ff"];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    
    for(let i=0; i<40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        celebrationElements.push({
            x: targetX, y: targetY,
            vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
            radius: Math.random() * 2 + 1, alpha: 1, decay: Math.random() * 0.015 + 0.01,
            color: chosenColor,
            update() { this.x += this.vx; this.y += this.vy; this.vy += 0.04; this.alpha -= this.decay; },
            draw() {
                celebrationCtx.save();
                celebrationCtx.globalAlpha = this.alpha;
                celebrationCtx.fillStyle = this.color;
                celebrationCtx.beginPath(); celebrationCtx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                celebrationCtx.fill(); celebrationCtx.restore();
            }
        });
    }
}

function spawnConfetti() {
    const colors = ["#ff3b6f", "#8b5cf6", "#ffffff", "#d4af37"];
    celebrationElements.push({
        x: Math.random() * cCanvas.width, y: Math.random() * -cCanvas.height,
        vx: Math.random() * 2 - 1, vy: Math.random() * 3 + 2,
        w: Math.random() * 8 + 4, h: Math.random() * 12 + 6,
        color: colors[Math.floor(Math.random() * colors.length)], rotation: Math.random() * 360,
        update() { this.x += this.vx; this.y += this.vy; this.rotation += 2; if(this.y > cCanvas.height) this.y = -20; },
        draw() {
            celebrationCtx.save();
            celebrationCtx.translate(this.x, this.y);
            celebrationCtx.rotate(this.rotation * Math.PI / 180);
            celebrationCtx.fillStyle = this.color;
            celebrationCtx.fillRect(-this.w/2, -this.h/2, this.w, this.h);
            celebrationCtx.restore();
        }
    });
}

function spawnBalloon() {
    const colors = ["rgba(255,59,111,0.7)", "rgba(139,92,246,0.7)", "rgba(212,175,55,0.7)"];
    celebrationElements.push({
        x: Math.random() * cCanvas.width, y: cCanvas.height + 50,
        speedY: -(Math.random() * 2 + 1.5), radius: Math.random() * 20 + 20,
        color: colors[Math.floor(Math.random() * colors.length)], swing: Math.random() * 0.05, swingAmt: 0,
        update() { this.y += this.speedY; this.swingAmt += this.swing; this.x += Math.sin(this.swingAmt) * 0.5; },
        draw() {
            celebrationCtx.save();
            celebrationCtx.fillStyle = this.color;
            celebrationCtx.beginPath();
            celebrationCtx.ellipse(this.x, this.y, this.radius * 0.75, this.radius, 0, 0, Math.PI * 2);
            celebrationCtx.fill();
            celebrationCtx.strokeStyle = "rgba(255,255,255,0.4)";
            celebrationCtx.beginPath(); celebrationCtx.moveTo(this.x, this.y + this.radius);
            celebrationCtx.lineTo(this.x, this.y + this.radius + 30); celebrationCtx.stroke();
            celebrationCtx.restore();
        }
    });
}
// 👇 Add this anywhere at the bottom of script.js
function checkDateLock() {
    const now = Date.now();
    const isUnlocked = now >= TARGET_DATE;

    if (!isUnlocked) {
        // Find your Captured Moments, Timeline, Letter, and Surprise sections
        const sectionsToLock = document.querySelectorAll(".gallery-section, .timeline-section, .letter-section, .surprise-section");
        
        sectionsToLock.forEach(section => {
            // 1. Add a CSS helper class to cleanly hide them
            section.classList.add("hidden-lock");
            // 2. Add a structural class for the countdown to find later
            section.classList.add("locked-section");
        });
    }
}
