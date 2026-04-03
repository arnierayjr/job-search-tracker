/**
 * JOB TRACER — Shared mobile navigation & responsive utilities
 * Auto-injects hamburger button + sidebar overlay on all app pages.
 */
document.addEventListener('DOMContentLoaded', function () {
  const sidebar  = document.querySelector('.sidebar');
  const topbar   = document.querySelector('.topbar');
  if (!sidebar || !topbar) return; // auth/onboarding pages have no sidebar

  // ── Overlay ──────────────────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  document.body.appendChild(overlay);

  // ── Hamburger button (prepended into topbar) ──────────────────────────────
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-btn';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.innerHTML =
    '<svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<rect width="18" height="2" rx="1" fill="currentColor"/>' +
    '<rect y="6" width="18" height="2" rx="1" fill="currentColor"/>' +
    '<rect y="12" width="18" height="2" rx="1" fill="currentColor"/>' +
    '</svg>';
  topbar.insertBefore(hamburger, topbar.firstChild);

  // ── Close button inside sidebar ──────────────────────────────────────────
  const closeBtn = document.createElement('button');
  closeBtn.className = 'sidebar-close-btn';
  closeBtn.setAttribute('aria-label', 'Close navigation');
  closeBtn.innerHTML = '✕';
  sidebar.insertBefore(closeBtn, sidebar.firstChild);

  // ── Open / close helpers ─────────────────────────────────────────────────
  function openSidebar() {
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    document.body.classList.add('nav-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  hamburger.addEventListener('click', openSidebar);
  closeBtn.addEventListener('click', closeSidebar);
  overlay.addEventListener('click', closeSidebar);

  // Close drawer when a nav link is tapped on mobile
  sidebar.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function () {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });
});
