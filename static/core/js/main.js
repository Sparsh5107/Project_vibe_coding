document.addEventListener('DOMContentLoaded', function() {
    /* ----------------------------------------------------
       1. Dark / Light Theme System
       ---------------------------------------------------- */
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;
    const storedTheme = localStorage.getItem('foodbridge_theme') || 
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('foodbridge_theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    applyTheme(storedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    /* ----------------------------------------------------
       2. Mobile Navigation Toggle
       ---------------------------------------------------- */
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });

        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }

    /* ----------------------------------------------------
       3. Live Expiry Countdown Tickers
       ---------------------------------------------------- */
    const countdownElements = document.querySelectorAll('.live-countdown');

    function updateLiveCountdowns() {
        const now = new Date().getTime();

        countdownElements.forEach(function(el) {
            const expiresIso = el.getAttribute('data-expires');
            if (!expiresIso) return;

            const expiryTime = new Date(expiresIso).getTime();
            const diff = expiryTime - now;

            if (isNaN(expiryTime)) return;

            if (diff <= 0) {
                el.innerHTML = '<span class="status-expired">⚠️ Expired</span>';
                const card = el.closest('.card');
                if (card) {
                    card.classList.add('card-dimmed');
                }
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);

                let timeStr = '';
                if (hours > 0) {
                    timeStr += `${hours}h `;
                }
                timeStr += `${mins}m ${secs}s left`;

                if (hours === 0 && mins < 60) {
                    el.innerHTML = `<span class="time-urgent">🔥 ${timeStr}</span>`;
                } else {
                    el.innerHTML = `⏱️ ${timeStr}`;
                }
            }
        });
    }

    if (countdownElements.length > 0) {
        updateLiveCountdowns();
        setInterval(updateLiveCountdowns, 1000);
    }

    /* ----------------------------------------------------
       4. Find Food Interactive Search, Filter & Sort
       ---------------------------------------------------- */
    const searchInput = document.getElementById('foodSearch');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const filterPills = document.querySelectorAll('.filter-pill');
    const sortSelect = document.getElementById('foodSortSelect');
    const donationsGrid = document.getElementById('donationsGrid');
    const cards = donationsGrid ? Array.from(donationsGrid.querySelectorAll('.donation-card')) : [];
    const resultsCount = document.getElementById('resultsCount');
    const noResultsMsg = document.getElementById('noFilterResults');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');

    let currentSearch = '';
    let currentCategory = 'ALL';
    let currentSort = 'urgency';

    function applyFilterAndSort() {
        if (!donationsGrid || cards.length === 0) return;

        let visibleCards = cards.filter(function(card) {
            const foodName = (card.getAttribute('data-food-name') || '').toLowerCase();
            const donor = (card.getAttribute('data-donor') || '').toLowerCase();
            const location = (card.getAttribute('data-location') || '').toLowerCase();
            const type = card.getAttribute('data-type') || '';

            const matchesSearch = !currentSearch || 
                foodName.includes(currentSearch) || 
                donor.includes(currentSearch) || 
                location.includes(currentSearch);

            const matchesCategory = (currentCategory === 'ALL') || (type === currentCategory);

            return matchesSearch && matchesCategory;
        });

        // Sort visible cards
        visibleCards.sort(function(a, b) {
            if (currentSort === 'qty-desc') {
                return (parseInt(b.getAttribute('data-quantity'), 10) || 0) - (parseInt(a.getAttribute('data-quantity'), 10) || 0);
            } else if (currentSort === 'qty-asc') {
                return (parseInt(a.getAttribute('data-quantity'), 10) || 0) - (parseInt(b.getAttribute('data-quantity'), 10) || 0);
            } else {
                // 'urgency' - earliest expiry first
                const expA = new Date(a.getAttribute('data-expires-iso') || 0).getTime();
                const expB = new Date(b.getAttribute('data-expires-iso') || 0).getTime();
                return expA - expB;
            }
        });

        // Hide all cards first, then append sorted visible ones
        cards.forEach(card => card.style.display = 'none');

        visibleCards.forEach(function(card) {
            card.style.display = '';
            donationsGrid.appendChild(card);
        });

        // Update counts and empty state
        if (resultsCount) {
            resultsCount.textContent = `Showing ${visibleCards.length} of ${cards.length} available donations`;
        }

        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCards.length === 0 ? 'block' : 'none';
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearch = e.target.value.trim().toLowerCase();
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentSearch ? 'block' : 'none';
            }
            applyFilterAndSort();
        });
    }

    if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            currentSearch = '';
            clearSearchBtn.style.display = 'none';
            applyFilterAndSort();
            searchInput.focus();
        });
    }

    filterPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            filterPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.getAttribute('data-category') || 'ALL';
            applyFilterAndSort();
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener('change', function(e) {
            currentSort = e.target.value;
            applyFilterAndSort();
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            if (searchInput) searchInput.value = '';
            currentSearch = '';
            if (clearSearchBtn) clearSearchBtn.style.display = 'none';
            filterPills.forEach(p => p.classList.remove('active'));
            const allPill = document.querySelector('.filter-pill[data-category="ALL"]');
            if (allPill) allPill.classList.add('active');
            currentCategory = 'ALL';
            if (sortSelect) sortSelect.value = 'urgency';
            currentSort = 'urgency';
            applyFilterAndSort();
        });
    }

    /* ----------------------------------------------------
       5. Animated Number Counters on Scroll
       ---------------------------------------------------- */
    const counterElements = document.querySelectorAll('.stat-number, .impact-card-number');

    if (counterElements.length > 0) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const rawVal = el.innerText.trim();
                    const targetVal = parseFloat(rawVal.replace(/[^0-9.]/g, ''));

                    if (!isNaN(targetVal) && targetVal > 0) {
                        let currentVal = 0;
                        const duration = 1200;
                        const steps = 30;
                        const increment = targetVal / steps;
                        const stepTime = duration / steps;

                        const timer = setInterval(function() {
                            currentVal += increment;
                            if (currentVal >= targetVal) {
                                el.innerText = rawVal.includes('.') ? targetVal.toFixed(1) : Math.round(targetVal).toLocaleString();
                                clearInterval(timer);
                            } else {
                                el.innerText = rawVal.includes('.') ? currentVal.toFixed(1) : Math.round(currentVal).toLocaleString();
                            }
                        }, stepTime);
                    }
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    /* ----------------------------------------------------
       6. Quick-Fill Presets for Donate Form
       ---------------------------------------------------- */
    const presetButtons = document.querySelectorAll('.preset-btn');
    if (presetButtons.length > 0) {
        const presets = {
            banquet: {
                food_name: 'Gourmet Pasta & Roasted Veggies',
                quantity: 45,
                food_type: 'PREPARED',
                donor_name: 'Grand City Hotel Catering',
                location: 'Grand Ballroom, 100 Main St',
                note: 'Freshly prepared for evening conference. Packaged in aluminum chafing trays.'
            },
            bakery: {
                food_name: 'Artisan Sourdough & Croissants',
                quantity: 25,
                food_type: 'BAKED',
                donor_name: 'Golden Crust Bakery',
                location: '42 Baker Street, Downtown',
                note: 'Baked this morning. Includes assorted baguettes and chocolate croissants.'
            },
            produce: {
                food_name: 'Organic Salad Greens & Heirloom Tomatoes',
                quantity: 30,
                food_type: 'PRODUCE',
                donor_name: 'Green Harvest Community Farm',
                location: 'Farmers Market Stall 12, Park Ave',
                note: 'Freshly harvested this morning. Stored in climate-controlled crates.'
            }
        };

        presetButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const key = this.getAttribute('data-preset');
                const data = presets[key];
                if (!data) return;

                const nameInput = document.getElementById('id_food_name');
                const qtyInput = document.getElementById('id_quantity');
                const typeInput = document.getElementById('id_food_type');
                const donorInput = document.getElementById('id_donor_name');
                const locInput = document.getElementById('id_location');
                const prepInput = document.getElementById('id_prepared_at');
                const untilInput = document.getElementById('id_available_until');
                const noteInput = document.getElementById('id_note');

                if (nameInput) nameInput.value = data.food_name;
                if (qtyInput) qtyInput.value = data.quantity;
                if (typeInput) typeInput.value = data.food_type;
                if (donorInput) donorInput.value = data.donor_name;
                if (locInput) locInput.value = data.location;
                if (noteInput) noteInput.value = data.note;

                // Set sensible default times: prepared now, available until +4 hours
                const now = new Date();
                const nowIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                const plus4h = new Date(now.getTime() + (4 * 60 * 60 * 1000) - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

                if (prepInput && !prepInput.value) prepInput.value = nowIso;
                if (untilInput && !untilInput.value) untilInput.value = plus4h;

                // Visual flash indicator
                presetButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    /* ----------------------------------------------------
       7. Scroll-triggered Fade-in Animations
       ---------------------------------------------------- */
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(function(el) {
            observer.observe(el);
        });
    }

    /* ----------------------------------------------------
       8. Auto-dismiss alerts
       ---------------------------------------------------- */
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(function() {
                alert.remove();
            }, 300);
        }, 5000);
    });

    /* ----------------------------------------------------
       9. Smooth scroll for anchor links
       ---------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
