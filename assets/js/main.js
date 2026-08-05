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
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        
        // Formats large numbers with commas (e.g., 1,000,000)
        el.textContent = value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.innerHTML = target.toLocaleString() + '<span class="kpi-suffix">' + suffix + '</span>';
        }
    };
    requestAnimationFrame(step);
};

const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCount(entry.target);
            kpiObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.1, // Lowered threshold from 0.5 to 0.1 so it triggers reliably on all devices
    rootMargin: "0px 0px -50px 0px"
});

kpiEls.forEach(el => kpiObserver.observe(el));
    
    
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

});
