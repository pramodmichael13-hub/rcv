const properties = window.properties || [];
const localities = window.localities || [];

// --- WEB3FORMS EMAIL INTEGRATION ---
const WEB3FORMS_KEY = '0421d39e-7c4d-49e4-b9a0-24c4e9da44c9';
const RECIPIENT_EMAIL = 'info@redcarpetventures.in';

/**
 * Sends form data to Web3Forms API which relays it to the recipient email.
 * @param {Object} data - Key-value pairs to include in the email.
 * @param {string} subject - Email subject line.
 * @returns {Promise<boolean>} - True on success.
 */
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

  // --- IN-MEMORY ASSETS INLINE SETUP ---
  // To avoid missing images, we define online premium fallback paths that load instantly,
  // while we prepare the local premium assets.
  const assetFallbacks = {
    properties: '/assets/images/services/properties.jpg',
    build: '/assets/images/services/construction.jpg',
    interiors: '/assets/images/services/interiors.jpg',
    dashboard: '/assets/images/dasboard.jpg',
    showcase: '/assets/images/interior_showcase.png',

    // Property specific images
    'prop-001': '/assets/images/realestate/nelmangala_green_plots.jpeg', // Nelamangala Green Plots (Plots)
    'prop-002': '/assets/images/realestate/sri_sai_srinavas_enclave.jpeg', // Sri Sai Srinivas Enclave (Plots)
    'prop-003': '/assets/images/realestate/brigade_insignia.jpeg', // Brigade Insignia (Apts)
    'prop-004': '/assets/images/realestate/birla_trimaya.jpeg', // Birla Trimaya (Apts)
    'prop-005': '/assets/images/realestate/exclusive_residential_plot.jpeg', // Exclusive Residential Plot (Plots)
    'prop-006': '/assets/images/realestate/blissful_haven_plots.jpeg', // Blissful Haven Plots (Plots)
    'prop-007': '/assets/images/realestate/serenity_springs-nandishwara_enclave.jpeg', // Serenity Springs Nandishwara (Plots)
    'prop-008': '/assets/images/realestate/seethakempanahalli_serenity.jpeg'  // Seethakempanahalli Serenity (Plots)
  };

  // Assign images programmatically
  const heroSection = document.getElementById('hero-section');
  if (heroSection) {
    heroSection.style.backgroundImage = `url('/assets/images/hero.jpg')`;
  }

  // Set Service Category Images
  const srvImgApts = document.getElementById('srv-img-properties');
  if (srvImgApts) srvImgApts.src = assetFallbacks.properties;

  const srvImgBuild = document.getElementById('srv-img-build');
  if (srvImgBuild) srvImgBuild.src = assetFallbacks.build;

  const srvImgInteriors = document.getElementById('srv-img-interiors');
  if (srvImgInteriors) srvImgInteriors.src = assetFallbacks.interiors;

  // Set Tech & Showcase Images
  const techImg = document.getElementById('tech-dashboard-img');
  if (techImg) techImg.src = assetFallbacks.dashboard;

  const showcaseImg = document.getElementById('showcase-main-img');
  if (showcaseImg) showcaseImg.src = assetFallbacks.showcase;

  // --- HEADER SCROLL ACTION ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
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
          <p style="margin-top: 10px;">Try searching for other key areas like Whitefield, Sarjapur, Hebbal, or Devanahalli.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(prop => {
      const card = document.createElement('div');
      card.className = 'glass-panel prop-card';
      card.id = prop.id;

      // Assign custom layout
      const propImgPath = assetFallbacks[prop.id] || assetFallbacks.properties;

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

          <div class="prop-trust-row">
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

  // --- PREMIUM DUAL CALCULATORS ---
  const btnTabBuild = document.getElementById('btn-tab-build');
  const btnTabInvest = document.getElementById('btn-tab-invest');
  const panelBuild = document.getElementById('panel-calc-build');
  const panelInvest = document.getElementById('panel-calc-invest');

  // Tab switching
  if (btnTabBuild && btnTabInvest) {
    btnTabBuild.addEventListener('click', () => {
      btnTabBuild.classList.add('active');
      btnTabInvest.classList.remove('active');
      panelBuild.style.display = 'block';
      panelInvest.style.display = 'none';
    });

    btnTabInvest.addEventListener('click', () => {
      btnTabInvest.classList.add('active');
      btnTabBuild.classList.remove('active');
      panelBuild.style.display = 'none';
      panelInvest.style.display = 'block';
    });
  }

  // Calculator A: Construction Cost Estimator
  const sliderArea = document.getElementById('slider-area');
  const valArea = document.getElementById('val-area');
  const valTierName = document.getElementById('val-tier-name');
  const specButtons = document.querySelectorAll('#panel-calc-build .calc-option-btn');
  const resBuildCost = document.getElementById('res-build-cost');

  let selectedArea = 2400;
  let selectedRate = 2350; // Premium Gold rate default
  let selectedTierLabel = 'Premium Gold';

  const updateBuildCalculation = () => {
    if (valArea) valArea.textContent = selectedArea.toLocaleString('en-IN');
    if (valTierName) valTierName.textContent = selectedTierLabel;

    const cost = selectedArea * selectedRate;
    let costStr = '';

    if (cost >= 10000000) {
      costStr = `₹${(cost / 10000000).toFixed(2)} Crore`;
    } else {
      costStr = `₹${(cost / 100000).toFixed(2)} Lakh`;
    }

    if (resBuildCost) resBuildCost.textContent = costStr;
  };

  if (sliderArea) {
    sliderArea.addEventListener('input', (e) => {
      selectedArea = parseInt(e.target.value);
      updateBuildCalculation();
    });
  }

  specButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      specButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRate = parseInt(btn.getAttribute('data-rate'));
      selectedTierLabel = btn.childNodes[0].textContent.trim();
      updateBuildCalculation();
    });
  });

  // Calculator B: Investment Return Estimator
  const sliderCapital = document.getElementById('slider-capital');
  const valCapital = document.getElementById('val-capital');
  const valLocalityName = document.getElementById('val-locality-name');
  const localityButtons = document.querySelectorAll('#panel-calc-invest .calc-option-btn');
  const resInvestReturn = document.getElementById('res-invest-return');

  let selectedCapitalCr = 2.5;
  let selectedGrowthPct = 12; // Sarjapur default
  let selectedLocalityLabel = 'Sarjapur Road';

  const updateInvestmentCalculation = () => {
    if (valCapital) valCapital.textContent = selectedCapitalCr.toFixed(1);
    if (valLocalityName) valLocalityName.textContent = selectedLocalityLabel;

    // Calculate total values: Capital * Growth Percentage
    const capitalRaw = selectedCapitalCr * 10000000;
    const appreciationLakhs = (capitalRaw * (selectedGrowthPct / 100)) / 100000;

    if (resInvestReturn) {
      resInvestReturn.textContent = `+₹${appreciationLakhs.toFixed(0)} L / Yr`;
    }
  };

  if (sliderCapital) {
    sliderCapital.addEventListener('input', (e) => {
      selectedCapitalCr = parseFloat(e.target.value);
      updateInvestmentCalculation();
    });
  }

  localityButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      localityButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGrowthPct = parseInt(btn.getAttribute('data-growth'));
      selectedLocalityLabel = btn.childNodes[0].textContent.trim();
      updateInvestmentCalculation();
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
      btn.addEventListener('click', () => {
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

      // Send lead data via email
      await sendLeadEmail({
        Name: leadData.name,
        Email: leadData.email,
        Phone: leadData.phone,
        Interest: leadData.interest,
        Locality: leadData.locality,
        Budget: leadData.budget,
        Source: 'Homepage – Lead Wizard'
      }, `New Lead: ${leadData.name} – ${leadData.interest}`);

      // Show Success step regardless of send result (UX stays smooth)
      updateWizardStep(5);
    });
  }

  // Close success screen button
  const btnCloseSuccess = document.getElementById('wz-close-btn');
  if (btnCloseSuccess) {
    btnCloseSuccess.addEventListener('click', closeModal);
  }

  // --- HERO DIRECT FORM SUBMIT ---
  const heroForm = document.getElementById('hero-direct-form');
  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('hero-name').value.trim();
      const email = document.getElementById('hero-email').value.trim();
      const phone = document.getElementById('hero-phone').value.trim();
      const interest = document.getElementById('hero-interest').value;

      if (!name || !email || !phone || !interest) {
        alert('Please fill out all fields to consult your advisor.');
        return;
      }

      // Send lead data via email
      await sendLeadEmail({
        Name: name,
        Email: email,
        Phone: phone,
        Interest: interest,
        Source: 'Homepage – Hero Form'
      }, `New Lead: ${name} – ${interest}`);

      // Prefill wizard step 4 data and open directly to success panel
      leadData = { name, email, phone, interest, locality: 'Sarjapur', budget: 'tier-2' };
      openModal();
      updateWizardStep(5);

      // Reset form
      heroForm.reset();
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
        Source: 'Homepage – Newsletter Signup'
      }, `Newsletter Signup: ${emailVal}`);
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    });
  }

  // --- FLUID APP SUB-VIEWS ROUTER ---
  const navItems = document.querySelectorAll('header nav ul li');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Do not intercept if clicking inside dropdown menu links
      if (e.target.closest('.dropdown-menu')) {
        return;
      }
      const anchor = item.querySelector('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || !href.startsWith('#')) {
        // Let standard page navigation take place
        return;
      }
      // Do not run querySelector on empty hashes or dropdown toggle
      if (href === '#' || anchor.classList.contains('dropdown-toggle')) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      const targetId = href;
      const element = document.querySelector(targetId);
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
    });
  });

  // Services divisions card clicks redirect to dedicated pages
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const targetDiv = card.getAttribute('data-target');
      if (targetDiv === 'properties') {
        window.location.href = '/realestate';
      } else if (targetDiv === 'build') {
        window.location.href = '/construction';
      } else if (targetDiv === 'interiors') {
        window.location.href = '/interiordesign';
      }
    });
  });

  // --- CINEMATIC INTRO VIDEO AUDIO TOGGLE ---
  const introVideo = document.getElementById('intro-video');
  const btnToggleMute = document.getElementById('btn-toggle-mute');
  const muteIcon = document.getElementById('mute-icon');

  if (introVideo && btnToggleMute && muteIcon) {
    btnToggleMute.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Toggle muted status
      introVideo.muted = !introVideo.muted;

      if (introVideo.muted) {
        muteIcon.className = 'fa-solid fa-volume-xmark';
        console.log("Video muted manually.");
      } else {
        introVideo.volume = 1.0;
        muteIcon.className = 'fa-solid fa-volume-high';
        console.log("Video unmuted manually. Volume set to 1.0.");

        // Explicit play call handles browsers pausing videos when unmuted
        introVideo.play().catch(err => {
          console.warn("Unmuted autoplay gesture policy warning:", err);
        });
      }
    });
  }

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

  // Initialize Rendering & Calculators
  renderProperties();
  renderLocalities();
  updateBuildCalculation();
  updateInvestmentCalculation();
  bindModalTriggers();
});
