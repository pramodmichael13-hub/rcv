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
  const localities = window.localities || [];

  // Premium fallback images online
  const assetFallbacks = {
    hero: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80',
    map: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80'
  };

  // Assign background image to hero
  const heroSection = document.getElementById('locality-hero');
  if (heroSection) {
    heroSection.style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 50%, rgba(255, 255, 255, 0.95) 100%), url('${assetFallbacks.hero}')`;
  }

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
      toggleMenu();
    });
  }

  navOverlay.addEventListener('click', toggleMenu);

  // --- RENDER DYNAMIC LOCALITY CARDS & SEARCH ---
  const grid = document.getElementById('locality-interactive-grid');
  const searchInput = document.getElementById('search-locality-input');
  const filterTabs = document.querySelectorAll('.locality-filter-tab');

  let activeZone = 'all';
  let searchQuery = '';

  const renderLocalityCards = () => {
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = localities.filter(loc => {
      const nameMatch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        loc.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      let zoneMatch = true;
      if (activeZone === 'north') {
        zoneMatch = loc.name === 'Devanahalli' || loc.name === 'Hebbal' || loc.name === 'Jakkur';
      } else if (activeZone === 'east') {
        zoneMatch = loc.name === 'Whitefield' || loc.name === 'Sarjapur Road';
      } else if (activeZone === 'south') {
        zoneMatch = loc.name === 'HSR Layout' || loc.name === 'Electronic City' || loc.name === 'Koramangala';
      } else if (activeZone === 'central') {
        zoneMatch = loc.name === 'Indiranagar';
      }

      return nameMatch && zoneMatch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="glass-panel" style="grid-column: 1/-1; padding: 60px; text-align: center; color: var(--text-secondary);">
          <i class="fa-solid fa-map-location-dot" style="font-size: 3.5rem; color: var(--accent-red); margin-bottom: 1.5rem;"></i>
          <h3>No Locality Matches Your Search</h3>
          <p style="margin-top: 10px;">Try searching for areas like Whitefield, Hebbal, Koramangala or Sarjapur.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(loc => {
      const card = document.createElement('div');
      card.className = 'glass-panel locality-premium-card';
      
      card.innerHTML = `
        <div class="locality-premium-img-box">
          <img src="${loc.image}" alt="${loc.name}" class="locality-premium-img">
          <span class="locality-premium-tag">${loc.highlight}</span>
          <div class="locality-score-badge">
            <i class="fa-solid fa-star"></i>
            <span>${loc.investmentScore} Invest Score</span>
          </div>
        </div>
        <div class="locality-premium-body">
          <h3 class="locality-premium-title">${loc.name}</h3>
          <p class="locality-premium-desc">${loc.description}</p>
          
          <div class="locality-premium-metrics">
            <div class="locality-metric-item">
              <span class="locality-metric-val">${loc.avgPriceSqft}</span>
              <span class="locality-metric-label">Avg Price/sqft</span>
            </div>
            <div class="locality-metric-item">
              <span class="locality-metric-val" style="color: var(--accent-emerald);">${loc.growthYoY}</span>
              <span class="locality-metric-label">YoY Capital Gain</span>
            </div>
            <div class="locality-metric-item">
              <span class="locality-metric-val">${loc.rentalYield}</span>
              <span class="locality-metric-label">Rental Yield</span>
            </div>
          </div>

          <div class="locality-details-list">
            <p><i class="fa-solid fa-train-subway"></i> <strong>Metro & Transit:</strong> ${loc.metroAccess}</p>
            <p><i class="fa-solid fa-briefcase"></i> <strong>Employment:</strong> ${loc.itCommute}</p>
            <p><i class="fa-solid fa-building-circle-check"></i> <strong>Legals:</strong> ${loc.regulatoryStatus}</p>
          </div>

          <div class="locality-premium-verdict">
            <strong>RCV Curation:</strong> ${loc.verdict}
          </div>

          <button class="btn-premium btn-gold btn-open-modal" style="width: 100%; margin-top: 1.5rem;" data-locality="${loc.name}">
            Consult Advisor & Listings
            <i class="fa-solid fa-arrow-right btn-arrow"></i>
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    bindModalTriggers();
  };

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderLocalityCards();
    });
  }

  // Zone tabs filter events
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeZone = tab.getAttribute('data-zone');
      renderLocalityCards();
    });
  });

  // --- DYNAMIC COMPARISON DASHBOARD ---
  const compSelect1 = document.getElementById('comp-select-1');
  const compSelect2 = document.getElementById('comp-select-2');

  const compTitle1 = document.getElementById('comp-name-1');
  const compTitle2 = document.getElementById('comp-name-2');
  const compTag1 = document.getElementById('comp-tag-1');
  const compTag2 = document.getElementById('comp-tag-2');
  
  const compPrice1 = document.getElementById('comp-val-price-1');
  const compPrice2 = document.getElementById('comp-val-price-2');
  const compGrowth1 = document.getElementById('comp-val-growth-1');
  const compGrowth2 = document.getElementById('comp-val-growth-2');
  const compYield1 = document.getElementById('comp-val-yield-1');
  const compYield2 = document.getElementById('comp-val-yield-2');
  
  const progressInfra1 = document.getElementById('progress-infra-1');
  const progressInfra2 = document.getElementById('progress-infra-2');
  const progressLife1 = document.getElementById('progress-lifestyle-1');
  const progressLife2 = document.getElementById('progress-lifestyle-2');

  const populateDropdowns = () => {
    if (!compSelect1 || !compSelect2) return;
    compSelect1.innerHTML = '';
    compSelect2.innerHTML = '';

    localities.forEach((loc, idx) => {
      const opt1 = document.createElement('option');
      opt1.value = loc.name;
      opt1.textContent = loc.name;
      if (idx === 0) opt1.selected = true; // default select Devanahalli
      compSelect1.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = loc.name;
      opt2.textContent = loc.name;
      if (idx === 1) opt2.selected = true; // default select Sarjapur Road
      compSelect2.appendChild(opt2);
    });
  };

  const updateComparison = () => {
    if (!compSelect1 || !compSelect2) return;

    const loc1 = localities.find(l => l.name === compSelect1.value) || localities[0];
    const loc2 = localities.find(l => l.name === compSelect2.value) || localities[1];

    // Populate Side 1
    if (compTitle1) compTitle1.textContent = loc1.name;
    if (compTag1) compTag1.textContent = loc1.highlight;
    if (compPrice1) compPrice1.textContent = loc1.avgPriceSqft;
    if (compGrowth1) compGrowth1.textContent = loc1.growthYoY;
    if (compYield1) compYield1.textContent = loc1.rentalYield;
    if (progressInfra1) {
      const score = parseFloat(loc1.infrastructureRating) * 10;
      progressInfra1.style.width = `${score}%`;
      progressInfra1.parentNode.previousElementSibling.lastElementChild.textContent = `${loc1.infrastructureRating}/10`;
    }
    if (progressLife1) {
      const score = parseFloat(loc1.lifestyleRating) * 10;
      progressLife1.style.width = `${score}%`;
      progressLife1.parentNode.previousElementSibling.lastElementChild.textContent = `${loc1.lifestyleRating}/10`;
    }

    // Populate Side 2
    if (compTitle2) compTitle2.textContent = loc2.name;
    if (compTag2) compTag2.textContent = loc2.highlight;
    if (compPrice2) compPrice2.textContent = loc2.avgPriceSqft;
    if (compGrowth2) compGrowth2.textContent = loc2.growthYoY;
    if (compYield2) compYield2.textContent = loc2.rentalYield;
    if (progressInfra2) {
      const score = parseFloat(loc2.infrastructureRating) * 10;
      progressInfra2.style.width = `${score}%`;
      progressInfra2.parentNode.previousElementSibling.lastElementChild.textContent = `${loc2.infrastructureRating}/10`;
    }
    if (progressLife2) {
      const score = parseFloat(loc2.lifestyleRating) * 10;
      progressLife2.style.width = `${score}%`;
      progressLife2.parentNode.previousElementSibling.lastElementChild.textContent = `${loc2.lifestyleRating}/10`;
    }
  };

  if (compSelect1) compSelect1.addEventListener('change', updateComparison);
  if (compSelect2) compSelect2.addEventListener('change', updateComparison);

  // --- INTERACTIVE MAP HIGHLIGHTS ---
  const mapHotspots = document.querySelectorAll('.map-hotspot');
  const mapInfoPanel = document.getElementById('map-corridor-info');

  const corridorData = {
    north: {
      title: "North Bangalore Growth Corridor",
      highlight: "Airport & Aerospace SEZ Hub",
      description: "Centered along NH44 and Kempegowda International Airport. Backed by the massive 3,000-acre KIADB Aerospace SEZ, Devanahalli Business Park, and the upcoming Blue Line Metro route. Features premium gated plots and high-value designer villa communities.",
      localities: "Hebbal, Devanahalli, Jakkur, Hennur",
      metric: "18% - 22% average annual appreciation"
    },
    east: {
      title: "East Bangalore IT Corridor",
      highlight: "Established Technology Core",
      description: "Encompasses Whitefield and Sarjapur Road micro-markets. Supported by immediate access to ITPL, RMZ Ecospace, and major technology corporate campus arrays. Complete Metro connection (Purple Line active, Outer Ring Road under construction). Dominates premium apartment absorption.",
      localities: "Whitefield, Sarjapur Road, Varthur, ORR Belt",
      metric: "12% - 15% stable annual appreciation"
    },
    south: {
      title: "South Bangalore Commercial Belt",
      highlight: "Legacy Avenues & Startup Hubs",
      description: "Including HSR Layout, Koramangala, and Electronic City. High startup density, mature civic tree-lined layout planning, and extreme luxury prestige demand. Yellow Metro Line nearing completion. Perfect for premium builder floors, NRI villa acquisitions, and high corporate rental yields.",
      localities: "HSR Layout, Koramangala, Electronic City, Jayanagar",
      metric: "9% - 14% high-yield annual return"
    }
  };

  mapHotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      mapHotspots.forEach(s => s.classList.remove('active'));
      spot.classList.add('active');
      const corridor = spot.getAttribute('data-corridor');
      const data = corridorData[corridor];

      if (mapInfoPanel && data) {
        mapInfoPanel.innerHTML = `
          <h4 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">${data.title}</h4>
          <span style="font-family: var(--font-heading); font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-red); background: rgba(220, 38, 38, 0.04); border: 1px solid rgba(220, 38, 38, 0.15); padding: 2px 8px; border-radius: 4px; display: inline-block; margin-bottom: 1.25rem;">${data.highlight}</span>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${data.description}</p>
          
          <div style="border-top: 1px solid rgba(17,24,39,0.06); padding-top: 1.2rem; display: grid; grid-template-columns: 1fr; gap: 10px;">
            <p style="font-size: 0.85rem; color: var(--text-secondary);"><strong style="color: var(--text-primary);">Key Localities:</strong> ${data.localities}</p>
            <p style="font-size: 0.85rem; color: var(--accent-emerald);"><i class="fa-solid fa-chart-line"></i> <strong style="color: var(--text-primary);">Growth Profile:</strong> ${data.metric}</p>
          </div>
        `;
      }
    });
  });

  // --- FAQ ACCORDION ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentNode;
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('.faq-icon-box i');
      
      const isOpen = parent.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-content').style.maxHeight = null;
        item.querySelector('.faq-icon-box i').className = 'fa-solid fa-plus';
      });

      if (!isOpen) {
        parent.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.className = 'fa-solid fa-minus';
      }
    });
  });

  // --- MULTI-STEP WIZARD MODAL ---
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

    wizardPanels.forEach(panel => {
      panel.classList.remove('active');
      if (parseInt(panel.getAttribute('data-step')) === step) {
        panel.classList.add('active');
      }
    });

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

  const openModal = (prefilledLocality = '') => {
    if (modal) {
      modal.classList.add('active');
      updateWizardStep(1);

      if (prefilledLocality) {
        leadData.locality = prefilledLocality;
        
        // Highlight prefilled locality in wizard step 2
        optionCards.forEach(c => {
          if (c.parentNode.getAttribute('data-step') === '2') {
            c.classList.remove('selected');
            if (c.getAttribute('data-value').toLowerCase() === prefilledLocality.toLowerCase()) {
              c.classList.add('selected');
            }
          }
        });

        const modalTitle = modal.querySelector('#wizard-step-1 .lead-form-title');
        if (modalTitle) {
          modalTitle.textContent = `Consult on ${prefilledLocality} Investment`;
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
    document.querySelectorAll('.btn-open-modal').forEach(btn => {
      btn.addEventListener('click', () => {
        const localityName = btn.getAttribute('data-locality') || '';
        openModal(localityName);
      });
    });
  };

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

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
        Source: 'Locality Hub – Lead Wizard'
      }, `New Lead: ${leadData.name} – ${leadData.locality}`);

      updateWizardStep(5);
    });
  }

  const btnCloseSuccess = document.getElementById('wz-close-btn');
  if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeModal);

  // Footer strategy form submission
  const footerForm = document.getElementById('locality-footer-form');
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
        Source: 'Locality Hub – Footer Form'
      }, `New Lead: ${name} – Localities`);
      
      leadData = { name, email, phone, interest: 'properties', locality: 'Devanahalli', budget: 'tier-2' };
      openModal();
      updateWizardStep(5);
      footerForm.reset();
    });
  }

  // Footer newsletter submission
  const newsletterForm = document.getElementById('footer-newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const emailVal = emailInput.value.trim();
      if (!emailVal) return;
      await sendLeadEmail({
        Email: emailVal,
        Source: 'Locality Hub – Newsletter Signup'
      }, `Newsletter Signup: ${emailVal}`);
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    });
  }

  // Init actions
  renderLocalityCards();
  populateDropdowns();
  updateComparison();
  bindModalTriggers();
});
