document.addEventListener('DOMContentLoaded', () => {

    /* ---- Mobile nav toggle ---- */
    const nav = document.getElementById('siteNav');
    const toggle = document.getElementById('navToggle');
    if (toggle) {
        toggle.addEventListener('click', () => nav.classList.toggle('open'));
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => nav.classList.remove('open'));
        });
    }

    /* ---- Scroll reveal ---- */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));

    
/* ---- KPI count-up ---- */
const kpiEls = document.querySelectorAll('.kpi-num[data-count]');

const animateCount = (el) => {
    if (el.dataset.animated === 'true') return;
    el.dataset.animated = 'true';

    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1200;
    let start = null;

    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);

        el.textContent = value.toLocaleString();

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.innerHTML = target.toLocaleString() + '<span class="kpi-suffix">' + suffix + '</span>';
        }
    };

    window.requestAnimationFrame(step);
};

// IntersectionObserver with Safari fallback
if ('IntersectionObserver' in window) {
    const kpiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check entry.isIntersecting or boundingClientRect for Safari safety
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
                animateCount(entry.target);
                kpiObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0, 
        rootMargin: '50px 0px 50px 0px' // Expands the trigger boundary for Safari viewports
    });

    kpiEls.forEach(el => kpiObserver.observe(el));
} else {
    kpiEls.forEach(el => animateCount(el));
}

// Fallback timer: Ensures Safari runs the count even if observer fails to report intersection
setTimeout(() => {
    kpiEls.forEach(el => animateCount(el));
}, 800);
    
    
    /* ---- Project filtering ---- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projectsGrid .project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const show = filter === 'all' || filter === category;
                card.style.display = show ? '' : 'none';
            });
        });
    });

    /* ---- Nav background on scroll (subtle) ---- */
    const siteNav = document.getElementById('siteNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            siteNav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
        } else {
            siteNav.style.boxShadow = 'none';
        }
    });

    /* ---- Ebook promo modal + banner ---- */
    const ebookModal = document.getElementById('ebookModal');
    const ebookBanner = document.getElementById('ebookBanner');
    const closeModalBtn = document.getElementById('closeModal');
    const closeBannerBtn = document.getElementById('closeBanner');
    const modalOverlay = document.getElementById('ebookModalOverlay');

    const MODAL_KEY = 'ebookModalDismissed';
    const BANNER_KEY = 'ebookBannerDismissed';

    function openModal() {
        if (!ebookModal) return;
        ebookModal.classList.add('is-open');
        document.body.classList.add('modal-open');
    }

    function showBanner() {
        if (!ebookBanner || localStorage.getItem(BANNER_KEY)) return;
        ebookBanner.hidden = false;
        document.body.classList.add('has-ebook-banner');
    }

    function closeModal() {
        if (!ebookModal) return;
        ebookModal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        // Show the top banner after modal is closed (unless user already dismissed it)
        showBanner();
        localStorage.setItem(MODAL_KEY, '1');
    }

    function closeBanner() {
        if (!ebookBanner) return;
        ebookBanner.hidden = true;
        document.body.classList.remove('has-ebook-banner');
        localStorage.setItem(BANNER_KEY, '1');
    }

    // Show modal on first visit (or when key is cleared)
    if (!localStorage.getItem(MODAL_KEY)) {
        // Small delay so the page paints first
        setTimeout(openModal, 600);
    } else {
        // Returning visitor who already dismissed modal → show banner
        showBanner();
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    if (closeBannerBtn) closeBannerBtn.addEventListener('click', closeBanner);

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ebookModal && ebookModal.classList.contains('is-open')) {
            closeModal();
        }
    });

});
