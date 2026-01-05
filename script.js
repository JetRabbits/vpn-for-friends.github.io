document.addEventListener('DOMContentLoaded', () => {
    // Config
    const config = {
        botLink: "https://t.me/vpn_club_for_friends_bot",
        // You can add more config parameters here
    };

    // Internationalization (i18n)
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = userLang && userLang.toLowerCase().includes('ru') ? 'ru' : 'en';
    const langToggleBtn = document.getElementById('lang-toggle');
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');

    function updateContent() {
        // Update Static Text
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                if (translations[currentLang][key].includes('<')) {
                    el.innerHTML = translations[currentLang][key];
                } else {
                    el.textContent = translations[currentLang][key];
                }
            }
        });
        document.documentElement.lang = currentLang;
        langToggleBtn.textContent = currentLang === 'en' ? 'RU' : 'EN';

        // Update Bot Links
        document.querySelectorAll('[data-bot-link]').forEach(el => {
            el.setAttribute('href', config.botLink);
        });

        // Update Dynamic Prices
        if (typeof pricingConfig !== 'undefined' && typeof calculatePrices === 'function') {
            pricingConfig.plans.forEach(plan => {
                const prices = calculatePrices(plan.trxPrice);
                const card = document.querySelector(`.pricing-card[data-plan-id="${plan.id}"]`);
                if (card) {
                    const fiatPriceEl = card.querySelector('[data-price-type="fiat"]');
                    const trxPriceEl = card.querySelector('[data-price-type="trx"]');

                    if (fiatPriceEl) {
                        if (currentLang === 'ru') {
                            fiatPriceEl.textContent = `${prices.rub} ₽`;
                        } else {
                            fiatPriceEl.textContent = `$${prices.usd}`;
                        }
                    }

                    if (trxPriceEl) {
                        const starsLabel = translations[currentLang].telegram_stars;
                        trxPriceEl.textContent = `${prices.trx} ⭐️ ${starsLabel}`;
                    }
                }
            });
        }
    }

    langToggleBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ru' : 'en';
        updateContent();
    });

    // Initial content update based on detected language
    updateContent();

    // Simple scroll animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .pricing-card, .section-title, .ua-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add visible class styling dynamically
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Update Copyright Year from External Time API
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        fetch('https://worldtimeapi.org/api/timezone/Etc/UTC')
            .then(response => response.json())
            .then(data => {
                const dateTime = new Date(data.datetime);
                yearSpan.textContent = dateTime.getFullYear();
            })
            .catch(error => {
                console.warn('Time API request failed, using system time:', error);
                yearSpan.textContent = new Date().getFullYear();
            });
    }
});
