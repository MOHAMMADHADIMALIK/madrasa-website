/* ============================================
   JAMIATUZZAHRA – Interactive JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- DOM Elements ----------
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTop = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('.section, .hero');
    const animatedElements = document.querySelectorAll('.animate-on-scroll:not(.hero .animate-on-scroll)');
    const statNumbers = document.querySelectorAll('.stat__number');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxContent = document.getElementById('lightbox-content');

    let currentLightboxIndex = 0;

    // ---------- Mobile Navigation ----------
    function openNav() {
        navMenu.classList.add('show');
        document.body.style.overflow = 'hidden';
        if (navToggle) navToggle.classList.add('hidden');
    }

    function closeNav() {
        navMenu.classList.remove('show');
        document.body.style.overflow = '';
        if (navToggle) navToggle.classList.remove('hidden');
    }

    if (navToggle) navToggle.addEventListener('click', openNav);
    if (navClose) navClose.addEventListener('click', closeNav);

    // Close nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close nav if clicking the dropdown toggle
            if (link.classList.contains('nav__link--dropdown')) return;
            closeNav();
        });
    });

    // Close nav on dropdown link click
    document.querySelectorAll('.dropdown__link').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Mobile dropdown toggle
    const dropdownToggle = document.querySelector('.nav__link--dropdown');
    const dropdownParent = document.querySelector('.nav__dropdown');

    if (dropdownToggle && dropdownParent) {
        dropdownToggle.addEventListener('click', (e) => {
            // Only toggle on mobile (when nav menu is in mobile mode)
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownParent.classList.toggle('active');
            }
        });
    }

    // Close nav on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('show') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeNav();
        }
    });

    // ---------- Sticky Header ----------
    function handleScroll() {
        const scrollY = window.scrollY;

        // Header background
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // ---------- Active Nav Link on Scroll ----------
    function setActiveLink() {
        const scrollY = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // ---------- Scroll Animations (IntersectionObserver) ----------
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => scrollObserver.observe(el));

    // ---------- Counter Animation ----------
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero__stats');
    if (statsSection) counterObserver.observe(statsSection);

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            }

            requestAnimationFrame(updateCount);
        });
    }

    // ---------- Gallery Lightbox ----------
    const galleryPlaceholders = [];
    galleryItems.forEach((item, index) => {
        const placeholder = item.querySelector('.image-placeholder');
        const img = item.querySelector('img');
        galleryPlaceholders.push({ placeholder, img, index });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        lightboxContent.innerHTML = '';
        const item = galleryItems[currentLightboxIndex];
        const img = item.querySelector('img');
        const placeholder = item.querySelector('.image-placeholder');

        if (img) {
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Gallery Image';
            lightboxContent.appendChild(lightboxImg);
        } else if (placeholder) {
            const clone = placeholder.cloneNode(true);
            lightboxContent.appendChild(clone);
        }
    }

    function nextImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }

    function prevImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Close on overlay click
    const lightboxOverlay = document.querySelector('.lightbox__overlay');
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // ---------- Smooth Scroll for all anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 80;
                const targetPosition = target.offsetTop - headerOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- Parallax Effect on Hero (subtle) ----------
    const heroContent = document.querySelector('.hero__content');

    window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.3;
            if (heroContent) {
                heroContent.style.transform = `translateY(${offset}px)`;
                heroContent.style.opacity = 1 - (window.scrollY / window.innerHeight) * 0.5;
            }
        }
    });

    // ---------- Gallery Show More Toggle ----------
    const galleryToggle = document.getElementById('gallery-toggle');
    const galleryGrid = document.getElementById('gallery-grid');

    if (galleryToggle && galleryGrid) {
        let isExpanded = false;

        galleryToggle.addEventListener('click', () => {
            isExpanded = !isExpanded;
            galleryGrid.classList.toggle('gallery--expanded', isExpanded);

            const btnText = galleryToggle.querySelector('span');
            const btnIcon = galleryToggle.querySelector('.gallery-toggle-icon');

            if (isExpanded) {
                btnText.textContent = 'Show Less Photos';
                btnIcon.style.transform = 'rotate(180deg)';
                // Trigger scroll animations for newly visible items
                const hiddenItems = galleryGrid.querySelectorAll('.gallery__item--hidden');
                hiddenItems.forEach(item => {
                    item.classList.add('animated');
                });
            } else {
                btnText.textContent = 'Show More Photos';
                btnIcon.style.transform = 'rotate(0deg)';
                // Scroll back to gallery top
                const gallerySection = document.getElementById('gallery');
                if (gallerySection) {
                    const headerOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10) || 80;
                    window.scrollTo({
                        top: gallerySection.offsetTop - headerOffset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
    // ==========================================
    // Poster Lightbox
    // ==========================================
    const posterLightbox = document.getElementById('poster-lightbox');
    const posterLightboxImg = document.getElementById('poster-lightbox-img');
    const posterLightboxClose = document.getElementById('poster-lightbox-close');
    const posterLightboxOverlay = posterLightbox ? posterLightbox.querySelector('.poster-lightbox__overlay') : null;

    // Open poster lightbox on image click
    document.querySelectorAll('.poster__image-wrapper[data-poster-src]').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const src = wrapper.getAttribute('data-poster-src');
            if (src && posterLightbox && posterLightboxImg) {
                posterLightboxImg.src = src;
                posterLightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close poster lightbox
    function closePosterLightbox() {
        if (posterLightbox) {
            posterLightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (posterLightboxClose) posterLightboxClose.addEventListener('click', closePosterLightbox);
    if (posterLightboxOverlay) posterLightboxOverlay.addEventListener('click', closePosterLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && posterLightbox && posterLightbox.classList.contains('active')) {
            closePosterLightbox();
        }
    });

});
