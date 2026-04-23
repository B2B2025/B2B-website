document.addEventListener('DOMContentLoaded', () => {

    const App = {
        async init() {
            // Priority Inits
            this.initExpertForm();
            this.initIndustrySelect();
            this.initMobileMenu();

            // Inject common UI components
            this.injectPartials();

            try {
                this.initDownloadRedirect();
                this.initHeroTyping();
                this.initAppTyping();
                this.initSchemesAnimation();
                this.initExposAnimation();
                this.initCounters();
                this.initTestimonialCarousel();
                this.initNewsletterForm();
                this.initRevealObserver();
                this.initParallax();
                this.initMSMEDemo();
                this.initPersonaSelector();
                this.initJourneyLifecycle();
                this.initMatchEngine();
                this.initExpertTimeline();
                this.initVisionSwitcher();
                // this.initMultilingualTyping(); Removed in favor of integrated demo
            } catch (err) {
                console.error("Initialization error:", err);
            }
        },

        initVisionSwitcher() {
            const prevBtn = document.getElementById('vision-prev');
            const nextBtn = document.getElementById('vision-next');
            const layouts = document.querySelectorAll('.founder-layout');
            if (!prevBtn || !nextBtn || !layouts.length) return;

            let currentIndex = 0;

            const updateDisplay = (index) => {
                layouts.forEach((layout, i) => {
                    layout.classList.remove('active');
                    if (i === index) {
                        setTimeout(() => layout.classList.add('active'), 50);
                    }
                });
            };

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + layouts.length) % layouts.length;
                updateDisplay(currentIndex);
            });

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % layouts.length;
                updateDisplay(currentIndex);
            });
        },

        async injectPartials() {
            const navbarArea = document.getElementById('navbar-placeholder');
            const footerArea = document.getElementById('footer-placeholder');
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';

            if (navbarArea) {
                const isScrolledPage = ['msme.html', 'experts.html', 'about.html', 'contact.html', 'privacy-policy.html', 'terms-msme.html', 'terms-experts.html', 'usage-policy.html'].includes(currentPage);
                const navClass = isScrolledPage ? 'navbar scrolled' : 'navbar';

                navbarArea.innerHTML = `
                    <nav class="${navClass}">
                        <div class="container nav-content">
                            <a href="index.html" class="logo">
                                <i class="fas fa-rocket"></i> Bharat2Business
                            </a>
                            <ul class="nav-links" id="nav-menu">
                                <li><a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
                                <li><a href="msme.html" class="nav-link ${currentPage === 'msme.html' ? 'active' : ''}">For MSMEs</a></li>
                                <li><a href="experts.html" class="nav-link ${currentPage === 'experts.html' ? 'active' : ''}">For Experts</a></li>
                                <li><a href="about.html" class="nav-link ${currentPage === 'about.html' ? 'active' : ''}">About</a></li>
                                <li><a href="contact.html" class="btn-cta ${currentPage === 'contact.html' ? 'active' : ''}">Get Started</a></li>
                            </ul>
                            <button class="nav-toggle" aria-expanded="false" aria-controls="nav-menu">
                                <i class="fas fa-bars"></i>
                            </button>
                        </div>
                    </nav>
                `;
            }

            if (footerArea) {
                footerArea.innerHTML = `
                    <footer>
                        <div class="container">
                            <div class="footer-grid">
                                <div>
                                    <a href="index.html" class="logo footer-logo">
                                        <i class="fas fa-rocket"></i> Bharat2Business
                                    </a>
                                    <p class="footer-desc">Empower.Elevate.Expand.</p>
                                </div>
                                <div class="footer-links">
                                    <h4>Platform</h4>
                                    <ul>
                                        <li><a href="about.html">Our Story</a></li>
                                        <li><a href="contact.html">Contact Us</a></li>
                                    </ul>
                                </div>
                                <div class="footer-links">
                                    <h4>Legal</h4>
                                    <ul>
                                        <li><a href="usage-policy.html">Usage Policy</a></li>
                                        <li><a href="terms-msme.html">Terms of Service: MSME</a></li>
                                        <li><a href="terms-experts.html">Terms of Service: Experts</a></li>
                                        <li><a href="privacy-policy.html">Privacy Policy</a></li>
                                        <li><a href="contact.html">Contact Us</a></li>
                                    </ul>
                                </div>
                                <div class="footer-links">
                                    <h4>Newsletter</h4>
                                    <p class="newsletter-desc">Stay updated with our latest news.</p>
                                    <form class="newsletter-form" id="newsletter-form">
                                        <input type="email" placeholder="Email" class="newsletter-input" id="newsletter-email" aria-label="Email Address" required>
                                        <button type="submit" class="btn-cta newsletter-btn">Join</button>
                                    </form>
                                    <div id="newsletter-status" class="form-status"></div>
                                </div>
                            </div>
                            <div class="footer-bottom">
                                <p>&copy; 2026 Bharat2Business. Built In Bharat. For Bharat.</p>
                            </div>
                        </div>
                    </footer>
                `;
            }
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
            const msmeHeader = document.getElementById("msme-typing-header");
            const expertsHeader = document.getElementById("experts-typing-header");
            if (!typedTextSpan && !msmeHeader && !expertsHeader) return;

            const target = typedTextSpan || msmeHeader || expertsHeader;
            let phrases;

            if (msmeHeader) {
                phrases = ["Running MSME is Hard.", "Compliance is Confusing.", "Schemes are Scattered.", "You Need a Digital Partner."];
            } else if (expertsHeader) {
                phrases = ["No Cold Outreach.", "Get Qualified MSME Leads.", "Earn Transparently.", "Get Paid Instantly."];
            } else {
                phrases = ["Empower", "Elevate", "Expand"];
            }

            let phraseIndex = 0;
            let charIdx = 0;
            let isDeleting = false;

            const type = () => {
                const currentPhrase = phrases[phraseIndex];
                if (isDeleting) {
                    target.textContent = currentPhrase.substring(0, charIdx - 1);
                    charIdx--;
                } else {
                    target.textContent = currentPhrase.substring(0, charIdx + 1);
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
                const aiBubble = document.querySelector('.chat-bubble-ai-app');
                const scroller = document.querySelector('.ai-chat-body-scroller');

                if (!homeScreen || !aiScreen) return;

                homeScreen.style.display = 'none';
                aiScreen.style.display = 'flex';
                aiScreen.style.animation = 'fadeIn 0.3s ease-out';

                // Show thinking state with a more premium look
                aiText.innerHTML = `
                    <div class="ai-thinking-dots">
                        <span></span><span></span><span></span>
                    </div>
                    <span style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">Analyzing GST guidelines...</span>
                `;

                const responseString = "Short Guide to Filing GST:\n\n1. Login to GST Portal (gst.gov.in)\n2. Go to 'Returns Dashboard'\n3. Select Financial Period\n4. File GSTR-1 (Outward Supplies)\n5. File GSTR-3B & Pay Tax";

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

                    if (charIdx === 0) {
                        aiText.textContent = "";
                        aiText.style.color = '#334155';
                    }

                    if (charIdx < responseString.length) {
                        const char = responseString.charAt(charIdx++);
                        aiText.textContent += char;

                        // Scroll to bottom as it types
                        if (scroller) scroller.scrollTop = scroller.scrollHeight;

                        // Varied typing speed for natural feel
                        let nextDelay = 20 + Math.random() * 30;
                        if (char === '\n') nextDelay = 400; // Pause at newlines
                        if (char === '.') nextDelay = 500;  // Pause at sentences

                        setTimeout(typeAI, nextDelay);
                    } else {
                        setTimeout(() => { if (!cancelled) back(); }, 6000);
                    }
                };

                setTimeout(typeAI, 2000); // Wait longer for the thinking dots to feel like AI is working
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

        initExposAnimation() {
            const screen = document.getElementById('expos-screen');
            if (!screen) return;
            const search = document.getElementById('expos-search');
            const results = document.getElementById('expos-results');
            const target = document.getElementById('expo-typing-target');
            const phr = "Expos in Surat...";
            let idx = 0;

            const type = () => {
                if (idx < phr.length) {
                    if (idx === 0) target.textContent = "";
                    target.textContent += phr.charAt(idx++);
                    setTimeout(type, 100);
                } else {
                    setTimeout(showResults, 3000);
                }
            };

            const showResults = () => {
                if (search) search.style.display = 'none';
                if (results) results.style.display = 'block';
                setTimeout(reset, 6000);
            };

            const reset = () => {
                idx = 0;
                if (target) target.textContent = "Searching...";
                if (search) search.style.display = 'flex';
                if (results) results.style.display = 'none';
                setTimeout(type, 1500);
            };

            setTimeout(type, 2000);
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

        // --- Live Match Engine Animation (Expert Matching) ---
        initMatchEngine() {
            const container = document.querySelector('.live-match-card');
            if (!container) return;

            const scenarios = [
                { query: "I need FSSAI license for my bakery.", match: "Meera Iyer", specialty: "Legal • FSSAI Expert" },
                { query: "How do I file GST for last month?", match: "Rajesh Kumar", specialty: "CA • GST Filing" },
                { query: "Which schemes am I eligible for?", match: "Sanjay Shah", specialty: "Govt Scheme Expert" },
                { query: "Register my new Pvt Ltd company.", match: "Anita Desai", specialty: "CS • Company Reg" }
            ];

            const typingText = document.getElementById('demo-query-text');
            const expertName = document.getElementById('expert-name');
            const expertSpecialty = document.getElementById('expert-specialty');
            const dotMotion = document.getElementById('demo-dot-motion');
            const dot = document.getElementById('demo-dot');
            const profileCard = container.querySelector('.match-profile-card');
            const statusBadge = container.querySelector('.match-status-badge');
            const toast = container.querySelector('.match-toast');

            let cycleCount = 0;

            const wait = (ms) => new Promise(r => setTimeout(r, ms));

            const typeWriter = async (element, text) => {
                element.textContent = "";
                for (let i = 0; i < text.length; i++) {
                    element.textContent += text.charAt(i);
                    await wait(30 + Math.random() * 30);
                }
            };

            const runCycle = async () => {
                const s = scenarios[cycleCount % scenarios.length];
                cycleCount++;

                // Reset States
                typingText.textContent = "";
                expertName.textContent = "Searching...";
                expertSpecialty.textContent = "AI Matching";
                profileCard.classList.add('searching');
                statusBadge.style.opacity = "0";
                statusBadge.style.transform = "translateY(10px)";
                toast.style.opacity = "0";
                toast.style.transform = "translateY(10px)";
                dot.style.opacity = "0";

                await wait(1000);

                // 1. MSME Types Query
                await typeWriter(typingText, s.query);
                await wait(600);

                // 2. Flow to AI Brain
                dot.style.opacity = "1";
                if (dotMotion) {
                    const mpath = dotMotion.querySelector('mpath');
                    if (mpath) mpath.setAttribute('href', '#demo-path-1');
                    dotMotion.beginElement();
                }

                await wait(1200);

                // 3. AI Processing (Handled by CSS animations in ai-core)
                await wait(1500);

                // 4. Match Found & Flow to Expert
                if (dotMotion) {
                    const mpath = dotMotion.querySelector('mpath');
                    if (mpath) mpath.setAttribute('href', '#demo-path-2');
                    dotMotion.beginElement();
                }

                await wait(800);

                // 5. Reveal Expert
                profileCard.classList.remove('searching');
                expertName.textContent = s.match;
                expertSpecialty.textContent = s.specialty;
                statusBadge.style.opacity = "1";
                statusBadge.style.transform = "translateY(0)";

                await wait(1500);

                // 6. Show Success Toast
                toast.style.opacity = "1";
                toast.style.transform = "translateY(0)";

                // Hold for user to see
                await wait(5000);

                // Seamlessly restart
                requestAnimationFrame(runCycle);
            };

            runCycle();
        },

        // --- Multilingual Typing Animation (All Chips) ---
        initMultilingualTyping() {
            // Helper function to create independent typing cycles
            const createTyper = (elementId, queries, startDelay) => {
                const target = document.getElementById(elementId);
                if (!target) return;

                let queryIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                let isWaiting = false;

                const type = () => {
                    const currentQuery = queries[queryIndex];

                    if (isWaiting) return;

                    if (isDeleting) {
                        target.textContent = currentQuery.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        target.textContent = currentQuery.substring(0, charIndex + 1);
                        charIndex++;
                    }

                    // Randomize typing speed slightly for realism
                    let typeSpeed = isDeleting ? 30 : (50 + Math.random() * 50);

                    if (!isDeleting && charIndex === currentQuery.length) {
                        // Finished typing, wait before deleting
                        isWaiting = true;
                        // Vary wait time slightly so they don't sync up perfectly
                        const waitTime = 2000 + Math.random() * 1000;
                        setTimeout(() => {
                            isWaiting = false;
                            isDeleting = true;
                            type();
                        }, waitTime);
                        return;
                    } else if (isDeleting && charIndex === 0) {
                        // Finished deleting, move to next
                        isDeleting = false;
                        queryIndex = (queryIndex + 1) % queries.length;
                        typeSpeed = 500;
                    }

                    setTimeout(type, typeSpeed);
                };

                // Initial start delay
                setTimeout(type, startDelay);
            };

            // 1. Schemes Query (English -> Hindi -> Bengali)
            createTyper('multi-query-0', [
                "Which government schemes am I eligible for?",
                "Mere business ko konsi subsidy milegi?",
                "Kono sorkari scheme amar jonno ache?"
            ], 0);

            // 2. Loans Query (English -> Hindi -> Tamil)
            createTyper('multi-query-1', [
                "How do I get business loan approval?",
                "Mujhe business loan kaise milega?",
                "Enakku thozhil kadan kidaikkuma?"
            ], 1500);

            // 3. Compliance Query (English -> Hindi -> Marathi)
            createTyper('multi-query-2', [
                "What compliance is mandatory for my business?",
                "Mere liye kya legal compliance zaroori hai?",
                "Vyavasaay parvaanagi kuthun milvavi?"
            ], 3000);

            // 4. FSSAI/GST Query (English -> Hinglish -> Kannada)
            createTyper('multi-query-3', [
                "Need FSSAI / GST guidance",
                "GST Registration kaise karein?",
                "Food licence apply madodu hege?"
            ], 4500);

            // 5. Experts Query (English -> Malayalam -> Telugu)
            createTyper('multi-query-4', [
                "Find verified CA near me",
                "Njan oru CA-ye anweshikkunnu",
                "Naaku manchi CA kavali"
            ], 6000);
        },

        // --- Premium MSME Ecosystem Animation ---
        initMSMEDemo() {
            const card = document.querySelector('.msme-ecosystem-card');
            if (!card) return;

            const bubbles = card.querySelectorAll('.query-bubble');
            const outputs = card.querySelectorAll('.output-card');
            const particleIn = document.getElementById('particle-in');
            const particleOut = document.getElementById('particle-out');
            const animIn = document.getElementById('anim-particle-in');
            const animOut = document.getElementById('anim-particle-out');
            const mpathIn = animIn.querySelector('mpath');
            const mpathOut = animOut.querySelector('mpath');
            const wait = (ms) => new Promise(r => setTimeout(r, ms));

            const translations = [
                {
                    lang: 'en',
                    inputs: [
                        "Which government schemes am I eligible for?",
                        "How do I get business loan approval?",
                        "What compliance is mandatory for my business?",
                        "Need FSSAI / GST guidance",
                        "Find verified CA near me"
                    ],
                    outputs: [
                        { strong: "Eligible Govt Schemes", span: "PMEGP & CGTMSE Identified" },
                        { strong: "Documentation Checklist", span: "Ready for Submission" },
                        { strong: "Credit Options Matched", span: "₹25L Priority Limit" },
                        { strong: "Verified Expert Connected", span: "Top CA Onboarded" }
                    ]
                },
                {
                    lang: 'hi', // Hindi
                    inputs: [
                        "मेरे बिजनेस के लिए कौन सी सरकारी योजना है?",
                        "मुझे बिजनेस लोन कैसे मिलेगा?",
                        "मेरे बिजनेस के लिए क्या अनुपालन जरूरी है?",
                        "FSSAI और GST रजिस्ट्रेशन चाहिए",
                        "मेरे पास के अच्छे CA को ढूंढें"
                    ],
                    outputs: [
                        { strong: "सरकारी योजनाएं", span: "PMEGP और CGTMSE मिली" },
                        { strong: "दस्तावेज़ों की सूची", span: "जमा करने के लिए तैयार" },
                        { strong: "क्रेडिट विकल्प", span: "₹25L की सीमा" },
                        { strong: "वेरिफाइड एक्सपर्ट", span: "Top CA से संपर्क हुआ" }
                    ]
                },
                {
                    lang: 'mr', // Marathi
                    inputs: [
                        "माझ्या व्यवसायासाठी कोणत्या योजना आहेत?",
                        "व्यवसाय कर्ज कसे मिळवायचे?",
                        "माझ्या व्यवसायासाठी कायदेशीर बाबी कोणत्या?",
                        "मला FSSAI / GST मार्गदर्शन हवे आहे",
                        "जवळचे व्हेरिफाईड CA शोधा"
                    ],
                    outputs: [
                        { strong: "सरकारी योजना", span: "PMEGP आणि CGTMSE ओळखले" },
                        { strong: "कागदपत्रे", span: "सादर करण्यासाठी तयार" },
                        { strong: "कर्ज पर्याय", span: "₹25L पर्यंत मर्यादा" },
                        { strong: "तज्ञ एक्सपर्ट", span: "Top CA सोबत जोडले" }
                    ]
                },
                {
                    lang: 'gu', // Gujarati
                    inputs: [
                        "મારા બિઝનેસ માટે કઈ સરકારી યોજના છે?",
                        "મને બિઝનેસ લોન કેવી રીતે મળે?",
                        "મારા ધંધા માટે કયા કાયદાકીય પાલન જરૂરી છે?",
                        "મને FSSAI / GST માર્ગદર્શન જોઈએ છે",
                        "નજીકના વેરિફાઈડ CA શોધો"
                    ],
                    outputs: [
                        { strong: "સરકારી યોજનાઓ", span: "PMEGP અને CGTMSE મળી" },
                        { strong: "દસ્તાવેજોની યાદી", span: "સબમિશન માટે તૈયાર" },
                        { strong: "ક્રેડિટ વિકલ્પો", span: "₹25L ની મર્યાદા" },
                        { strong: "વેરિફાઈડ એક્સપર્ટ", span: "Top CA સાથે વાત થઈ" }
                    ]
                }
            ];

            let cycleIndex = 0;

            const typeText = async (elementId, text, speed = 30) => {
                const el = document.getElementById(elementId);
                if (!el) return;
                el.textContent = "";
                for (let i = 0; i < text.length; i++) {
                    el.textContent += text.charAt(i);
                    await wait(speed);
                }
            };

            const runCycle = async () => {
                const currentData = translations[cycleIndex % translations.length];
                cycleIndex++;

                // RESET
                bubbles.forEach(b => b.classList.remove('active'));
                outputs.forEach(o => o.classList.remove('active'));
                particleIn.style.opacity = "0";
                particleOut.style.opacity = "0";

                await wait(500);

                // 0. TYPING PHASE: Type all inputs concurrently
                const typingPromises = currentData.inputs.map((text, i) => {
                    return new Promise(async (resolve) => {
                        await wait(i * 150); // Slight stagger
                        await typeText(`multi-query-${i}`, text, 20);
                        resolve();
                    });
                });
                await Promise.all(typingPromises);

                // Update Outputs Text
                currentData.outputs.forEach((data, i) => {
                    if (outputs[i]) {
                        outputs[i].querySelector('strong').textContent = data.strong;
                        outputs[i].querySelector('span').textContent = data.span;
                    }
                });

                await wait(500);

                // 1. INPUT PHASE
                for (let i = 0; i < bubbles.length; i++) {
                    bubbles[i].classList.add('active');
                    mpathIn.setAttribute('href', `#path-in-${i}`);
                    particleIn.style.opacity = "1";
                    animIn.beginElement();
                    await wait(600);
                    particleIn.style.opacity = "0";
                }

                // 2. PROCESSING PHASE
                await wait(1000);

                // 3. OUTPUT PHASE
                for (let i = 0; i < outputs.length; i++) {
                    mpathOut.setAttribute('href', `#path-out-${i}`);
                    particleOut.style.opacity = "1";
                    animOut.beginElement();
                    await wait(300);
                    outputs[i].classList.add('active');
                    await wait(300);
                    particleOut.style.opacity = "0";
                }

                // 4. HOLD PHASE
                await wait(4000);

                // 5. FADE OUT
                bubbles.forEach(b => b.classList.add('fade-out'));
                outputs.forEach(o => o.classList.add('fade-out'));
                await wait(800);
                bubbles.forEach(b => b.classList.remove('fade-out'));
                outputs.forEach(o => o.classList.remove('fade-out'));

                requestAnimationFrame(runCycle);
            };

            runCycle();
        },

        // --- Persona Selector (For MSMEs Page) ---
        initPersonaSelector() {
            const pills = document.querySelectorAll('.persona-pill');
            const contents = document.querySelectorAll('.persona-content');
            const dynamicHeadline = document.getElementById('persona-dynamic-headline');

            if (!pills.length || !contents.length) return;

            const updatePersona = (persona) => {
                let headlineText = "";

                // Update active pill
                pills.forEach(p => {
                    if (p.getAttribute('data-persona') === persona) {
                        p.classList.add('active');
                        headlineText = p.getAttribute('data-headline');
                    } else {
                        p.classList.remove('active');
                    }
                });

                // Update dynamic headline with fade effect
                if (dynamicHeadline && headlineText) {
                    dynamicHeadline.style.opacity = '0';
                    dynamicHeadline.style.transition = 'opacity 0.2s ease-in-out';
                    setTimeout(() => {
                        dynamicHeadline.textContent = headlineText;
                        dynamicHeadline.style.opacity = '1';
                    }, 200);
                }

                // Update content panel
                contents.forEach(content => {
                    if (content.id === `persona-${persona}`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            };

            // Initialize with active state
            const activePill = document.querySelector('.persona-pill.active');
            if (activePill) {
                const initialPersona = activePill.getAttribute('data-persona');
                updatePersona(initialPersona);
            }

            pills.forEach(pill => {
                const persona = pill.getAttribute('data-persona');

                // Handle both click and hover for better responsiveness
                pill.addEventListener('click', () => updatePersona(persona));
                pill.addEventListener('mouseenter', () => updatePersona(persona));
            });
        },

        // --- Journey Lifecycle Animation (Scroll-based) ---
        initJourneyLifecycle() {
            const steps = document.querySelectorAll('.journey-step');
            const progressFill = document.querySelector('.journey-progress-fill');
            const wrapper = document.querySelector('.journey-timeline-wrapper');
            if (!steps.length || !progressFill || !wrapper) return;

            // 1. Observer for individual step activation
            const observerOptions = {
                root: null,
                threshold: 0.6,
                rootMargin: '0px 0px -100px 0px'
            };

            const stepObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            }, observerOptions);

            steps.forEach(step => stepObserver.observe(step));

            // 2. Continuous progress line fill on scroll
            const updateProgressLine = () => {
                const rect = wrapper.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Calculate how much of the wrapper is visible/past the scroll point
                // We want progress to start when the top of the wrapper is at 70% of the screen
                const startPoint = windowHeight * 0.7;
                const totalHeight = rect.height;
                const distance = startPoint - rect.top;

                let progress = (distance / totalHeight) * 100;
                progress = Math.max(0, Math.min(100, progress));

                progressFill.style.height = `${progress}%`;
            };

            window.addEventListener('scroll', updateProgressLine);
            // Initial call
            updateProgressLine();
        },

        // --- Expert Horizontal Timeline ---
        initExpertTimeline() {
            const wrapper = document.querySelector('.timeline-steps');
            const progressMoving = document.querySelector('.timeline-progress-moving');
            if (!wrapper || !progressMoving) return;

            const updateHorizontalProgress = () => {
                const rect = wrapper.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Trigger: Top of timeline enters at 85% of screen
                const startPoint = windowHeight * 0.85;
                const totalRange = 400; // 400px of scroll to fill
                const distance = startPoint - rect.top;

                let progress = (distance / totalRange) * 100;
                progress = Math.max(0, Math.min(100, progress));

                // The line is 70% of the container width in CSS
                progressMoving.style.width = `${progress * 0.7}%`;
            };

            window.addEventListener('scroll', updateHorizontalProgress);
            updateHorizontalProgress();
        },



        // --- Expert Registration Form ---
        initExpertForm() {
            const showBtn = document.getElementById('show-expert-form');
            const heroJoinBtn = document.getElementById('hero-join-btn');
            const preFooterBtn = document.getElementById('pre-footer-join-btn');
            const formSection = document.getElementById('expert-form-section');
            const formContainer = document.getElementById('expert-registration-form');

            console.log("Expert Form Detection:", { showBtn, heroJoinBtn, preFooterBtn, formSection, formContainer });

            if (!formSection || !formContainer) return;

            const form = formContainer.querySelector('form');

            const toggleForm = (e) => {
                if (e) e.preventDefault();
                console.log("Expert Form Toggle Triggered");

                const isOpening = formSection.style.display === 'none' || getComputedStyle(formSection).display === 'none';

                if (isOpening) {
                    formSection.style.display = 'block';
                    if (showBtn) showBtn.innerHTML = 'Close Form <i class="fas fa-times"></i>';

                    setTimeout(() => {
                        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 50);
                } else {
                    formSection.style.display = 'none';
                    if (showBtn) showBtn.innerHTML = 'Register as an Expert <i class="fas fa-arrow-right"></i>';
                }
            };

            if (showBtn) showBtn.addEventListener('click', toggleForm);
            if (heroJoinBtn) heroJoinBtn.addEventListener('click', toggleForm);
            if (preFooterBtn) preFooterBtn.addEventListener('click', toggleForm);

            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const btn = form.querySelector('button[type="submit"]');
                    const originalText = btn.innerHTML;

                    btn.disabled = true;
                    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

                    try {
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        // Success State
                        formContainer.innerHTML = `
                            <div class="success-message" style="text-align: center; padding: 2rem; animation: personaFadeIn 0.6s ease forwards;">
                                <i class="fas fa-check-circle" style="font-size: 4rem; color: #10b981; margin-bottom: 1.5rem;"></i>
                                <h3 style="color: var(--secondary); font-size: 2rem; margin-bottom: 1rem;">Application Submitted!</h3>
                                <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
                                    Thank you for applying to the Bharat2Business Expert Network. 
                                    Our team will review your credentials and get back to you within 48 hours.
                                </p>
                                <button class="btn-cta" style="margin-top: 2rem;" onclick="window.location.reload()">Back to Page</button>
                            </div>
                        `;
                    } catch (error) {
                        console.error("Submission error:", error);
                        btn.disabled = false;
                        btn.innerHTML = originalText;
                        alert("Something went wrong. Please try again.");
                    }
                });
            }
        },

        initIndustrySelect() {
            const header = document.getElementById('industry-select-header');
            const dropdown = document.getElementById('industry-dropdown');
            const selectedText = document.getElementById('selected-industries-text');
            const categoryToggles = document.querySelectorAll('.category-toggle');
            const industryCheckboxes = document.querySelectorAll('.industry-checkbox');

            if (!header || !dropdown) return;

            // Toggle Dropdown
            header.addEventListener('click', (e) => {
                const isActive = header.classList.contains('active');
                if (isActive) {
                    header.classList.remove('active');
                    dropdown.classList.remove('active');
                } else {
                    header.classList.add('active');
                    dropdown.classList.add('active');
                }
            });

            // Close on outside click (excluding dropdown content)
            document.addEventListener('click', (e) => {
                if (!header.contains(e.target) && !dropdown.contains(e.target)) {
                    header.classList.remove('active');
                    dropdown.classList.remove('active');
                }
            });

            const updateCount = () => {
                const checked = document.querySelectorAll('.industry-checkbox:checked');
                if (checked.length === 0) {
                    selectedText.textContent = "Select industries you serve";
                    selectedText.style.color = "#94a3b8";
                } else {
                    selectedText.textContent = `${checked.length} Industries Selected`;
                    selectedText.style.color = "var(--secondary)";
                }
            };

            // Category Toggle (Select All)
            categoryToggles.forEach(toggle => {
                toggle.addEventListener('change', () => {
                    const category = toggle.dataset.category;
                    const isChecked = toggle.checked;
                    const subCheckboxes = document.querySelectorAll(`.industry-checkbox[data-category="${category}"]`);

                    subCheckboxes.forEach(cb => {
                        cb.checked = isChecked;
                    });
                    updateCount();
                });
            });

            // Individual Checkbox Click
            industryCheckboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const category = cb.dataset.category;
                    const catToggle = document.querySelector(`.category-toggle[data-category="${category}"]`);
                    const allInCat = document.querySelectorAll(`.industry-checkbox[data-category="${category}"]`);
                    const checkedInCat = document.querySelectorAll(`.industry-checkbox[data-category="${category}"]:checked`);

                    if (catToggle) {
                        catToggle.checked = allInCat.length === checkedInCat.length;
                    }
                    updateCount();
                });
            });
        }
    };

    App.init();
});
