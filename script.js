   // Back To Top Button Functionality
    document.addEventListener("DOMContentLoaded", function () {
      const backToTopBtn = document.querySelector(".back-to-top");

      window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }
      });

      backToTopBtn.addEventListener("click", function (e) {
        e.preventDefault();
        smoothScrollToTop(1000);
      });

      function smoothScrollToTop(duration) {
        const start = window.scrollY;
        const startTime = performance.now();

        function scrollStep(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);

          window.scrollTo(0, start * (1 - ease));

          if (progress < 1) {
            requestAnimationFrame(scrollStep);
          }
        }

        requestAnimationFrame(scrollStep);
      }
    });

    // Typing Effect
    document.addEventListener("DOMContentLoaded", function () {
      const phrases = [
        "a Backend Developer",
        "a Automation Engineer",
        "a DevOps Enthusiast"
      ];

      const typedText = document.getElementById("typed-text");
      let currentPhraseIndex = 0;
      let currentCharIndex = 0;
      let isDeleting = false;

      const typingSpeed = 100;
      const deletingSpeed = 50;
      const delayBetweenPhrases = 1500;

      function typeEffect() {
        const currentPhrase = phrases[currentPhraseIndex];

        if (isDeleting) {
          typedText.textContent = currentPhrase.substring(0, currentCharIndex--);
        } else {
          typedText.textContent = currentPhrase.substring(0, currentCharIndex++);
        }

        if (!isDeleting && currentCharIndex === currentPhrase.length + 1) {
          isDeleting = true;
          setTimeout(typeEffect, delayBetweenPhrases);
        } else if (isDeleting && currentCharIndex === 0) {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
          setTimeout(typeEffect, 500);
        } else {
          setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
        }
      }

      typeEffect();
    });

    // Mobile Navigation Toggle
    function toggleMobileNav() {
      const header = document.getElementById('header');
      header.classList.toggle('mobile-nav-active');
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
      const header = document.getElementById('header');
      const toggle = document.querySelector('.mobile-nav-toggle');
      if (header.classList.contains('mobile-nav-active') && 
          !header.contains(e.target) && 
          !toggle.contains(e.target)) {
        header.classList.remove('mobile-nav-active');
      }
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', function() {
        const header = document.getElementById('header');
        header.classList.remove('mobile-nav-active');
      });
    });

    // Active navigation based on scroll
    window.addEventListener('scroll', function() {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav-menu a[href="#' + sectionId + '"]');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
          if (navLink) navLink.classList.add('active');
        }
      });
    });

    // Portfolio filter
    const filterButtons = document.querySelectorAll('#portfolio-flters li');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('filter-active'));
        this.classList.add('filter-active');

        portfolioItems.forEach(item => {
          if (filter === '*' || item.classList.contains('filter-' + filter)) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Skills Progress Bar Animation
    function animateProgressBar(bar, valueElement, targetPercent, duration = 1000) {
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const currentPercent = Math.floor(progress * targetPercent);
        bar.style.width = currentPercent + '%';
        valueElement.textContent = currentPercent + '%';

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }

    let hasAnimated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;

          document.querySelectorAll('.progress').forEach(progressEl => {
            const bar = progressEl.querySelector('.progress-bar');
            const valueEl = progressEl.querySelector('.val');
            const target = parseInt(valueEl.textContent.replace('%', ''), 10);

            bar.style.width = '0%';
            valueEl.textContent = '0%';

            animateProgressBar(bar, valueEl, target, 1000);
          });
        }
      });
    }, {
      threshold: 0.3
    });

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }

    // Form Submission
    function closeSuccessPopup() {
      const popup = document.getElementById("success-popup");
      popup.style.display = 'none';
    }

    const form = document.getElementById("my-form");
    const popup = document.getElementById("success-popup");
    const checkmarkPath = document.getElementById("checkmark-path");
    const submitButton = form.querySelector('button[type="submit"]');

    async function handleSubmit(event) {
      event.preventDefault();
      const status = document.getElementById("my-form-status");
      const data = new FormData(event.target);

      submitButton.disabled = true;
      submitButton.textContent = "Sending...";

      try {
        const response = await fetch(event.target.action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.reset();
          showSuccessPopup();
          status.innerHTML = "";
        } else {
          const data = await response.json();
          if (data.errors) {
            status.innerHTML = data.errors.map(e => e.message).join(", ");
          } else {
            status.innerHTML = "Oops! There was a problem submitting your form";
          }
        }
      } catch (error) {
        status.innerHTML = "Oops! There was a problem submitting your form";
      }

      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }

    function showSuccessPopup() {
      checkmarkPath.style.animation = "none";
      void checkmarkPath.offsetWidth;
      checkmarkPath.style.animation = null;

      popup.style.display = 'flex';

      setTimeout(() => {
        popup.style.display = 'none';
      }, 3000);
    }

    form.addEventListener("submit", handleSubmit);

    // SMOOTH SCROLL FOR ALL NAVIGATION LINKS - FIXED VERSION
    function smoothScrollToPosition(targetPosition, duration) {
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const startTime = performance.now();

      function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, startPosition + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        }
      }

      requestAnimationFrame(scrollStep);
    }

    // Apply smooth scroll to ALL anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
           // const headerOffset = window.innerWidth > 1024 ? 0 : 80;
          const headerOffset = 0;
          const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerOffset;
          
          smoothScrollToPosition(targetPosition, 1000);
        }
      });
    });
