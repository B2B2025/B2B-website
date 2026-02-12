document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Change icon
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close menu when clicking a link
    const navLinksItems = document.querySelectorAll('.nav-link, .btn-cta');
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    });

    // Smart Download Button Redirection
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Placeholder links
        const playStoreUrl = "https://play.google.com/store/apps/details?id=com.bharat2business.app";
        const appStoreUrl = "https://apps.apple.com/in/app/bharat2business/id123456789";
        const defaultUrl = "contact.html";

        if (/android/i.test(userAgent)) {
            downloadBtn.href = playStoreUrl;
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            downloadBtn.href = appStoreUrl;
        } else {
            downloadBtn.href = defaultUrl;
        }
    }

    // Custom Typing Effect
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    // Mockup App Typing Animation
    const appTarget = document.getElementById('app-typing-target');
    const appPhrases = [
        "How to file GST?",
        "Latest MSME subsidies?",
        "Apply for business loan",
        "Decode export policy"
    ];
    let appPhraseIndex = 0;
    let appCharIdx = 0;
    let appIsDeleting = false;

    function animateAppSearch() {
        if (!appTarget) return;

        const currentPhrase = appPhrases[appPhraseIndex];

        if (appIsDeleting) {
            appTarget.textContent = currentPhrase.substring(0, appCharIdx - 1);
            appCharIdx--;
        } else {
            appTarget.textContent = currentPhrase.substring(0, appCharIdx + 1);
            appCharIdx++;
        }

        let typeSpeed = appIsDeleting ? 50 : 100;

        if (!appIsDeleting && appCharIdx === currentPhrase.length) {
            typeSpeed = 1500; // Pause at end

            // SPECIAL TRIGGER: If it's the GST question, show AI screen
            if (currentPhrase.includes("GST")) {
                setTimeout(showAIScreen, 1000);
                return; // Stop this loop for now
            }

            appIsDeleting = true;
        } else if (appIsDeleting && appCharIdx === 0) {
            appIsDeleting = false;
            appPhraseIndex = (appPhraseIndex + 1) % appPhrases.length;
            typeSpeed = 500;
        }

        setTimeout(animateAppSearch, typeSpeed);
    }

    function showAIScreen() {
        const homeScreen = document.getElementById('app-home-screen');
        const aiScreen = document.getElementById('app-ai-screen');
        const aiText = document.getElementById('ai-response-text');
        const backBtn = document.getElementById('ai-back');

        if (!homeScreen || !aiScreen) return;

        homeScreen.style.display = 'none';
        aiScreen.style.display = 'flex';
        aiText.textContent = "";

        const responseString = "To file GST in India: \n1. Login to the GST Portal (gst.gov.in).\n2. Navigate to 'Returns Dashboard'.\n3. Select the financial year and filing period.\n4. Prepare and file GSTR-1 for outward supplies and GSTR-3B for summary returns.\n5. Make the tax payment if applicable and submit.";
        let charIndex = 0;
        let isResponseCancelled = false;

        const manualBack = () => {
            isResponseCancelled = true;
            aiScreen.style.display = 'none';
            homeScreen.style.display = 'flex';
            appIsDeleting = true;
            animateAppSearch();
            backBtn.removeEventListener('click', manualBack);
        };

        backBtn.addEventListener('click', manualBack);

        function typeAIResponse() {
            if (isResponseCancelled) return;

            if (charIndex < responseString.length) {
                aiText.textContent += responseString.charAt(charIndex);
                charIndex++;
                setTimeout(typeAIResponse, 25);
            } else {
                // Pause and reset auto
                setTimeout(() => {
                    if (!isResponseCancelled) {
                        manualBack();
                    }
                }, 5000);
            }
        }

        setTimeout(typeAIResponse, 500);
    }

    // --- GOVERNMENT SCHEMES ANIMATION ---
    function animateSchemesEligibility() {
        const wizard = document.getElementById('schemes-wizard');
        const loader = document.getElementById('schemes-loader');
        const results = document.getElementById('schemes-results');
        const udyamTarget = document.getElementById('udyam-typing-target');

        if (!wizard || !loader || !results || !udyamTarget) return;

        const udyamNumber = "UDYAM-MH-12-0012345";
        let udyamIndex = 0;

        function typeUdyam() {
            if (udyamIndex < udyamNumber.length) {
                if (udyamIndex === 0) udyamTarget.textContent = "";
                udyamTarget.textContent += udyamNumber.charAt(udyamIndex);
                udyamIndex++;
                setTimeout(typeUdyam, 100);
            } else {
                // Done typing, wait then click
                setTimeout(clickButton, 1500);
            }
        }

        function clickButton() {
            const btn = wizard.querySelector('button');
            if (btn) btn.style.transform = 'scale(0.95)';

            setTimeout(() => {
                if (btn) btn.style.transform = 'scale(1)';
                wizard.style.display = 'none';
                loader.style.display = 'flex';

                setTimeout(() => {
                    loader.style.display = 'none';
                    results.style.display = 'block';

                    setTimeout(resetAndRestart, 5000);
                }, 2000);
            }, 150);
        }

        function resetAndRestart() {
            udyamIndex = 0;
            udyamTarget.textContent = "Enter Udyam Number";
            wizard.style.display = 'block';
            loader.style.display = 'none';
            results.style.display = 'none';
            setTimeout(typeUdyam, 2000);
        }

        setTimeout(typeUdyam, 1000);
    }

    animateSchemesEligibility();
    animateAppSearch();

    const textArray = ["Elevate", "Empower", "Expand"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // Counter Animation
    const counters = document.querySelectorAll('.number');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-number');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for counters
    const counterSection = document.querySelector('#section-counter');
    if (counterSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(counterSection);
            }
        }, { threshold: 0.5 });
        observer.observe(counterSection);
    }

    // --- TESTIMONIAL CAROUSEL (MEETPRISM STYLE) ---
    const track = document.getElementById('testimonialTrack');
    const paginationContainer = document.getElementById('testimonial-pagination');

    if (track && paginationContainer) {
        let cards = Array.from(track.children);
        const originalCount = cards.length;

        // Clone for infinite loop illusion
        // We clone 2 at start and 2 at end to allowing robust centering
        const clonesStart = cards.slice(-2).map(c => { const clone = c.cloneNode(true); clone.classList.add('clone'); return clone; });
        const clonesEnd = cards.slice(0, 2).map(c => { const clone = c.cloneNode(true); clone.classList.add('clone'); return clone; });

        clonesStart.forEach(c => track.insertBefore(c, track.firstChild));
        clonesEnd.forEach(c => track.appendChild(c));

        // Re-query cards to include clones
        let allCards = Array.from(track.children);

        let currentIndex = 2; // Start at first real card (since we added 2 clones at start)
        const cardWidth = 340; // width
        const gap = 40; // margin 20px * 2
        const itemWidth = cardWidth + gap;
        const intervalTime = 20000; // 20 seconds
        let autoSlideInterval;

        // Generate Pagination Dots
        for (let i = 0; i < originalCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i + 2);
                resetTimer();
            });
            paginationContainer.appendChild(dot);
        }

        const dots = Array.from(paginationContainer.children);

        function updateCarousel(transition = true) {
            const itemWidth = 340 + 40; // re-declare or use scope? Scope is fine.
            const centerOffset = -(currentIndex * itemWidth);
            // Center calculation: 50% + itemWidth/2 + offset
            track.style.transform = `translateX(calc(-50% + ${itemWidth / 2}px + ${centerOffset}px))`;

            track.style.transition = transition ? 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';

            // Update Active Classes
            allCards.forEach((c, i) => {
                c.classList.remove('active-center');
                if (i === currentIndex) c.classList.add('active-center');
            });

            // Update Dots
            let realIndex = (currentIndex - 2) % originalCount;
            if (realIndex < 0) realIndex += originalCount;

            dots.forEach(d => d.classList.remove('active'));
            if (dots[realIndex]) dots[realIndex].classList.add('active');
        }

        function nextSlide() {
            currentIndex++;
            updateCarousel(true);

            // Check for loop
            if (currentIndex >= allCards.length - 2) {
                setTimeout(() => {
                    currentIndex = 2; // Jump back to first real card
                    updateCarousel(false);
                }, 800);
            }
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel(true);
        }

        function resetTimer() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, intervalTime);
        }

        // Initialize
        updateCarousel(false);
        resetTimer();
    }
});
