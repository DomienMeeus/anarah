document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const sectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    const setMenu = (open) => {
        if (!navToggle || !navLinks) return;
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Sluit menu' : 'Open menu');
        navLinks.classList.toggle('open', open);
        header?.classList.toggle('menu-visible', open);
        document.body.classList.toggle('menu-open', open);
    };

    navToggle?.addEventListener('click', () => {
        setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    sectionLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMenu(false);
    });

    const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    const sections = document.querySelectorAll('main section[id]');
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                sectionLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-25% 0px -65% 0px' });
        sections.forEach((section) => sectionObserver.observe(section));
    }

    const privacy = document.getElementById('privacy');
    const openPrivacyFromHash = () => {
        if (window.location.hash === '#privacy' && privacy) privacy.open = true;
    };
    openPrivacyFromHash();
    window.addEventListener('hashchange', openPrivacyFromHash);

    const form = document.getElementById('contactForm');
    const status = document.getElementById('contactThanks');

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = form.querySelector('button[type="submit"]');
        const originalText = button?.textContent || 'Verstuur bericht';
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        if (button) {
            button.disabled = true;
            button.textContent = 'Even geduld…';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Formulier kon niet worden verzonden');

            form.reset();
            if (status) {
                status.textContent = 'Dankjewel. Je bericht is goed ontvangen.';
                status.classList.add('visible');
            }
        } catch (error) {
            const subject = encodeURIComponent('Bericht via anarah.be');
            const body = encodeURIComponent(`Naam: ${payload.name || ''}\nE-mail: ${payload.email || ''}\nInteresse: ${payload.interest || ''}\n\n${payload.message || ''}`);
            window.location.href = `mailto:connect@anarah.be?subject=${subject}&body=${body}`;
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = originalText;
            }
        }
    });
});
