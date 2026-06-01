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
  // --- IN-MEMORY ASSETS ---
  const assetFallbacks = {
    hero: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&auto=format&fit=crop&q=80',
    drone: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop&q=80',
    report: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    escrow: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80'
  };

  // Set Hero background image
  const heroSection = document.getElementById('trust-hero');
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

  // --- INTERACTIVE TECH DASHBOARD TABS ---
  const tabButtons = document.querySelectorAll('.tech-tab-btn');
  const dashboardMedia = document.getElementById('dashboard-media-display');
  const dashboardTitle = document.getElementById('dashboard-detail-title');
  const dashboardDesc = document.getElementById('dashboard-detail-desc');
  const dashboardList = document.getElementById('dashboard-detail-list');

  const dashboardData = {
    drone: {
      title: "Live Drone Survey Audits",
      desc: "Get absolute confirmation of construction speed. We fly autonomous drone runs over our active building sites weekly, providing aerial proof of structural layering.",
      image: assetFallbacks.drone,
      items: [
        "High-definition 4K bird's-eye boundary checking.",
        "Slab structural layout and volume casting analysis.",
        "Gated community boundary walls and transit roads tracking.",
        "Chronological time-lapse tracking of building growth."
      ]
    },
    qa: {
      title: "Digital Quality (QASCON) Reports",
      desc: "Zero room for construction compromises. RCV's physical engineering auditors execute a comprehensive 450+ checkpoint checklist, logging structural properties online weekly.",
      image: assetFallbacks.report,
      items: [
        "Concrete core compression crush lab reports (M25/M30 standards).",
        "Steel reinforcement bar grades and physical thickness logs.",
        "3-stage waterproofing membrane test results (toilets, terraces, tanks).",
        "Plaster vertical alignment and brickwork spacing tolerance logs."
      ]
    },
    funds: {
      title: "SafeEscrow™ Milestone Release",
      desc: "Capital protection at every step. We hold construction milestone capitals inside a secure tri-party bank escrow pool, releasing funds only upon auditor approval.",
      image: assetFallbacks.escrow,
      items: [
        "Complete segregation of capital from developer balance sheets.",
        "Milestone-linked releases mapping exactly 12 structural phases.",
        "Immediate alert signals when construction benchmarks are delayed.",
        "Independent structural validation sheets prior to funds release."
      ]
    }
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-tab');
      const data = dashboardData[category];

      if (data) {
        if (dashboardMedia) dashboardMedia.src = data.image;
        if (dashboardTitle) dashboardTitle.textContent = data.title;
        if (dashboardDesc) dashboardDesc.textContent = data.desc;
        
        if (dashboardList) {
          dashboardList.innerHTML = '';
          data.items.forEach(item => {
            const li = document.createElement('li');
            li.style.fontSize = '0.9rem';
            li.style.color = 'var(--text-secondary)';
            li.style.lineHeight = '1.5';
            li.style.display = 'flex';
            li.style.alignItems = 'flex-start';
            li.style.gap = '10px';
            li.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-top: 3px; font-size:0.85rem;"></i><span>${item}</span>`;
            dashboardList.appendChild(li);
          });
        }
      }
    });
  });

  // --- ANIMATED NUMERICAL TRUST COUNTERS ---
  const counters = document.querySelectorAll('.trust-counter-val');
  
  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      
      let count = 0;
      const speed = 2000 / target; // Max 2 seconds total animation

      const updateCount = () => {
        count += target / 100;
        
        if (count >= target) {
          counter.textContent = isDecimal ? `${target.toFixed(1)}${suffix}` : `${Math.floor(target)}${suffix}`;
        } else {
          counter.textContent = isDecimal ? `${count.toFixed(1)}${suffix}` : `${Math.floor(count)}${suffix}`;
          setTimeout(updateCount, speed);
        }
      };
      
      updateCount();
    });
  };

  // Simple scroll intersection observer to trigger counters
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const targetSection = document.getElementById('metrics-section');
    if (targetSection) observer.observe(targetSection);
  } else {
    // Fallback if observer not supported
    animateCounters();
  }

  // --- FAQ ACCORDION ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentNode;
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('.faq-icon-box i');
      
      const isOpen = parent.classList.contains('active');

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

  const openModal = (interestType = '') => {
    if (modal) {
      modal.classList.add('active');
      updateWizardStep(1);

      if (interestType) {
        leadData.interest = interestType;
        
        optionCards.forEach(c => {
          if (c.parentNode.getAttribute('data-step') === '1') {
            c.classList.remove('selected');
            if (c.getAttribute('data-value') === interestType) {
              c.classList.add('selected');
            }
          }
        });

        const modalTitle = modal.querySelector('#wizard-step-1 .lead-form-title');
        if (modalTitle) {
          modalTitle.textContent = `Consult on Verified ${interestType.toUpperCase()} Assets`;
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
        const interest = btn.getAttribute('data-interest') || '';
        openModal(interest);
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
        Source: 'Trust Center – Lead Wizard'
      }, `New Lead: ${leadData.name} – ${leadData.interest}`);

      updateWizardStep(5);
    });
  }

  const btnCloseSuccess = document.getElementById('wz-close-btn');
  if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeModal);

  // Footer strategy form submission
  const footerForm = document.getElementById('trustcenter-footer-form');
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
        Source: 'Trust Center – Footer Form'
      }, `New Lead: ${name} – TitleGuard`);
      
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
        Source: 'Trust Center – Newsletter Signup'
      }, `Newsletter Signup: ${emailVal}`);
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    });
  }

  bindModalTriggers();
});
