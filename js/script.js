document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            const isOpen = nav.classList.toggle('nav-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && nav.classList.contains('nav-open')) {
                nav.classList.remove('nav-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function handleAjaxForm(formId, successMessageId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const successMessage = document.getElementById(successMessageId);
        const button = form.querySelector('button[type="submit"]');
        const buttonText = button ? button.textContent : 'Verstuur';

        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            if (button) {
                button.disabled = true;
                button.textContent = 'Versturen...';
            }

            const formData = new FormData(form);
            const action = form.action;
            const payload = {};
            formData.forEach((value, key) => {
                payload[key] = value;
            });

            try {
                const response = await fetch(action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    if (successMessage) {
                        successMessage.classList.add('visible');
                    }
                    form.reset();
                } else {
                    throw new Error('Form submit failed');
                }
            } catch (error) {
                const name = payload.name || '';
                const email = payload.email || '';
                const message = payload.message || '';
                const subject = encodeURIComponent(payload.subject || 'Bericht via anarah.be');
                const body = encodeURIComponent(`Naam: ${name}\nE-mail: ${email}\n\n${message}`);
                window.location.href = `mailto:connect@anarah.be?subject=${subject}&body=${body}`;
            } finally {
                if (button) {
                    button.disabled = false;
                    button.textContent = buttonText;
                }
            }
        });
    }

    handleAjaxForm('contactForm', 'contactThanks');
    handleAjaxForm('reviewForm', 'reviewThanks');
});