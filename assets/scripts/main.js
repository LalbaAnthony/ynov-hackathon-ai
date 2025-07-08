// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Progress bar animation
const progressObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                }, 500);
            });
        }
    });
}, observerOptions);

const progressSection = document.querySelector('.progress');
if (progressSection) {
    progressObserver.observe(progressSection);
}

// Dynamic text animation for hero
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(typeWriter, 1000);
}

// Parallax effect for hero section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * target);
            counter.textContent = current + (counter.textContent.includes('%') ? '%' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    });
}

// Trigger counter animation when statistics section is visible
const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const statsSection = document.querySelector('.statistics');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Diaporama automatique pour la section restoration-visual
(function() {
    const container = document.querySelector('.restoration-visual.slideshow-container');
    if (!container) return;
    const slides = Array.from(container.querySelectorAll('.slide'));
    let current = 0;
    let timer = null;
    let started = false;
    let observer = null;

    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
    }

    function nextSlide() {
        // Si on passe à la vidéo, on attend la fin de la vidéo
        if (slides[current].classList.contains('video-slide')) {
            const video = slides[current].querySelector('video');
            if (video) {
                video.currentTime = 0;
                video.play();
                video.onended = () => {
                    advance();
                };
                return;
            }
        }
        // Sinon, timer classique (10s pour images fixes)
        timer = setTimeout(advance, 10000);
    }

    function advance() {
        current = (current + 1) % slides.length;
        showSlide(current);
        nextSlide();
    }

    function startSlideshow() {
        if (started) return;
        started = true;
        showSlide(current);
        nextSlide();
    }

    function stopSlideshow() {
        started = false;
        if (timer) clearTimeout(timer);
        // Pause la vidéo si elle est en cours
        if (slides[current].classList.contains('video-slide')) {
            const video = slides[current].querySelector('video');
            if (video) video.pause();
        }
    }

    // Observer pour démarrer/arrêter le diapo selon visibilité
    observer = new window.IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startSlideshow();
            } else {
                stopSlideshow();
            }
        });
    }, { threshold: 0.3 });
    observer.observe(container);
})();