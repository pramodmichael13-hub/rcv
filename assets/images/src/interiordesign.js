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
        icon.className = 'fa-solid fa-plus'; // Rotating rotation handled by CSS rules
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
    interest: 'interiors', // Default to interiors for this service page
    locality: 'North-Bangalore', // Default to North-Bangalore since it includes Hebbal/Jakkur luxury sectors
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

      // Pre-select interiors in wizard step 1 since we are on Luxury Interiors page
      const optInteriors = document.getElementById('opt-interiors');
      if (optInteriors) {
        optionCards.forEach(c => c.classList.remove('selected'));
        optInteriors.classList.add('selected');
        leadData.interest = 'interiors';
      }

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
      btn.replaceWith(btn.cloneNode(true));
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
        Source: 'Interior Design – Lead Wizard'
      }, `New Lead: ${leadData.name} – Interiors`);

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
  const heroForm = document.getElementById('interiors-direct-form');
  if (heroForm) {
    heroForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('int-hero-name').value.trim();
      const email = document.getElementById('int-hero-email').value.trim();
      const phone = document.getElementById('int-hero-phone').value.trim();
      const space = document.getElementById('int-hero-space').value;

      if (!name || !email || !phone || !space) {
        alert('Please fill out all fields to consult your advisor.');
        return;
      }

      await sendLeadEmail({
        Name: name,
        Email: email,
        Phone: phone,
        'Space Type': space,
        Source: 'Interior Design – Hero Form'
      }, `New Lead: ${name} – Interiors (${space})`);

      // Open success wizard and prefill profiles
      leadData = { name, email, phone, interest: 'interiors', locality: 'North-Bangalore', budget: 'tier-2' };
      openModal();
      updateWizardStep(5);

      heroForm.reset();
    });
  }

  // --- FOOTER FORM SUBMIT ---
  const footerForm = document.getElementById('interiors-footer-form');
  if (footerForm) {
    footerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // The footer form in interiordesign.html has inputs with IDs: re-ft-name, re-ft-email, re-ft-phone
      const name = footerForm.querySelector('#re-ft-name').value.trim();
      const email = footerForm.querySelector('#re-ft-email').value.trim();
      const phone = footerForm.querySelector('#re-ft-phone').value.trim();

      if (!name || !email || !phone) {
        alert('Please fill out all fields to consult your advisor.');
        return;
      }

      await sendLeadEmail({
        Name: name,
        Email: email,
        Phone: phone,
        Source: 'Interior Design – Footer Form'
      }, `New Lead: ${name} – Interiors`);

      leadData = { name, email, phone, interest: 'interiors', locality: 'North-Bangalore', budget: 'tier-2' };
      openModal();
      updateWizardStep(5);

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
        Source: 'Interior Design – Newsletter Signup'
      }, `Newsletter Signup: ${emailVal}`);
      alert('Thank you for subscribing to our newsletter!');
      emailInput.value = '';
    });
  }

  // --- SMOOTH SCROLL FOR IN-PAGE ANCHORS ---
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

  bindModalTriggers();
});
