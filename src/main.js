/**
 * ZYX Nova - Career Upgrade Platform
 * Final Script v1.0 (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (Lucide)
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // 2. ИНИЦИАЛИЗАЦИЯ 3D ЭФФЕКТА (Vanta.js Net)
  let vantaEffect = null;
  if (typeof VANTA !== 'undefined' && document.querySelector('#hero-background')) {
      vantaEffect = VANTA.NET({
          el: "#hero-background",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x4f46e5, // Indigo
          backgroundColor: 0x0f1113, // Dark BG
          points: 12.00,
          maxDistance: 22.00,
          spacing: 16.00,
          showDots: true
      });
  }

  // 3. МОБИЛЬНОЕ МЕНЮ (Бургер)
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');
  const body = document.body;

  const toggleMenu = () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      body.classList.toggle('no-scroll'); // Блокировка скролла страницы
  };

  if (burger) {
      burger.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu();
      });
  }

  // Закрытие меню при клике на ссылку или вне меню
  menuLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (mobileMenu.classList.contains('active')) toggleMenu();
      });
  });

  // 4. ГЛОБАЛЬНЫЕ АНИМАЦИИ (GSAP + ScrollTrigger)
  if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // --- Анимация Hero (сразу после загрузки) ---
      const heroTl = gsap.timeline({ delay: 0.5 });

      // Устанавливаем начальные точки (чтобы не было прыжков)
      gsap.set(['.hero__title', '.hero__description', '.hero__actions', '.hero__stats'], {
          y: 50,
          autoAlpha: 0
      });

      heroTl.to('.hero__title', { y: 0, autoAlpha: 1, duration: 1, ease: 'power4.out' })
            .to('.hero__description', { y: 0, autoAlpha: 1, duration: 0.8 }, '-=0.6')
            .to('.hero__actions .btn', { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.2 }, '-=0.4')
            .to('.hero__stats', { y: 0, autoAlpha: 1, duration: 0.8 }, '-=0.4');

      // --- Анимация появления секций при скролле ---
      const scrollReveal = (selector, yDist = 60) => {
          gsap.utils.toArray(selector).forEach(el => {
              gsap.from(el, {
                  scrollTrigger: {
                      trigger: el,
                      start: 'top 85%',
                      toggleActions: 'play none none none'
                  },
                  y: yDist,
                  autoAlpha: 0,
                  duration: 1,
                  ease: 'power3.out'
              });
          });
      };

      scrollReveal('.about__content');
      scrollReveal('.benefit-card', 80);
      scrollReveal('.method-step', 40);
      scrollReveal('.blog-card', 50);
      scrollReveal('.review-card', 30);
      scrollReveal('.innovations__info', 40);

      // Интерактивный параллакс для "Ядра" в секции Инновации
      document.addEventListener('mousemove', (e) => {
          const depth = 0.015;
          const moveX = (e.clientX - window.innerWidth / 2) * depth;
          const moveY = (e.clientY - window.innerHeight / 2) * depth;

          gsap.to('.core-node', {
              x: moveX,
              y: moveY,
              duration: 1.5,
              ease: 'power2.out'
          });
      });
  }

  // 5. ЭФФЕКТ "МАГНИТНОГО" СВЕЧЕНИЯ КАРТОЧЕК
  document.querySelectorAll('.benefit-card').forEach(card => {
      card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
          const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
          card.style.setProperty('--x', `${x}%`);
          card.style.setProperty('--y', `${y}%`);
      });
  });

  // 6. ЛОГИКА КАПЧИ И ФОРМЫ (Валидация + AJAX)
  const form = document.getElementById('careerForm');
  const captchaLabel = document.getElementById('captchaQuestion');
  const captchaInput = document.getElementById('captchaInput');
  const phoneInput = document.getElementById('userPhone');
  const successMsg = document.getElementById('formSuccess');

  let correctSum = 0;

  const refreshCaptcha = () => {
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;
      correctSum = n1 + n2;
      if (captchaLabel) captchaLabel.textContent = `${n1} + ${n2} = ?`;
  };

  if (form) {
      refreshCaptcha();

      // Только цифры в телефоне
      phoneInput?.addEventListener('input', e => {
          e.target.value = e.target.value.replace(/\D/g, '');
      });

      form.addEventListener('submit', (e) => {
          e.preventDefault();

          if (parseInt(captchaInput.value) !== correctSum) {
              alert('Ошибка в капче! Пожалуйста, попробуйте еще раз.');
              captchaInput.value = '';
              refreshCaptcha();
              return;
          }

          const btn = form.querySelector('button[type="submit"]');
          btn.disabled = true;
          btn.textContent = 'Обработка...';

          // Имитация AJAX
          setTimeout(() => {
              // Скрываем элементы формы
              form.querySelectorAll('.form-group, .form-row, .form-checkbox, button').forEach(el => {
                  el.style.display = 'none';
              });
              // Показываем успех
              successMsg.style.display = 'flex';
              if (typeof lucide !== 'undefined') lucide.createIcons();
          }, 1500);
      });
  }

  // 7. COOKIE POPUP
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptBtn = document.getElementById('acceptCookies');

  if (cookiePopup && !localStorage.getItem('zyx_cookies_accepted')) {
      setTimeout(() => {
          cookiePopup.classList.add('show');
      }, 3000);
  }

  acceptBtn?.addEventListener('click', () => {
      localStorage.setItem('zyx_cookies_accepted', 'true');
      cookiePopup.classList.remove('show');
  });

  // 8. ЭФФЕКТ HEADER ПРИ СКРОЛЛЕ
  window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 100) {
          header.style.padding = '12px 0';
          header.style.background = 'rgba(15, 17, 19, 0.98)';
          header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      } else {
          header.style.padding = '20px 0';
          header.style.background = 'rgba(15, 17, 19, 0.8)';
          header.style.boxShadow = 'none';
      }
  });
});