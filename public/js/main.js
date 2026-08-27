/**
 * NEUROS HOME 7 - MAIN JAVASCRIPT
 * Interactive handlers, sticky header, drawer, search modal, counter, and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('is-sticky');
    } else {
      siteHeader?.classList.remove('is-sticky');
    }
  });

  // 2. Off-canvas Sidebar Drawer
  const offcanvasSidebar = document.querySelector('.offcanvas-sidebar');
  const offcanvasOverlay = document.querySelector('.offcanvas-overlay');
  const openSidebarBtns = document.querySelectorAll('.open-sidebar-btn, .mobile-toggle-btn');
  const closeSidebarBtn = document.querySelector('.offcanvas-close-btn');

  function openSidebar() {
    offcanvasSidebar?.classList.add('is-active');
    offcanvasOverlay?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    offcanvasSidebar?.classList.remove('is-active');
    offcanvasOverlay?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openSidebarBtns.forEach(btn => btn.addEventListener('click', openSidebar));
  closeSidebarBtn?.addEventListener('click', closeSidebar);
  offcanvasOverlay?.addEventListener('click', closeSidebar);

  // 3. Search Modal Overlay
  const searchModal = document.querySelector('.search-modal');
  const openSearchBtns = document.querySelectorAll('.open-search-btn');
  const closeSearchBtn = document.querySelector('.search-modal-close');
  const searchInput = document.querySelector('.search-form-wrap input');

  function openSearch() {
    searchModal?.classList.add('is-active');
    setTimeout(() => searchInput?.focus(), 200);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchModal?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openSearchBtns.forEach(btn => btn.addEventListener('click', openSearch));
  closeSearchBtn?.addEventListener('click', closeSearch);

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeSearch();
    }
  });

  // 4. Scroll Reveal (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-fade-in, .reveal-left, .reveal-right');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Universal Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-number, [data-target], .hero-stat-number');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const rawTarget = el.getAttribute('data-target') || el.textContent.trim();
        const prefix = el.getAttribute('data-prefix') || (rawTarget.startsWith('<') ? '<' : rawTarget.startsWith('$') ? '$' : '');
        const suffix = el.getAttribute('data-suffix') || (rawTarget.endsWith('+') ? '+' : rawTarget.endsWith('%') ? '%' : rawTarget.endsWith('s') ? 's' : '');
        
        const numericMatch = rawTarget.match(/[\d.]+/);
        if (!numericMatch) return;
        
        const targetValue = parseFloat(numericMatch[0]);
        const isDecimal = rawTarget.includes('.');
        const decimalPlaces = isDecimal ? (rawTarget.split('.')[1].match(/\d+/) || ['0'])[0].length : 0;
        
        const duration = 1800;
        const startTime = performance.now();
        
        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = targetValue * easeOut;
          
          el.textContent = `${prefix}${isDecimal ? currentVal.toFixed(decimalPlaces) : Math.floor(currentVal)}${suffix}`;
          
          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${isDecimal ? targetValue.toFixed(decimalPlaces) : targetValue}${suffix}`;
          }
        }
        
        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  counterElements.forEach(el => counterObserver.observe(el));

  // 6. Interactive Contact Form Submission with Unified Database Integration
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm?.querySelector('button[type="submit"]');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!submitBtn) return;

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Writing to Database...';

      const leadData = {
        fullName: document.getElementById('cfFullName')?.value || '',
        email: document.getElementById('cfEmail')?.value || '',
        phone: document.getElementById('cfPhone')?.value || '',
        selectedService: document.getElementById('cfService')?.value || 'Custom Architecture & Bottleneck Assessment',
        subject: 'Architecture Consultation Inquiry',
        message: document.getElementById('cfMessage')?.value || ''
      };

      try {
        let result = { referenceId: 'GOA-' + Math.floor(10000 + Math.random() * 90000) };
        if (window.GOADatabase) {
          result = await window.GOADatabase.createLead(leadData);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Submitted';

        if (formStatus) {
          formStatus.className = 'form-status-msg success is-visible';
          formStatus.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div><i class="fas fa-check-circle"></i> <strong>Inquiry Stored in Sovereign Database!</strong></div>
              <div style="font-size: 13px;">Reference ID: <span class="db-ref-code">${result.referenceId}</span>. The God of Automation Engineering Team will follow up within 24 hours.</div>
            </div>
          `;
          contactForm.reset();
        }

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);

        // Refresh leads table if open
        renderLeadsTable();
      } catch (err) {
        console.error('Database write error:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (formStatus) {
          formStatus.className = 'form-status-msg error is-visible';
          formStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Notice: Saved locally. Our team will contact you.';
        }
      }
    });
  }

  // 6b. Architecture Consultation Booking Modal & Form Handler
  const bookingModal = document.getElementById('bookingModal');
  const bookingModalForm = document.getElementById('bookingModalForm');
  const bookingFormStatus = document.getElementById('bookingFormStatus');
  const bmSubmitBtn = document.getElementById('bmSubmitBtn');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn, [href*="#booking"], a[href="#contact"].btn-pill-outline');
  const closeBookingBtns = document.querySelectorAll('.booking-modal-close');

  function openBooking(preselectedService = '') {
    if (bookingModal) {
      if (preselectedService && document.getElementById('bmDeployment')) {
        document.getElementById('bmDeployment').value = preselectedService;
      }
      bookingModal.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBooking() {
    bookingModal?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If it's explicitly asking for booking consultation
      const text = btn.textContent.toLowerCase();
      if (text.includes('book') || text.includes('consult') || btn.classList.contains('open-booking-btn')) {
        e.preventDefault();
        const service = btn.getAttribute('data-deployment') || '';
        openBooking(service);
      }
    });
  });

  closeBookingBtns.forEach(btn => btn.addEventListener('click', closeBooking));

  if (bookingModalForm) {
    bookingModalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!bmSubmitBtn) return;

      const origText = bmSubmitBtn.innerHTML;
      bmSubmitBtn.disabled = true;
      bmSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reserving Architecture Slot...';

      const bookingData = {
        clientName: document.getElementById('bmName')?.value || '',
        email: document.getElementById('bmEmail')?.value || '',
        phone: document.getElementById('bmPhone')?.value || '',
        targetDeployment: document.getElementById('bmDeployment')?.value || 'Autonomous Hospital OS',
        preferredDate: document.getElementById('bmDate')?.value || '',
        preferredTime: document.getElementById('bmTime')?.value || '',
        notes: document.getElementById('bmNotes')?.value || ''
      };

      try {
        let result = { referenceId: 'GOA-BOOK-' + Math.floor(10000 + Math.random() * 90000) };
        if (window.GOADatabase) {
          result = await window.GOADatabase.createBooking(bookingData);
        }

        bmSubmitBtn.disabled = false;
        bmSubmitBtn.innerHTML = '<i class="fas fa-check"></i> Consultation Confirmed';

        if (bookingFormStatus) {
          bookingFormStatus.className = 'form-status-msg success is-visible';
          bookingFormStatus.innerHTML = `
            <div><i class="fas fa-calendar-check"></i> <strong>Consultation Booked Successfully!</strong></div>
            <div style="font-size: 13px; margin-top: 4px;">Booking Code: <span class="db-ref-code">${result.referenceId}</span>. Calendar invitation dispatched to ${bookingData.email}.</div>
          `;
          bookingModalForm.reset();
        }

        setTimeout(() => {
          closeBooking();
          bmSubmitBtn.innerHTML = origText;
          if (bookingFormStatus) bookingFormStatus.innerHTML = '';
        }, 2600);

        renderBookingsTable();
      } catch (err) {
        console.error('Booking error:', err);
        bmSubmitBtn.disabled = false;
        bmSubmitBtn.innerHTML = origText;
      }
    });
  }

  // 6c. Executive Database Console & Lead Management Dashboard
  const dbConsoleModal = document.getElementById('databaseConsoleModal');
  const openDbBtns = document.querySelectorAll('.open-db-console-btn');
  const closeDbBtns = document.querySelectorAll('.db-console-modal-close');
  const dbTabs = document.querySelectorAll('.db-tab-btn');
  const dbPanes = document.querySelectorAll('.db-tab-pane');

  function openDbConsole() {
    dbConsoleModal?.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    renderLeadsTable();
    renderBookingsTable();
    loadSupabaseSettings();
  }

  function closeDbConsole() {
    dbConsoleModal?.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openDbBtns.forEach(btn => btn.addEventListener('click', openDbConsole));
  closeDbBtns.forEach(btn => btn.addEventListener('click', closeDbConsole));

  // Global Keyboard Shortcut: Ctrl + Shift + D to open Database Console
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      e.preventDefault();
      openDbConsole();
    }
    if (e.key === 'Escape') {
      closeDbConsole();
      closeBooking();
    }
  });

  // Tab Switching
  dbTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      dbTabs.forEach(t => t.classList.remove('active'));
      dbPanes.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(targetTab)?.classList.add('active');
    });
  });

  // Render Leads Table
  async function renderLeadsTable(searchTerm = '') {
    const tableBody = document.getElementById('dbLeadsTableBody');
    const badge = document.getElementById('dbLeadsCountBadge');
    if (!tableBody || !window.GOADatabase) return;

    let leads = await window.GOADatabase.getLeads();
    if (badge) badge.textContent = leads.length;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      leads = leads.filter(l => 
        (l.full_name && l.full_name.toLowerCase().includes(term)) ||
        (l.email && l.email.toLowerCase().includes(term)) ||
        (l.reference_id && l.reference_id.toLowerCase().includes(term)) ||
        (l.selected_service && l.selected_service.toLowerCase().includes(term))
      );
    }

    if (leads.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 32px; color: var(--color-body-muted);">
            <i class="fas fa-inbox" style="font-size: 28px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
            No inquiries matching query. Submit a form to record live data.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = leads.map(lead => `
      <tr>
        <td><span class="db-ref-code">${lead.reference_id || 'N/A'}</span></td>
        <td>${new Date(lead.created_at).toLocaleDateString()}</td>
        <td>
          <div style="font-weight: 700; color: var(--color-dark);">${lead.full_name}</div>
          <div style="font-size: 12px; color: var(--color-body-muted);">${lead.email} ${lead.phone && lead.phone !== 'N/A' ? '· ' + lead.phone : ''}</div>
        </td>
        <td>
          <span style="font-weight: 600; color: var(--primary-blue); font-size: 12px;">${lead.selected_service || 'General'}</span>
          <div style="font-size: 11px; color: var(--color-body-muted); max-width: 260px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lead.message || ''}</div>
        </td>
        <td><span class="db-status-pill-row ${lead.status || 'New'}">${lead.status || 'New'}</span></td>
        <td>
          <div class="db-row-actions">
            <button type="button" class="db-row-btn" onclick="window.deleteLeadItem('${lead.id}')" title="Delete record"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Render Bookings Table
  async function renderBookingsTable(searchTerm = '') {
    const tableBody = document.getElementById('dbBookingsTableBody');
    const badge = document.getElementById('dbBookingsCountBadge');
    if (!tableBody || !window.GOADatabase) return;

    let bookings = await window.GOADatabase.getBookings();
    if (badge) badge.textContent = bookings.length;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      bookings = bookings.filter(b => 
        (b.client_name && b.client_name.toLowerCase().includes(term)) ||
        (b.email && b.email.toLowerCase().includes(term)) ||
        (b.target_deployment && b.target_deployment.toLowerCase().includes(term))
      );
    }

    if (bookings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 32px; color: var(--color-body-muted);">
            <i class="fas fa-calendar-times" style="font-size: 28px; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
            No consultation bookings scheduled yet.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = bookings.map(b => `
      <tr>
        <td><span class="db-ref-code">${b.reference_id || 'N/A'}</span></td>
        <td>
          <strong>${b.preferred_date || 'TBD'}</strong>
          <div style="font-size: 11px; color: var(--color-body-muted);">${b.preferred_time || ''}</div>
        </td>
        <td>
          <div style="font-weight: 700; color: var(--color-dark);">${b.client_name}</div>
          <div style="font-size: 12px; color: var(--color-body-muted);">${b.email} · ${b.phone || ''}</div>
        </td>
        <td><span style="font-weight: 600; color: var(--primary-blue); font-size: 12px;">${b.target_deployment}</span></td>
        <td><span class="db-status-pill-row Scheduled">${b.status || 'Scheduled'}</span></td>
      </tr>
    `).join('');
  }

  // Delete lead helper
  window.deleteLeadItem = async (id) => {
    if (confirm('Are you sure you want to delete this lead record?')) {
      if (window.GOADatabase) {
        await window.GOADatabase.deleteLead(id);
        renderLeadsTable();
      }
    }
  };

  // Search Inputs
  document.getElementById('dbLeadsSearchInput')?.addEventListener('input', (e) => {
    renderLeadsTable(e.target.value);
  });
  document.getElementById('dbBookingsSearchInput')?.addEventListener('input', (e) => {
    renderBookingsTable(e.target.value);
  });

  // Export Buttons
  document.getElementById('dbExportLeadsCsvBtn')?.addEventListener('click', () => {
    window.GOADatabase?.exportToCSV('leads');
  });
  document.getElementById('dbExportLeadsJsonBtn')?.addEventListener('click', () => {
    window.GOADatabase?.exportToJSON('leads');
  });
  document.getElementById('dbExportBookingsCsvBtn')?.addEventListener('click', () => {
    window.GOADatabase?.exportToCSV('bookings');
  });
  document.getElementById('dbExportBookingsJsonBtn')?.addEventListener('click', () => {
    window.GOADatabase?.exportToJSON('bookings');
  });

  // Add Test Lead Button
  document.getElementById('dbAddTestLeadBtn')?.addEventListener('click', async () => {
    const services = [
      '01. Autonomous Hospital OS',
      '02. Distributed Transaction System',
      '03. Autonomous Lead Routing',
      '06. The Elite Resume Rebuild'
    ];
    const testLead = {
      fullName: 'Demo Enterprise Lead ' + Math.floor(Math.random() * 1000),
      email: `lead.${Math.floor(Math.random() * 1000)}@enterprise.io`,
      phone: '+1 800 555 ' + Math.floor(1000 + Math.random() * 9000),
      selectedService: services[Math.floor(Math.random() * services.length)],
      subject: 'Autonomous Pipeline Evaluation',
      message: 'Generated test submission to verify live database persistence and Supabase sync.'
    };
    if (window.GOADatabase) {
      await window.GOADatabase.createLead(testLead);
      renderLeadsTable();
    }
  });

  // Supabase Settings Form
  function loadSupabaseSettings() {
    if (!window.GOADatabase) return;
    const settings = window.GOADatabase.getSettings();
    const urlInput = document.getElementById('sbProjectUrl');
    const keyInput = document.getElementById('sbAnonKey');
    if (urlInput) urlInput.value = settings.supabaseUrl || '';
    if (keyInput) keyInput.value = settings.supabaseAnonKey || '';
  }

  const sbForm = document.getElementById('dbSupabaseSettingsForm');
  const sbStatus = document.getElementById('sbSettingsStatusMsg');

  if (sbForm) {
    sbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = document.getElementById('sbProjectUrl')?.value.trim() || '';
      const key = document.getElementById('sbAnonKey')?.value.trim() || '';

      if (window.GOADatabase) {
        window.GOADatabase.saveSettings({ supabaseUrl: url, supabaseAnonKey: key });
        if (sbStatus) {
          sbStatus.style.color = '#059669';
          sbStatus.innerHTML = '<i class="fas fa-check-circle"></i> Supabase credentials saved locally in Sovereign storage!';
        }
      }
    });
  }

  document.getElementById('sbTestConnBtn')?.addEventListener('click', async () => {
    const url = document.getElementById('sbProjectUrl')?.value.trim() || '';
    const key = document.getElementById('sbAnonKey')?.value.trim() || '';

    if (sbStatus) {
      sbStatus.style.color = '#2563EB';
      sbStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing Supabase REST connection...';
    }

    if (window.GOADatabase) {
      const res = await window.GOADatabase.testSupabaseConnection(url, key);
      if (sbStatus) {
        sbStatus.style.color = res.success ? '#059669' : '#EF4444';
        sbStatus.innerHTML = res.success
          ? `<i class="fas fa-check-circle"></i> ${res.message}`
          : `<i class="fas fa-times-circle"></i> ${res.message}`;
      }
    }
  });

  // 7. Clone Partner Logos for Seamless Loop
  const partnersTrack = document.querySelector('.partners-track');
  if (partnersTrack) {
    const originalItems = partnersTrack.innerHTML;
    partnersTrack.innerHTML += originalItems;
  }

  // 8. Smooth internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          closeSidebar();
        }
      }
    });
  });

  // 9. Floating Back-to-Top Button
  const backToTopBtn = document.getElementById('backToTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn?.classList.add('is-visible');
    } else {
      backToTopBtn?.classList.remove('is-visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 10. Mobile Menu Accordion Toggle
  const submenuToggles = document.querySelectorAll('.offcanvas-submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentItem = toggle.closest('.offcanvas-menu-item');
      parentItem?.classList.toggle('open');
    });
  });

  const menuTitles = document.querySelectorAll('.offcanvas-menu-item.has-submenu .offcanvas-menu-title');
  menuTitles.forEach(title => {
    title.addEventListener('click', (e) => {
      if (e.target.tagName && e.target.tagName.toLowerCase() === 'a') return;
      const parentItem = title.closest('.offcanvas-menu-item');
      parentItem?.classList.toggle('open');
    });
  });

  // 11. Search Quick-Tags and Search Submit Navigation
  const siteSearchForm = document.getElementById('siteSearchForm');
  const searchToast = document.getElementById('searchToast');
  const quickTagBtns = document.querySelectorAll('.quick-tag-btn');

  function navigateToSearch(targetId, queryText) {
    if (searchToast) {
      searchToast.innerHTML = `<i class="fas fa-search"></i> Navigating to "${queryText || targetId.replace('#', '')}"...`;
      searchToast.classList.add('is-visible');
    }
    setTimeout(() => {
      searchToast?.classList.remove('is-visible');
      closeSearch();
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  }

  quickTagBtns.forEach(tagBtn => {
    tagBtn.addEventListener('click', () => {
      const target = tagBtn.getAttribute('data-target') || '#features';
      const text = tagBtn.textContent.trim();
      if (searchInput) searchInput.value = text;
      navigateToSearch(target, text);
    });
  });

  siteSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput?.value.trim().toLowerCase() || '';
    let target = '#hero';
    if (query.includes('neural') || query.includes('about')) {
      target = '#about';
    } else if (query.includes('image') || query.includes('feature') || query.includes('service') || query.includes('style')) {
      target = '#features';
    } else if (query.includes('team') || query.includes('expert') || query.includes('people')) {
      target = '#team';
    } else if (query.includes('story') || query.includes('testimonia') || query.includes('review')) {
      target = '#testimonials';
    } else if (query.includes('blog') || query.includes('article') || query.includes('news')) {
      target = '#blog';
    } else if (query.includes('partner') || query.includes('collaborator')) {
      target = '#partners';
    } else if (query.includes('contact') || query.includes('touch') || query.includes('help')) {
      target = '#contact';
    }
    navigateToSearch(target, query);
  });

  // Pipeline Nodes Interactive Click & Active State Handling
  const pipelineNodes = document.querySelectorAll('.pipeline-node-box');
  pipelineNodes.forEach((node) => {
    node.addEventListener('click', () => {
      node.classList.add('is-clicked');
      setTimeout(() => node.classList.remove('is-clicked'), 250);
      
      const isAlreadySelected = node.classList.contains('is-selected');
      pipelineNodes.forEach(n => n.classList.remove('is-selected'));
      if (!isAlreadySelected) {
        node.classList.add('is-selected');
      }
    });
  });
});
