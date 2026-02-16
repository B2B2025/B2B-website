document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            this.initMobileMenu();
            this.initDownloadRedirect();
            this.initHeroTyping();
            this.initAppTyping();
            this.initSchemesAnimation();
            this.initCounters();
            this.initTestimonialCarousel();
            this.initNewsletterForm();
            this.initRevealObserver();
            this.initParallax();
            this.initMatchEngine();
        },


        // --- Mobile Menu ---
        initMobileMenu() {
            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (!navToggle || !navLinks) return;

            navToggle.addEventListener('click', () => {
                const isExpanded = navLinks.classList.toggle('active');
                navToggle.setAttribute('aria-expanded', isExpanded);
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.replace(isExpanded ? 'fa-bars' : 'fa-times', isExpanded ? 'fa-times' : 'fa-bars');
                }
            });

            document.querySelectorAll('.nav-link, .btn-cta').forEach(item => {
                item.addEventListener('click', () => {
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        const icon = navToggle.querySelector('i');
                        if (icon) icon.classList.replace('fa-times', 'fa-bars');
                    }
                });
            });
        },

        // --- Download Redirect ---
        initDownloadRedirect() {
            const downloadBtn = document.getElementById('download-btn');
            if (downloadBtn) {
                const userAgent = navigator.userAgent || navigator.vendor || window.opera;
                const playStoreUrl = "https://play.google.com/store/apps/details?id=com.bharat2business.app";
                const appStoreUrl = "https://apps.apple.com/in/app/bharat2business/id123456789";

                if (/android/i.test(userAgent)) {
                    downloadBtn.href = playStoreUrl;
                } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    downloadBtn.href = appStoreUrl;
                } else {
                    downloadBtn.href = "contact.html";
                }
            }
        },

        // --- Typing Animations ---
        initHeroTyping() {
            const typedTextSpan = document.querySelector(".hero .typed-text");
            if (!typedTextSpan) return;

            const phrases = ["Empower", "Elevate", "Expand"];
            let phraseIndex = 0;
            let charIdx = 0;
            let isDeleting = false;

            const type = () => {
                const currentPhrase = phrases[phraseIndex];
                if (isDeleting) {
                    typedTextSpan.textContent = currentPhrase.substring(0, charIdx - 1);
                    charIdx--;
                } else {
                    typedTextSpan.textContent = currentPhrase.substring(0, charIdx + 1);
                    charIdx++;
                }

                let typeSpeed = isDeleting ? 75 : 150;

                if (!isDeleting && charIdx === currentPhrase.length) {
                    typeSpeed = 2000; // Pause at end
                    isDeleting = true;
                } else if (isDeleting && charIdx === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typeSpeed = 500; // Pause before next word
                }

                setTimeout(type, typeSpeed);
            };

            setTimeout(type, 1000);
        },

        initAppTyping() {
            const typedTextSpan = document.querySelector(".typed-text");
            const cursorSpan = document.querySelector(".cursor");
            const appTarget = document.getElementById('app-typing-target');
            if (!typedTextSpan || !appTarget) return;

            const appPhrases = ["How to file GST?", "Latest MSME subsidies?", "Apply for business loan", "Decode export policy"];
            let appPhraseIndex = 0;
            let appCharIdx = 0;
            let appIsDeleting = false;

            const animateAppSearch = () => {
                const currentPhrase = appPhrases[appPhraseIndex];
                appTarget.textContent = currentPhrase.substring(0, appIsDeleting ? appCharIdx - 1 : appCharIdx + 1);
                appIsDeleting ? appCharIdx-- : appCharIdx++;

                let typeSpeed = appIsDeleting ? 50 : 100;
                if (!appIsDeleting && appCharIdx === currentPhrase.length) {
                    typeSpeed = 1500;
                    if (currentPhrase.includes("GST")) {
                        setTimeout(showAIScreen, 1000);
                        return;
                    }
                    appIsDeleting = true;
                } else if (appIsDeleting && appCharIdx === 0) {
                    appIsDeleting = false;
                    appPhraseIndex = (appPhraseIndex + 1) % appPhrases.length;
                    typeSpeed = 500;
                }
                setTimeout(animateAppSearch, typeSpeed);
            };

            const showAIScreen = () => {
                const homeScreen = document.getElementById('app-home-screen');
                const aiScreen = document.getElementById('app-ai-screen');
                const aiText = document.getElementById('ai-response-text');
                const backBtn = document.getElementById('ai-back');
                if (!homeScreen || !aiScreen) return;

                homeScreen.style.display = 'none';
                aiScreen.style.display = 'flex';
                aiText.textContent = "";

                const responseString = "To file GST in India: \n1. Login to the GST Portal (gst.gov.in).\n2. Navigate to 'Returns Dashboard'.\n3. Select shipping period.\n4. Prepare GSTR-1 & GSTR-3B.\n5. Pay tax and submit.";
                let charIdx = 0;
                let cancelled = false;

                const back = () => {
                    cancelled = true;
                    aiScreen.style.display = 'none';
                    homeScreen.style.display = 'flex';
                    appIsDeleting = true;
                    animateAppSearch();
                    backBtn.removeEventListener('click', back);
                };
                backBtn.addEventListener('click', back);

                const typeAI = () => {
                    if (cancelled) return;
                    if (charIdx < responseString.length) {
                        aiText.textContent += responseString.charAt(charIdx++);
                        setTimeout(typeAI, 25);
                    } else {
                        setTimeout(() => { if (!cancelled) back(); }, 5000);
                    }
                };
                setTimeout(typeAI, 500);
            };

            animateAppSearch();
        },

        // --- Government Schemes ---
        initSchemesAnimation() {
            const wizard = document.getElementById('schemes-wizard');
            if (!wizard) return;
            const loader = document.getElementById('schemes-loader');
            const results = document.getElementById('schemes-results');
            const target = document.getElementById('udyam-typing-target');
            const num = "UDYAM-MH-12-0012345";
            let idx = 0;

            const type = () => {
                if (idx < num.length) {
                    if (idx === 0) target.textContent = "";
                    target.textContent += num.charAt(idx++);
                    setTimeout(type, 100);
                } else {
                    setTimeout(click, 1500);
                }
            };

            const click = () => {
                const btn = wizard.querySelector('button');
                if (btn) btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (btn) btn.style.transform = 'scale(1)';
                    wizard.style.display = 'none';
                    loader.style.display = 'flex';
                    setTimeout(() => {
                        loader.style.display = 'none';
                        results.style.display = 'block';
                        setTimeout(reset, 5000);
                    }, 2000);
                }, 150);
            };

            const reset = () => {
                idx = 0;
                target.textContent = "Enter Udyam Number";
                wizard.style.display = 'block';
                loader.style.display = 'none';
                results.style.display = 'none';
                setTimeout(type, 2000);
            };
            setTimeout(type, 1000);
        },

        initCounters() {
            const counters = document.querySelectorAll('.number');
            const section = document.querySelector('#section-counter');
            if (!section || counters.length === 0) return;

            const animate = () => {
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-number');
                    const duration = 2000;
                    let startTime = null;

                    const step = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        counter.innerText = Math.floor(progress * target);
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    window.requestAnimationFrame(step);
                });
            };

            new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    animate();
                }
            }, { threshold: 0.5 }).observe(section);
        },

        // --- Testimonials ---
        initTestimonialCarousel() {
            const track = document.getElementById('testimonialTrack');
            const pag = document.getElementById('testimonial-pagination');
            if (!track || !pag) return;

            const cards = Array.from(track.querySelectorAll('.testimonial-card'));
            const prev = document.getElementById('testimonialPrev');
            const next = document.getElementById('testimonialNext');
            const count = cards.length;
            let activeIdx = 1;
            let paused = false;
            let dots = [];

            const setActive = (i) => {
                if (i < 0) i = count - 1;
                if (i >= count) i = 0;
                activeIdx = i;

                cards.forEach((c, idx) => c.classList.toggle('is-active', idx === i));
                dots.forEach((d, idx) => d.classList.toggle('active', idx === i));

                const itemWidth = cards[0].offsetWidth + 50; // width + margin
                const offset = (activeIdx * itemWidth) - (track.parentElement.offsetWidth / 2) + (itemWidth / 2);
                track.style.transform = `translateX(${-offset}px)`;
            };

            for (let i = 0; i < count; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                dot.addEventListener('click', () => { setActive(i); resetTimer(); });
                pag.appendChild(dot);
                dots.push(dot);
            }

            if (prev) prev.addEventListener('click', () => { setActive(activeIdx - 1); resetTimer(); });
            if (next) next.addEventListener('click', () => { setActive(activeIdx + 1); resetTimer(); });

            let timer;
            const resetTimer = () => {
                clearInterval(timer);
                timer = setInterval(() => { if (!paused) setActive(activeIdx + 1); }, 6000);
            };

            track.addEventListener('mouseenter', () => paused = true);
            track.addEventListener('mouseleave', () => paused = false);

            let startX = 0;
            track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; paused = true; }, { passive: true });
            track.addEventListener('touchend', e => {
                const endX = e.changedTouches[0].clientX;
                if (startX - endX > 50) setActive(activeIdx + 1);
                else if (endX - startX > 50) setActive(activeIdx - 1);
                setTimeout(() => paused = false, 1000);
                resetTimer();
            }, { passive: true });

            window.addEventListener('resize', () => setActive(activeIdx));
            setActive(activeIdx);
            resetTimer();
        },

        // --- Newsletter ---
        initNewsletterForm() {
            const form = document.getElementById('newsletter-form');
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('newsletter-email').value.trim();
                const status = document.getElementById('newsletter-status');
                const btn = form.querySelector('button');

                if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                    status.textContent = 'Invalid email.';
                    status.className = 'form-status error';
                    return;
                }

                btn.disabled = true;
                const oldText = btn.textContent;
                btn.textContent = '...';

                try {
                    const res = await fetch('/api/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email })
                    });
                    const data = await res.json();
                    status.textContent = data.message;
                    status.className = `form-status ${data.success ? 'success' : 'error'}`;
                    if (data.success) form.reset();
                } catch (e) {
                    status.textContent = 'Network error.';
                    status.className = 'form-status error';
                } finally {
                    btn.disabled = false;
                    btn.textContent = oldText;
                    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
                }
            });
        },

        // --- Reveal ---
        initRevealObserver() {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
            document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
        },

        // --- Parallax & Scroll Effects ---
        initParallax() {
            const hero = document.querySelector('.hero');
            const aboutHeroBg = document.querySelector('.about-hero-bg');
            const scrollBar = document.getElementById('scrollBar');
            const navbar = document.querySelector('.navbar');
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const y = window.scrollY;

                        // Navbar Effect
                        if (navbar) {
                            if (y > 50) navbar.classList.add('scrolled');
                            else navbar.classList.remove('scrolled');
                        }

                        // Hero Parallax
                        if (hero && y < 800) {
                            hero.style.backgroundPositionY = `${y * 0.4}px`;
                            const content = hero.querySelector('.hero-content');
                            if (content) content.style.opacity = Math.max(0, 1 - (y / 600));
                        }

                        // About Page Background Parallax
                        if (aboutHeroBg) aboutHeroBg.style.transform = `translateY(${y * 0.12}px)`;

                        // Progress Bar
                        if (scrollBar) {
                            const h = document.documentElement.scrollHeight - window.innerHeight;
                            scrollBar.style.width = `${(y / h) * 100}%`;
                        }

                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        },

        // --- Live Match Engine Animation ---
        initMatchEngine() {
            const container = document.querySelector('.live-match-card');
            if (!container) return;

            const scenarios = [
                { query: "I need FSSAI license for my bakery.", match: "Legal • FSSAI Expert", outcome: "Consultation Booked • FSSAI Guidance" },
                { query: "How do I file GST for last month?", match: "CA • GST Filing", outcome: "Consultation Booked • GST Filing" },
                { query: "Which schemes am I eligible for?", match: "Govt Scheme Expert", outcome: "Consultation Booked • Subsidy Check" },
                { query: "Register my new Pvt Ltd company.", match: "CS • Company Reg", outcome: "Consultation Booked • Company Reg" }
            ];

            let cycleCount = 0;
            let isAnimating = false;

            const animateCycle = async () => {
                if (isAnimating) return;
                isAnimating = true;

                const scenario = scenarios[cycleCount % scenarios.length];
                cycleCount++;

                // Elements
                const chatBubble = container.querySelector('.chat-bubble');
                const typingText = chatBubble.querySelector('.typing-text');
                const spinner = container.querySelector('.processing-spinner');
                const flowPath = document.getElementById('match-flow-path');
                const flowDot = document.getElementById('flow-dot-1');

                const expertCard = container.querySelector('.expert-profile-card');
                const expertName = expertCard.querySelector('.expert-name');
                const expertSub = expertCard.querySelector('.expert-sub');
                const expertIconDiv = expertCard.querySelector('div:first-child');
                const expertGlow = expertCard.querySelector('.expert-glow-ring');
                const matchBadge = container.querySelector('.match-badge');

                const outcomePill = container.querySelector('.outcome-pill');
                const outcomeText = outcomePill.querySelector('.outcome-text');
                const trustStrip = container.querySelector('.trust-strip');

                // Helper for delays
                const wait = (ms) => new Promise(r => setTimeout(r, ms));

                // Helper for typing
                const typeWriter = async (element, text) => {
                    element.textContent = "";
                    for (let i = 0; i < text.length; i++) {
                        element.textContent += text.charAt(i);
                        await wait(20 + Math.random() * 20);
                    }
                };

                // --- RESET STATE ---
                chatBubble.classList.remove('visible');
                typingText.textContent = "";

                spinner.classList.remove('visible');
                spinner.style.animation = "none";

                flowPath.classList.remove('visible');
                flowDot.classList.remove('visible');
                const dotAnim = flowDot.querySelector('animateMotion');
                if (dotAnim) dotAnim.endElement();

                expertCard.classList.remove('visible', 'matched');
                expertCard.style.opacity = "0.5"; // Dim initial state
                expertCard.style.transform = "scale(0.95)"; // Reset transform
                expertName.textContent = "Searching...";
                expertName.style.opacity = "1";
                expertName.style.color = "#1e293b";
                expertSub.textContent = "Pending";
                expertIconDiv.style.background = "#eff6ff";
                expertIconDiv.innerHTML = '<i class="fas fa-user-tie"></i>';
                if (expertGlow) expertGlow.style.opacity = "0";

                matchBadge.classList.remove('visible');
                outcomePill.classList.remove('visible');
                if (trustStrip) trustStrip.style.opacity = "0"; // Keep explicit for now or add class

                await wait(600);

                // 1. MSME QUERY
                chatBubble.classList.add('visible');

                await wait(200);

                // Typing
                await typeWriter(typingText, scenario.query);

                await wait(400);

                // 2. AI PROCESSING
                spinner.classList.add('visible');
                spinner.style.animation = "spin 2s linear infinite";

                await wait(500);

                // 3. FLOW ANIMATION
                flowPath.classList.add('visible');
                flowDot.classList.add('visible');
                if (dotAnim) dotAnim.beginElement();

                await wait(800);

                // 4. EXPERT MATCH
                matchBadge.classList.add('visible');

                await wait(150);

                expertCard.classList.add('visible');
                // Note: .visible sets opacity:1, scale:1.
                // We'll add .matched shortly for 1.1 scale

                await wait(300);

                // Update Expert Data
                expertName.style.opacity = "0";
                await wait(100);
                expertName.textContent = scenario.match;
                expertName.style.opacity = "1";
                expertName.style.color = "#10b981";
                expertSub.textContent = "Verified Expert";

                expertIconDiv.style.background = "#dcfce7";
                expertIconDiv.innerHTML = '<i class="fas fa-check" style="color: #166534"></i>';

                // Pop effect
                expertCard.classList.add('matched');
                if (expertGlow) expertGlow.style.opacity = "1";

                await wait(400);
                if (trustStrip) trustStrip.classList.add('visible');

                await wait(800);

                // 5. OUTCOME
                outcomeText.textContent = scenario.outcome;
                outcomePill.classList.add('visible');

                await wait(2500); // Hold

                // Loop
                isAnimating = false;
                requestAnimationFrame(animateCycle);
            };

            // Start loop
            setTimeout(animateCycle, 500);
        }
    };

    App.init();
});
