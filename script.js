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

    // Activar contadores cuando sean visibles
    const statsSection = document.querySelector('.stats-bar');
    if(statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect();
            }
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
        
        // Limpiar puntos previos si existen
        dotsContainer.innerHTML = '';

        // Crear puntos de navegación
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

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalSlides;
            goToSlide(currentIndex);
        }

        // Cambio automático
        let slideInterval = setInterval(nextSlide, 5000);

        // Pausar interacción
        track.parentElement.addEventListener('mouseenter', () => clearInterval(slideInterval));
        track.parentElement.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));
    }

    // --- 4. ANIMACIÓN SECCIÓN SOSTENIBILIDAD ---
    const ecoCards = document.querySelectorAll('.eco-card');
    if(ecoCards.length > 0) {
        const ecoObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if(entry.isIntersecting) {
                    // Pequeño retraso escalonado para cada tarjeta
                    setTimeout(() => {
                        entry.target.classList.add('visible-card');
                    }, index * 150); 
                    ecoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        ecoCards.forEach(card => {
            ecoObserver.observe(card);
        });
    }
});