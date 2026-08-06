/**
 * Public profile fetcher — MSME and consultant cards.
 *
 *   bharat2business.com/profile?id={slug}
 *     -> fetch https://{api}/public/msme/{slug}
 *        (falls back to /public/consultant/{slug} on 404 — the URL alone
 *         doesn't say which type a slug belongs to)
 *     -> render filtered profile sections, grouped the same way the mobile
 *        app groups them for the user's public-profile visibility toggles
 *
 * All user-supplied text is set via textContent (never innerHTML) to
 * block XSS. URLs (website, social, whatsapp) are validated against an
 * allowlist of safe schemes before being assigned to href.
 */

(function () {
    'use strict';

    var SLUG_RE = /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/;
    var SAFE_SCHEMES = /^(https?|mailto|tel):/i;

    function $(id) { return document.getElementById(id); }

    function showState(stateId) {
        ['profile-loading', 'profile-not-found', 'profile-error', 'profile-content']
            .forEach(function (id) {
                var el = $(id);
                if (!el) return;
                if (id === stateId) el.classList.remove('hidden');
                else el.classList.add('hidden');
            });
        // CTA bar visible on content + error + not-found (any non-loading state)
        var cta = $('profile-cta-bar');
        if (cta) {
            if (stateId === 'profile-loading') cta.classList.add('hidden');
            else cta.classList.remove('hidden');
        }
    }

    function safeUrl(value) {
        if (!value || typeof value !== 'string') return null;
        try {
            if (!SAFE_SCHEMES.test(value)) return null;
            if (/[\x00-\x1f\x7f]/.test(value)) return null;
            return value.trim();
        } catch (e) { return null; }
    }

    function setText(id, value) {
        var el = $(id);
        if (!el) return;
        el.textContent = value || '';
    }

    function setMeta(elemId, attr, value) {
        var el = $(elemId);
        if (el) el.setAttribute(attr, value);
    }

    function get(obj, path) {
        var parts = path.split('.');
        var cur = obj;
        for (var i = 0; i < parts.length; i++) {
            if (cur === null || cur === undefined) return undefined;
            cur = cur[parts[i]];
        }
        return cur;
    }

    function hasValue(v) {
        if (v === null || v === undefined) return false;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === 'string') return v.trim().length > 0;
        if (typeof v === 'boolean') return v === true; // only render true flags
        return true;
    }

    // ── Card group definitions ──────────────────────────────────────────
    // Mirrors the section grouping the mobile app uses for the user's
    // public-profile visibility toggles (src/utils/profileFieldConfig.ts
    // for MSME, the CARD_FIELDS list in ConsultantPortfolioQRSection.tsx
    // for consultants) — not the backend response's own key names, which
    // group some fields differently (e.g. exporter/importer status live
    // under `financial` in the API but under Business Identity in the app).

    var MSME_CARDS = [
        {
            icon: 'fa-align-left',
            title: 'About',
            body: 'identity.business_description',
        },
        {
            icon: 'fa-building',
            title: 'Business Identity',
            rows: [
                { path: 'identity.sector', label: 'Sector' },
                { path: 'identity.industry', label: 'Industry' },
                { path: 'identity.sub_industry', label: 'Sub-industry' },
                { path: 'identity.business_type', label: 'Business type' },
                { path: 'identity.business_stage', label: 'Business stage' },
                { path: 'identity.ownership_type', label: 'Ownership type' },
                { path: 'identity.years_of_establishment', label: 'Established' },
                { path: 'identity.number_of_employees', label: 'Employees' },
                { path: 'financial.exporter_status', label: 'Exporter status' },
                { path: 'financial.importer_status', label: 'Importer status' },
                { path: 'contact.business_email', label: 'Business email', sensitive: true },
                { path: 'contact.business_phone', label: 'Business phone', sensitive: true },
            ],
        },
        {
            icon: 'fa-share-nodes',
            title: 'Socials',
            rows: [
                { path: 'contact.website', label: 'Website', type: 'link', linkIcon: 'fa-globe' },
                { path: 'social.instagram_handle', label: 'Instagram', type: 'social', linkIcon: 'fa-instagram', brand: true, hrefTemplate: 'https://instagram.com/{handle}' },
                { path: 'social.linkedin_url', label: 'LinkedIn', type: 'link', linkIcon: 'fa-linkedin', brand: true },
                { path: 'social.facebook_url', label: 'Facebook', type: 'link', linkIcon: 'fa-facebook', brand: true },
            ],
        },
        {
            icon: 'fa-location-dot',
            title: 'Location & Operations',
            rows: [
                { path: 'contact.city_state', label: 'City & state', sensitive: true },
                { path: 'identity.operational_regions', label: 'Operational regions', type: 'list' },
            ],
        },
        {
            icon: 'fa-certificate',
            title: 'Certifications',
            rows: [
                { path: 'certifications.gmp_certified', label: 'GMP certified', type: 'flag' },
                { path: 'certifications.haccp_certified', label: 'HACCP certified', type: 'flag' },
                { path: 'certifications.iso_certifications', label: 'ISO certifications', type: 'list' },
                { path: 'certifications.fssai_license_type', label: 'FSSAI license type' },
                { path: 'certifications.fssai_license_number', label: 'FSSAI license no.', type: 'mono' },
                { path: 'certifications.other_certifications', label: 'Other certifications', type: 'list' },
            ],
        },
        {
            icon: 'fa-industry',
            title: 'Capacity & Infrastructure',
            rows: [
                { path: 'capacity.monthly_production_capacity', label: 'Production capacity' },
                { path: 'capacity.automation_level', label: 'Automation level' },
                { path: 'capacity.quality_control_methods', label: 'Quality control' },
                { path: 'capacity.solar_usage', label: 'Solar usage' },
                { path: 'capacity.monthly_warehouse_capacity', label: 'Warehouse capacity' },
                { path: 'capacity.storage_type', label: 'Storage type' },
                { path: 'capacity.cold_storage_available', label: 'Cold storage available', type: 'flag' },
                { path: 'capacity.water_treatment', label: 'Water treatment', type: 'flag' },
                { path: 'capacity.waste_management', label: 'Waste management' },
                { path: 'capacity.sustainability', label: 'Sustainability practices', type: 'list' },
            ],
        },
        {
            icon: 'fa-screwdriver-wrench',
            title: 'Service Details',
            rows: [
                { path: 'service.service_mode', label: 'Service mode' },
                { path: 'service.pricing_model', label: 'Pricing model' },
            ],
        },
        {
            icon: 'fa-wallet',
            title: 'Financial & Credit',
            rows: [
                { path: 'financial.annual_turnover', label: 'Annual turnover' },
                { path: 'financial.credit_requirement', label: 'Credit/loan required' },
                { path: 'financial.pan', label: 'PAN', type: 'mono', sensitive: true },
                { path: 'financial.gstin', label: 'GSTIN', type: 'mono', sensitive: true },
                { path: 'financial.cin', label: 'CIN', type: 'mono', sensitive: true },
                { path: 'financial.udyam_number', label: 'UDYAM', type: 'mono', sensitive: true },
                { path: 'financial.iec_code', label: 'Import Export Code', type: 'mono', sensitive: true },
            ],
        },
    ];

    var CONSULTANT_CARDS = [
        {
            icon: 'fa-align-left',
            title: 'About',
            body: 'professional.bio',
        },
        {
            icon: 'fa-briefcase',
            title: 'Professional',
            rows: [
                { path: 'professional.industries', label: 'Industries', type: 'list' },
                { path: 'professional.expertise', label: 'Areas of expertise', type: 'list' },
                { path: 'professional.years_of_experience', label: 'Years of experience' },
                { path: 'professional.languages', label: 'Languages', type: 'list' },
                { path: 'professional.hourly_rate', label: 'Hourly rate' },
                { path: 'professional.registration_type', label: 'Registration type' },
            ],
        },
        {
            icon: 'fa-address-book',
            title: 'Contact',
            rows: [
                { path: 'contact.city_state', label: 'City & state', sensitive: true },
                { path: 'contact.business_email', label: 'Email', sensitive: true },
                { path: 'social.linkedin_url', label: 'LinkedIn', type: 'link', linkIcon: 'fa-linkedin', brand: true },
                { path: 'social.instagram_handle', label: 'Instagram', type: 'social', linkIcon: 'fa-instagram', brand: true, hrefTemplate: 'https://instagram.com/{handle}' },
                { path: 'social.facebook_url', label: 'Facebook', type: 'link', linkIcon: 'fa-facebook', brand: true },
            ],
        },
    ];

    function heroName(payload, type) {
        if (type === 'consultant') {
            var p = payload.personal || {};
            var full = ((p.first_name || '') + ' ' + (p.last_name || '')).trim();
            return full || 'Consultant profile';
        }
        return get(payload, 'identity.company_name') || 'Business profile';
    }

    function heroLogo(payload, type) {
        var url = get(payload, 'identity.company_logo');
        if (url) return url;
        return get(payload, 'personal.profile_image_url');
    }

    /** Up to 2 letters, e.g. "Acme Foods" -> "AF", "Ravi Kumar" -> "RK". */
    function initialsFor(name) {
        var words = (name || '').trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return '';
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }

    function heroTagline(payload, type) {
        if (type === 'msme') return get(payload, 'identity.tagline');
        return null;
    }

    function heroVerified(payload, type) {
        if (type === 'msme') return !!get(payload, 'financial.udyam_number');
        return !!get(payload, 'credentials.is_verified');
    }

    // ── Row rendering ────────────────────────────────────────────────────

    function formatRowValue(row, value) {
        if (row.type === 'list' && Array.isArray(value)) return value.join(', ');
        return String(value);
    }

    function buildContactItem(iconClass, label, href) {
        var safe = safeUrl(href);
        if (!safe) return null;
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'profile-contact-item';
        a.href = safe;
        if (safe.indexOf('http') === 0) a.target = '_blank';
        a.rel = 'noopener noreferrer';

        var i = document.createElement('i');
        i.className = iconClass;
        var span = document.createElement('span');
        span.className = 'profile-contact-label';
        span.textContent = label;

        a.appendChild(i);
        a.appendChild(span);
        li.appendChild(a);
        return li;
    }

    /**
     * Renders one card config against the payload. Returns the built
     * element, or null if nothing in the card had a value (card is
     * omitted entirely rather than shown empty).
     */
    function renderCard(cardConfig, payload) {
        var section = document.createElement('section');
        section.className = 'profile-card';

        var header = document.createElement('div');
        header.className = 'profile-card-header';
        var iconWrap = document.createElement('span');
        iconWrap.className = 'profile-card-icon';
        var icon = document.createElement('i');
        icon.className = 'fas ' + cardConfig.icon;
        iconWrap.appendChild(icon);
        var h2 = document.createElement('h2');
        h2.className = 'profile-card-title';
        h2.textContent = cardConfig.title;
        header.appendChild(iconWrap);
        header.appendChild(h2);
        section.appendChild(header);

        var wroteAnything = false;

        if (cardConfig.body) {
            var bodyValue = get(payload, cardConfig.body);
            if (hasValue(bodyValue)) {
                var p = document.createElement('p');
                p.className = 'profile-card-body';
                p.textContent = String(bodyValue);
                section.appendChild(p);
                wroteAnything = true;
            }
        }

        if (cardConfig.rows) {
            var flagRows = cardConfig.rows.filter(function (r) { return r.type === 'flag'; });
            var plainRows = cardConfig.rows.filter(function (r) { return r.type !== 'flag' && r.type !== 'link' && r.type !== 'social'; });
            var linkRows = cardConfig.rows.filter(function (r) { return r.type === 'link' || r.type === 'social'; });

            // Boolean flags render as a row of badge pills
            var activeFlags = flagRows.filter(function (r) { return get(payload, r.path) === true; });
            if (activeFlags.length > 0) {
                var badgeWrap = document.createElement('div');
                badgeWrap.className = 'profile-badge-list';
                activeFlags.forEach(function (r) {
                    var badge = document.createElement('span');
                    badge.className = 'profile-badge';
                    var bi = document.createElement('i');
                    bi.className = 'fas fa-check';
                    var bs = document.createElement('span');
                    bs.textContent = r.label;
                    badge.appendChild(bi);
                    badge.appendChild(bs);
                    badgeWrap.appendChild(badge);
                });
                section.appendChild(badgeWrap);
                wroteAnything = true;
            }

            // Plain label/value rows
            var visiblePlain = plainRows.filter(function (r) { return hasValue(get(payload, r.path)); });
            if (visiblePlain.length > 0) {
                var dl = document.createElement('dl');
                dl.className = 'profile-meta';
                visiblePlain.forEach(function (r) {
                    var row = document.createElement('div');
                    row.className = 'profile-meta-row';
                    var dt = document.createElement('dt');
                    dt.textContent = r.label;
                    if (r.sensitive) {
                        var lock = document.createElement('i');
                        lock.className = 'fas fa-shield-halved profile-sensitive-icon';
                        lock.title = 'Shared at the owner’s discretion — may be shown partially masked for privacy';
                        dt.appendChild(lock);
                    }
                    var dd = document.createElement('dd');
                    if (r.type === 'mono') dd.className = 'profile-mono';
                    dd.textContent = formatRowValue(r, get(payload, r.path));
                    row.appendChild(dt);
                    row.appendChild(dd);
                    dl.appendChild(row);
                });
                section.appendChild(dl);
                wroteAnything = true;
            }

            // Link/social rows (website, Instagram, LinkedIn, Facebook)
            // render as icon pills, one platform icon per row.
            var visibleLinks = linkRows.filter(function (r) { return hasValue(get(payload, r.path)); });
            if (visibleLinks.length > 0) {
                var ul = document.createElement('ul');
                ul.className = 'profile-contact-list';
                visibleLinks.forEach(function (r) {
                    var value = get(payload, r.path);
                    var href = r.hrefTemplate
                        ? r.hrefTemplate.replace('{handle}', String(value).trim().replace(/^@/, ''))
                        : value;
                    var iconClass = (r.brand ? 'fa-brands ' : 'fa-solid ') + (r.linkIcon || 'fa-arrow-up-right-from-square');
                    var item = buildContactItem(iconClass, value, href);
                    if (item) ul.appendChild(item);
                });
                if (ul.children.length > 0) {
                    section.appendChild(ul);
                    wroteAnything = true;
                }
            }
        }

        return wroteAnything ? section : null;
    }

    /**
     * Render an MSMEProfile or ConsultantProfile JSON payload into the DOM.
     */
    function render(payload, type) {
        // --- Hero ---
        var name = heroName(payload, type);
        setText('profile-name', name);
        document.title = name + ' | Bharat2Business';
        setMeta('og-title', 'content', name + ' | Bharat2Business');
        setMeta('og-type', 'content', type === 'consultant' ? 'profile' : 'business.business');

        var tagline = heroTagline(payload, type);
        if (tagline) {
            $('profile-tagline').classList.remove('hidden');
            setText('profile-tagline', tagline);
            setMeta('page-description', 'content', tagline);
            setMeta('og-description', 'content', tagline);
        }

        // Uploaded image takes priority; falls back to an initials avatar
        // when the user hasn't set one (or it's not enabled on the public card).
        var logoUrl = safeUrl(heroLogo(payload, type));
        if (logoUrl) {
            $('profile-logo').src = logoUrl;
            $('profile-logo').alt = name;
            $('profile-logo').classList.remove('hidden');
            $('profile-initials').classList.add('hidden');
            setMeta('og-image', 'content', logoUrl);
        } else {
            $('profile-logo').classList.add('hidden');
            $('profile-initials').classList.remove('hidden');
            setText('profile-initials', initialsFor(name));
        }

        var cityState = get(payload, 'contact.city_state');
        if (cityState) {
            $('profile-location').classList.remove('hidden');
            setText('profile-location-text', cityState);
        }

        if (heroVerified(payload, type)) {
            $('profile-verified').classList.remove('hidden');
        }

        // --- Cards ---
        var cardsContainer = $('profile-cards');
        cardsContainer.innerHTML = '';
        var cardConfigs = type === 'consultant' ? CONSULTANT_CARDS : MSME_CARDS;
        cardConfigs.forEach(function (cardConfig) {
            var el = renderCard(cardConfig, payload);
            if (el) cardsContainer.appendChild(el);
        });

        // --- Generated-at footer ---
        if (payload.generated_at) {
            try {
                var d = new Date(payload.generated_at);
                setText('profile-generated-at', d.toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: 'numeric'
                }));
            } catch (e) { /* ignore */ }
        }

        // --- OG URL canonicalize ---
        setMeta('og-url', 'content', window.location.href);

        showState('profile-content');
    }

    function apiBase() {
        var meta = document.querySelector('meta[name="b2b-api-base"]');
        return meta ? meta.getAttribute('content') : '';
    }

    function fetchJson(url) {
        return fetch(url, { headers: { 'Accept': 'application/json' } })
            .then(function (resp) {
                if (resp.status === 404) return null;
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            });
    }

    function fetchProfile(slug) {
        var base = apiBase();
        if (!base) {
            console.error('Missing b2b-api-base meta tag');
            showState('profile-error');
            return;
        }
        base = base.replace(/\/$/, '');

        fetchJson(base + '/public/msme/' + encodeURIComponent(slug))
            .then(function (payload) {
                if (payload) return render(payload, 'msme');
                // Not an MSME slug — try consultant before giving up.
                return fetchJson(base + '/public/consultant/' + encodeURIComponent(slug))
                    .then(function (consultantPayload) {
                        if (consultantPayload) render(consultantPayload, 'consultant');
                        else showState('profile-not-found');
                    });
            })
            .catch(function (err) {
                console.error('Profile fetch failed:', err);
                showState('profile-error');
            });
    }

    function init() {
        var params = new URLSearchParams(window.location.search);
        var slug = (params.get('id') || '').trim().toLowerCase();

        if (!slug || !SLUG_RE.test(slug)) {
            showState('profile-not-found');
            return;
        }

        var retry = $('profile-retry');
        if (retry) {
            retry.addEventListener('click', function () {
                showState('profile-loading');
                fetchProfile(slug);
            });
        }

        showState('profile-loading');
        fetchProfile(slug);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
