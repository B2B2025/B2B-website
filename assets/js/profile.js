/**
 * Public MSME profile fetcher.
 *
 *   bharat2business.com/profile?id={slug}
 *     -> fetch https://dev.bharat2business.com/api/v1/public/msme/{slug}
 *     -> render filtered profile sections
 *
 * All user-supplied text is set via textContent (never innerHTML) to
 * block XSS.  URLs (website, social, whatsapp) are validated against an
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
            // Reject anything that isn't http(s) / mailto / tel
            if (!SAFE_SCHEMES.test(value)) return null;
            // Reject control chars or whitespace tricks
            if (/[\x00-\x1f\x7f]/.test(value)) return null;
            return value.trim();
        } catch (e) { return null; }
    }

    function setText(id, value) {
        var el = $(id);
        if (!el) return;
        el.textContent = value || '';
    }

    function showRow(rowId, valueId, value) {
        if (!value) return;
        var row = $(rowId);
        if (row) row.classList.remove('hidden');
        setText(valueId, value);
    }

    function setMeta(elemId, attr, value) {
        var el = $(elemId);
        if (el) el.setAttribute(attr, value);
    }

    /**
     * Render an MSMEProfile JSON payload into the DOM.
     */
    function render(payload) {
        var identity   = payload.identity   || {};
        var operations = payload.operations || {};
        var contact    = payload.contact    || {};
        var business   = payload.business   || {};

        // --- Hero ---
        var name = identity.business_name || 'Business profile';
        setText('profile-name', name);
        document.title = name + ' | Bharat2Business';
        setMeta('og-title', 'content', name + ' | Bharat2Business');

        if (identity.tagline) {
            $('profile-tagline').classList.remove('hidden');
            setText('profile-tagline', identity.tagline);
            setMeta('page-description', 'content', identity.tagline);
            setMeta('og-description',   'content', identity.tagline);
        }
        if (identity.logo) {
            var logoUrl = safeUrl(identity.logo);
            if (logoUrl) {
                $('profile-logo-wrap').classList.remove('hidden');
                $('profile-logo').src = logoUrl;
                $('profile-logo').alt = name + ' logo';
                setMeta('og-image', 'content', logoUrl);
            }
        }
        if (contact.city_state) {
            $('profile-location').classList.remove('hidden');
            setText('profile-location-text', contact.city_state);
        }

        // --- About ---
        if (identity.about) {
            $('card-about').classList.remove('hidden');
            setText('profile-about', identity.about);
        }

        // --- Operations ---
        if (operations.industry || operations.products_services) {
            $('card-operations').classList.remove('hidden');
            showRow('row-industry', 'profile-industry', operations.industry);
            showRow('row-products', 'profile-products', operations.products_services);
        }

        // --- Contact ---
        var contactList = $('profile-contact-list');
        var contactItems = [];
        if (contact.phone) {
            contactItems.push({
                icon: 'fa-phone',
                label: contact.phone,
                href: 'tel:' + contact.phone.replace(/\s+/g, '')
            });
        }
        if (contact.email) {
            contactItems.push({
                icon: 'fa-envelope',
                label: contact.email,
                href: 'mailto:' + contact.email
            });
        }
        if (contact.whatsapp) {
            var waNum = contact.whatsapp.replace(/[^0-9+]/g, '');
            contactItems.push({
                icon: 'fa-brands fa-whatsapp',
                label: contact.whatsapp,
                href: 'https://wa.me/' + waNum.replace(/^\+/, '')
            });
        }
        if (contact.website) {
            contactItems.push({
                icon: 'fa-globe',
                label: contact.website,
                href: contact.website
            });
        }
        if (contactItems.length > 0) {
            $('card-contact').classList.remove('hidden');
            contactItems.forEach(function (item) {
                var href = safeUrl(item.href);
                if (!href) return;
                var li  = document.createElement('li');
                var a   = document.createElement('a');
                a.className = 'profile-contact-item';
                a.href = href;
                if (href.indexOf('http') === 0) a.target = '_blank';
                a.rel = 'noopener noreferrer';

                var icon = document.createElement('i');
                icon.className = 'fas ' + item.icon;
                var span = document.createElement('span');
                span.className = 'profile-contact-label';
                span.textContent = item.label;

                a.appendChild(icon);
                a.appendChild(span);
                li.appendChild(a);
                contactList.appendChild(li);
            });
        }

        // --- Business ---
        if (business.certifications || business.gst || business.udyam) {
            $('card-business').classList.remove('hidden');
            showRow('row-certifications', 'profile-certifications', business.certifications);
            showRow('row-gst',   'profile-gst',   business.gst);
            showRow('row-udyam', 'profile-udyam', business.udyam);
        }

        // --- Verified badge (only if backend says profile is live + UDYAM exists) ---
        if (business.udyam) {
            $('profile-verified').classList.remove('hidden');
        }

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

    function fetchProfile(slug) {
        var apiBaseMeta = document.querySelector('meta[name="b2b-api-base"]');
        var apiBase = apiBaseMeta ? apiBaseMeta.getAttribute('content') : '';
        if (!apiBase) {
            console.error('Missing b2b-api-base meta tag');
            showState('profile-error');
            return;
        }
        var url = apiBase.replace(/\/$/, '') + '/public/msme/' + encodeURIComponent(slug);

        fetch(url, { headers: { 'Accept': 'application/json' } })
            .then(function (resp) {
                if (resp.status === 404) {
                    showState('profile-not-found');
                    return null;
                }
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .then(function (payload) {
                if (payload) render(payload);
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

        // Retry button wiring
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
