document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MENÚ MÓVIL ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if(hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isFlex = mobileMenu.style.display === "flex";
            mobileMenu.style.display = isFlex ? "none" : "flex";
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.style.display = "none");
        });
    }

    // --- 2. CONTADORES ANIMADOS ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };
    const statsSection = document.querySelector('.stats-bar');
    if(statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) { animateCounters(); observer.disconnect(); }
        });
        observer.observe(statsSection);
    }

    // --- 3. SLIDER DE TESTIMONIOS ---
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('slider-dots');
    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll('.dot');
        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[currentIndex].classList.add('active');
        }
        function nextSlide() { currentIndex = (currentIndex + 1) % totalSlides; goToSlide(currentIndex); }
        let slideInterval = setInterval(nextSlide, 5000);
        track.parentElement.addEventListener('mouseenter', () => clearInterval(slideInterval));
        track.parentElement.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
    }

    // --- 4. SCROLL REVEAL ---
    const revealElements = document.querySelectorAll('.reveal, .eco-card');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if(entry.target.classList.contains('eco-card')) {
                    entry.target.classList.add('visible-card');
                } else {
                    entry.target.classList.add('active');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. BOTÓN VOLVER ARRIBA ---
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if(scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        };
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =========================================================
    // --- 6. SUITE DE ACCESIBILIDAD 2.0 (Lógica Completa) ---
    // =========================================================
    
    const accessBtn = document.getElementById('accessBtn');
    const accessPanel = document.getElementById('accessPanel');
    const closePanel = document.getElementById('closePanel');

    // Panel Toggle
    if(accessBtn && accessPanel) {
        const togglePanel = () => {
            accessPanel.classList.toggle('open');
            accessPanel.style.display = accessPanel.classList.contains('open') ? 'flex' : 'none';
        };
        accessBtn.addEventListener('click', togglePanel);
        closePanel.addEventListener('click', togglePanel);
    }

    // --- A. LOGICA DE AUDIO AL PASAR EL RATÓN (HOVER SPEECH) ---
    let hoverSpeechEnabled = false;
    let currentUtterance = null;
    let currentHighlighted = null;

    // Elementos que queremos que se lean
    const readableSelectors = 'h1, h2, h3, h4, p, a, button, li, .badge, .stat-item p, .eco-card h4, .eco-card p';

    function stopSpeaking() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        if (currentHighlighted) {
            currentHighlighted.classList.remove('speaking-highlight');
            currentHighlighted = null;
        }
    }

    function speakText(element) {
        if (!hoverSpeechEnabled) return;

        // Cancelar audio anterior
        stopSpeaking();

        // Obtener texto (o alt si es imagen)
        let textToRead = "";
        
        if (element.tagName === 'IMG') {
            textToRead = element.alt ? "Imagen de: " + element.alt : "Imagen decorativa";
        } else {
            textToRead = element.innerText || element.textContent;
        }

        // Limpiar texto vacío o muy corto
        textToRead = textToRead.trim();
        if (textToRead.length < 2) return;

        // Resaltar elemento visualmente
        currentHighlighted = element;
        element.classList.add('speaking-highlight');

        // Configurar Voz
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'es-ES'; // Español
        utterance.rate = 1;       // Velocidad normal
        utterance.pitch = 1;

        // Cuando termine de hablar, quitar resaltado
        utterance.onend = function() {
            if (currentHighlighted === element) {
                element.classList.remove('speaking-highlight');
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    // Event Delegation para Hover Speech
    document.body.addEventListener('mouseover', (e) => {
        if (!hoverSpeechEnabled) return;
        
        // Buscar el elemento legible más cercano
        const target = e.target.closest(readableSelectors);
        
        if (target && !target.classList.contains('access-toggle') && !target.closest('.access-panel')) {
            // Evitar que se repita si ya estamos sobre él
            if (currentHighlighted !== target) {
                speakText(target);
            }
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (!hoverSpeechEnabled) return;
        // Si salimos del elemento actual, parar
        const target = e.target.closest(readableSelectors);
        if (target && target === currentHighlighted) {
            stopSpeaking();
        }
    });

    // Función Toggle Global
    window.toggleHoverSpeech = function() {
        hoverSpeechEnabled = !hoverSpeechEnabled;
        const btn = document.getElementById('btnHoverSpeech');
        
        if (hoverSpeechEnabled) {
            btn.classList.add('active');
            // Feedback de audio inicial
            const u = new SpeechSynthesisUtterance("Modo de audio activado. Pase el ratón sobre los elementos.");
            u.lang = 'es-ES';
            window.speechSynthesis.speak(u);
        } else {
            btn.classList.remove('active');
            stopSpeaking();
        }
    };

    // --- B. GUÍA DE LECTURA (RULER) ---
    const readingGuide = document.getElementById('readingGuide');
    let readingGuideEnabled = false;

    window.toggleReadingGuide = function() {
        document.body.classList.toggle('show-guide');
        readingGuideEnabled = !readingGuideEnabled;
    };

    document.addEventListener('mousemove', (e) => {
        if (readingGuideEnabled) {
            // Posicionar la guía centrada en el cursor Y
            readingGuide.style.top = (e.clientY - 15) + 'px'; 
        }
    });

    // --- C. OTRAS FUNCIONES ---
    window.toggleContrast = function() { document.body.classList.toggle('high-contrast'); };
    window.toggleTextSize = function() { document.body.classList.toggle('large-text'); };
    window.toggleDyslexia = function() { document.body.classList.toggle('readable-font'); };
    window.toggleCursor = function() { document.body.classList.toggle('big-cursor'); };
    window.toggleLinksHighlight = function() { document.body.classList.toggle('highlight-links'); };

    window.resetAccessibility = function() {
        document.body.classList.remove('high-contrast', 'large-text', 'readable-font', 'big-cursor', 'highlight-links', 'show-guide');
        hoverSpeechEnabled = false;
        readingGuideEnabled = false;
        stopSpeaking();
        
        // Reset botones visuales
        const buttons = document.querySelectorAll('.access-option');
        buttons.forEach(btn => btn.classList.remove('active'));
    };
});