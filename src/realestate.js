const properties = window.properties || [];
const localities = window.localities || [];

// --- WEB3FORMS EMAIL INTEGRATION ---
const WEB3FORMS_KEY = '0421d39e-7c4d-49e4-b9a0-24c4e9da44c9';
const RECIPIENT_EMAIL = 'info@redcarpetventures.in';

async function sendLeadEmail(data, subject) {
  const formData = new FormData();
  formData.append('access_key', WEB3FORMS_KEY);
  formData.append('subject', subject);
  formData.append('to', RECIPIENT_EMAIL);
  formData.append('from_name', 'Red Carpet Ventures Website');
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    return json.success === true;
  } catch (err) {
    console.error('Email submission error:', err);
    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // --- MOBILE DROPDOWN TOGGLE HOOK ---
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        dropdownToggle.parentElement.classList.toggle('active-mobile');
      }
    });
  }

  // --- Premium Asset Map & Fallbacks ---
  const assetFallbacks = {
    properties: './assets/images/realestate/brigade_insignia.jpeg',
    'prop-001': './assets/images/realestate/nelmangala_green_plots.jpeg', // Nelamangala Green Plots (Plots)
    'prop-002': './assets/images/realestate/sri_sai_srinavas_enclave.jpeg', // Sri Sai Srinivas Enclave (Plots)
    'prop-003': './assets/images/realestate/brigade_insignia.jpeg', // Brigade Insignia (Apts)
    'prop-004': './assets/images/realestate/birla_trimaya.jpeg', // Birla Trimaya (Apts)
    'prop-005': './assets/images/realestate/exclusive_residential_plot.jpeg', // Exclusive Residential Plot (Plots)
    'prop-006': './assets/images/realestate/blissful_haven_plots.jpeg', // Blissful Haven Plots (Plots)
    'prop-007': './assets/images/realestate/serenity_springs-nandishwara_enclave.jpeg', // Serenity Springs Nandishwara (Plots)
    'prop-008': './assets/images/realestate/seethakempanahalli_serenity.jpeg', // Seethakempanahalli Serenity (Plots)
  };

  // --- HEADER SCROLL ACTION ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- HAMBURGER MENU TOGGLE ---
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.querySelector('header nav');

  // Create and append navigation overlay to body
  const navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);

  const toggleMenu = () => {
    if (!hamburgerBtn || !navMenu) return;
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  };

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });
  }

  navOverlay.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
  });

  // Close hamburger menu when a menu link is clicked
  const navLinks = document.querySelectorAll('header nav ul li a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Do not close mobile menu drawer when tapping dropdown toggle
      if (link.classList.contains('dropdown-toggle')) {
        return;
      }
      if (navMenu && navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // --- PROPERTY RENDER & FILTERS ENGINE ---
  const listingsGrid = document.getElementById('properties-listings-grid');
  const filterButtons = document.querySelectorAll('.filter-tab-btn');
  const searchInput = document.getElementById('input-search-locality');

  let activeFilter = 'all';
  let searchQuery = '';

  const renderProperties = () => {
    if (!listingsGrid) return;
    listingsGrid.innerHTML = '';

    const filtered = properties.filter(prop => {
      const matchesCategory = activeFilter === 'all' || prop.type === activeFilter;
      const matchesSearch = prop.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      listingsGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1/-1; padding: 50px; text-align: center; color: var(--text-secondary);">
          <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--accent-red); margin-bottom: 1.5rem;"></i>
          <h3>No Premium Properties Match Your Filter</h3>
          <p style="margin-top: 10px;">Try searching for other key areas like Whitefield, Sarjapur, Hebbal, Yelahanka, or Devanahalli.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(prop => {
      const card = document.createElement('div');
      card.className = 'glass-panel prop-card';
      card.id = prop.id;

      const propImgPath = assetFallbacks[prop.id] || assetFallbacks.properties;

      // Add Under Construction progress bar if applicable
      let progressHTML = '';
      if (prop.status === "Under Construction" && prop.progress) {
        progressHTML = `
          <div style="margin-top: 10px; margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-secondary); margin-bottom: 3px;">
              <span>Construction Milestones</span>
              <strong>${prop.progress}%</strong>
            </div>
            <div style="height: 6px; background: rgba(17,24,39,0.06); border-radius: 3px; overflow: hidden;">
              <div style="height: 100%; width: ${prop.progress}%; background: linear-gradient(90deg, var(--accent-red), var(--accent-blue)); border-radius: 3px;"></div>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="prop-img-box">
          <img src="${propImgPath}" alt="${prop.title}" class="prop-img">
          <span class="prop-status-tag">${prop.status}</span>
          <span class="prop-apprec-tag">${prop.appreciationPotential} Growth</span>
        </div>
        <div class="prop-body">
          <div class="prop-meta-row">
            <span class="prop-locality">
              <i class="fa-solid fa-location-dot" style="color: var(--accent-red)"></i>
              ${prop.locality}
            </span>
            <span class="logo-badge" style="border-color: rgba(255,255,255,0.05); color: var(--text-muted);">${prop.tag}</span>
          </div>
          <h3 class="prop-title">${prop.title}</h3>
          
          <div class="prop-specs-row">
            <div class="prop-spec-item">
              <i class="fa-solid fa-house-laptop"></i>
              <span>${prop.specs}</span>
            </div>
            <div class="prop-spec-item">
              <i class="fa-solid fa-maximize"></i>
              <span>${prop.area}</span>
            </div>
          </div>

          ${progressHTML}

          <div class="prop-trust-row" style="margin-top: ${prop.status === 'Ready to Move' || prop.status === 'Ready to Construct' ? '1.2rem' : '0.5rem'};">
            <div class="prop-trust-score">
              <i class="fa-solid fa-shield-halved" style="color: var(--accent-blue);"></i>
              <span>TitleGuard™ Score:</span>
            </div>
            <span class="score-badge">${prop.titleGuardScore}/100</span>
          </div>

          <div class="prop-bottom">
            <div>
              <span class="prop-price-label">Guideline Value</span>
              <p class="prop-price">${prop.price}</p>
            </div>
            <button class="btn-premium btn-outline-gold btn-open-modal" style="padding: 10px 18px; font-size: 0.8rem;" data-prop-title="${prop.title}">
              Inquire
            </button>
          </div>
        </div>
      `;
      listingsGrid.appendChild(card);
    });

    // Re-bind modal buttons within dynamically added properties
    bindModalTriggers();
  };

  // Filter click handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderProperties();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProperties();
    });
  }

  // --- LOCALITY HUB DATA RENDER ENGINE ---
  const localityGrid = document.getElementById('locality-data-grid');

  const renderLocalities = () => {
    if (!localityGrid) return;
    localityGrid.innerHTML = '';

    localities.forEach(loc => {
      const card = document.createElement('div');
      card.className = 'glass-panel locality-card';
      card.id = `loc-${loc.name.replace(/\s+/g, '-').toLowerCase()}`;

      card.innerHTML = `
        <div class="locality-card-top">
          <div class="locality-header-row">
            <h3 class="locality-card-title">${loc.name}</h3>
            <span class="locality-card-tag">${loc.highlight}</span>
          </div>
          <p class="locality-card-desc">${loc.description}</p>
        </div>

        <div>
          <div class="locality-stats">
            <div class="locality-stat-item">
              <span class="locality-stat-val">${loc.avgPriceSqft}/sqft</span>
              <span class="locality-stat-label">Avg Registration Rate</span>
            </div>
            <div class="locality-stat-item">
              <span class="locality-stat-val" style="color: var(--accent-emerald);">${loc.growthYoY}</span>
              <span class="locality-stat-label">Annual Capital Gain</span>
            </div>
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <p style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5;">
              <strong style="color: var(--text-primary);">Metro & Transit:</strong> ${loc.itCommute}
            </p>
          </div>

          <div class="locality-card-verdict">
            <strong>RCV Verdict:</strong> ${loc.verdict}
          </div>
        </div>
      `;
      localityGrid.appendChild(card);
    });
  };

  // --- FAQ ACCORDION ENGINE ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon-box i');

    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      
      const isOpen = item.classList.contains('active');
      
      // Close all open items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-content').style.maxHeight = null;
        otherItem.querySelector('.faq-icon-box i').className = 'fa-solid fa-plus';
      });

      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        icon.className = 'fa-solid fa-plus'; // Rotating handled by CSS rotation of icon-box
      }
    });
  });

  // --- MULTI-STEP LEAD CAPTURING WIZARD ---
  const modal = document.getElementById('lead-wizard-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const wizardPanels = document.querySelectorAll('.wizard-panel');
  const indicators = document.querySelectorAll('.indicator-step');
  const optionCards = document.querySelectorAll('.wizard-option-card');
  const finalForm = document.getElementById('wizard-final-form');

  let activeStep = 1;
  let leadData = {
    interest: 'properties',
    locality: 'Devanahalli',
    budget: 'tier-2',
    name: '',
    email: '',
    phone: ''
  };

  const updateWizardStep = (step) => {
    activeStep = step;

    // Toggle panels
    wizardPanels.forEach(panel => {
      panel.classList.remove('active');
      if (parseInt(panel.getAttribute('data-step')) === step) {
        panel.classList.add('active');
      }
    });

    // Toggle indicators
    indicators.forEach(ind => {
      const indStep = parseInt(ind.getAttribute('data-step'));
      ind.classList.remove('active', 'completed');

      if (indStep === step) {
        ind.classList.add('active');
      } else if (indStep < step) {
        ind.classList.add('completed');
        ind.innerHTML = '<i class="fa-solid fa-check" style="font-size:0.7rem;"></i>';
      } else {
        ind.textContent = indStep;
      }
    });
  };

  // Open modal handlers
  const openModal = (prefilledTitle = '') => {
    if (modal) {
      modal.classList.add('active');
      updateWizardStep(1);

      // If modal opened from a specific property listing inquiry
      if (prefilledTitle) {
        const modalTitle = modal.querySelector('#wizard-step-1 .lead-form-title');
        if (modalTitle) {
          modalTitle.textContent = `Inquire about ${prefilledTitle}`;
        }
      } else {
        const modalTitle = modal.querySelector('#wizard-step-1 .lead-form-title');
        if (modalTitle) modalTitle.textContent = "What is your investment goal?";
      }
    }
  };

  const closeModal = () => {
    if (modal) modal.classList.remove('active');
  };

  const bindModalTriggers = () => {
    const btnOpenModals = document.querySelectorAll('.btn-open-modal');
    btnOpenModals.forEach(btn => {
      btn.replaceWith(btn.cloneNode(true)); // Clean listeners to prevent duplication
    });

    // Re-select and bind
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const propTitle = btn.getAttribute('data-prop-title') || '';
        openModal(propTitle);
      });
    });
  };

  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
  }

  // Click inside option cards (wizard selections)
  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.parentNode;
      const stepCards = parent.querySelectorAll('.wizard-option-card');
      stepCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const step = parseInt(parent.getAttribute('data-step'));
      const val = card.getAttribute('data-value');

      if (step === 1) leadData.interest = val;
      if (step === 2) leadData.locality = val;
      if (step === 3) leadData.budget = val;
    });
  });

  // Next / Prev step navigation buttons
  document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      updateWizardStep(activeStep + 1);
    });
  });

  document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      updateWizardStep(activeStep - 1);
    });
  });

  // Submit Step 4 Form
  if (finalForm) {
    finalForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = document.getElementById('wz-name').value.trim();
      const emailVal = document.getElementById('wz-email').value.trim();
      const phoneVal = document.getElementById('wz-phone').value.trim();

      if (!nameVal || !emailVal || !phoneVal) {
        alert('Please fill out all fields to consult your advisor.');
        return;
      }

      leadData.name = nameVal;
      leadData.email = emailVal;
      leadData.phone = phoneVal;

      await sendLeadEmail({
        Name: leadData.name,
        Email: leadData.email,
        Phone: leadData.phone,
        Interest: leadData.interest,
        Locality: leadData.locality,
        Budget: leadData.budget,
        Source: 'Real Estate – Lead Wizard'
      }, `New Lead: ${leadData.name} – ${leadData.interest}`);

      // Show Success step
      updateWizardStep(5);
    });
  }

  // Close success screen button
  const btnCloseSuccess = document.getElementById('wz-close-btn');
  if (btnCloseSuccess) {
    btnCloseSuccess.addEventListener('click', closeModal);
  }

  // --- HERO DIRECT FORM SUBMIT ---
  const heroForm = document.getElementById('realestate-direct-form');
  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('re-hero-name').value.trim();
      const email = document.getElementById('re-hero-email').value.trim();
      const phone = document.getElementById('re-hero-phone').value.trim();
      const type = document.getElementById('re-hero-type').value;

      if (!name || !email || !phone || !type) {
        alert('Please fill out all fields to consult your advisor.');
        return;
      }

      await sendLeadEmail({
        Name: name,
        Email: email,
        Phone: phone,
        'Property Type': type,
        Source: 'Real Estate – Hero Form'
      }, `New Lead: ${name} – ${type}`);

      // Prefill wizard step 4 data and open directly to success panel
      leadData = { name, email, phone, interest: type, locality: 'Sarjapur', budget: 'tier-2' };
      openModal();
      updateWizardStep(5);

      // Reset form
      heroForm.reset();
    });
  }

  // --- FOOTER FORM SUBMIT ---
  const footerForm = document.getElementById('realestate-footer-form');
  if (footerForm) {
    footerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('re-ft-name').value.trim();
      const email = document.getElementById('re-ft-email').value.trim();
      const phone = document.getElementById('re-ft-phone').value.trim();

      if (!name || !email || !phone) {
        alert('Please fill out all fields to consult your advisor.');
        return;
      }

      await sendLeadEmail({
        Name: name,
        Email: email,
        Phone: phone,
        Source: 'Real Estate – Footer Form'
      }, `New Lead: ${name} – Properties`);

      // Open success panel
      leadData = { name, email, phone, interest: 'properties', locality: 'Hebbal', budget: 'tier-2' };
      openModal();
      updateWizardStep(5);

      // Reset form
      footerForm.reset();
    });
  }

  // --- FOOTER NEWSLETTER FORM SUBMIT ---
  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const emailVal = emailInput.value.trim();
      if (!emailVal) return;
      await sendLeadEmail({
        Email: emailVal,
        Source: 'Real Estate – Newsletter Signup'
      }, `Newsletter Signup: ${emailVal}`);
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    });
  }

  // --- SMOOTH SCROLL ROUTER FOR DE-COUPLED ELEMENTS ---
  const inPageLinks = document.querySelectorAll('header nav ul li a');
  inPageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        // Do not scroll for empty hashes or dropdown toggle links
        if (href === '#' || link.classList.contains('dropdown-toggle')) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        
        // Remove active states and set current active
        document.querySelectorAll('header nav ul li').forEach(item => item.classList.remove('active'));
        link.parentNode.classList.add('active');

        const element = document.querySelector(href);
        if (element) {
          const offset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Initialize Rendering & State
  renderProperties();
  renderLocalities();
  bindModalTriggers();
});
