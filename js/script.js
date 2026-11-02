document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Плавный скролл и подсветка ссылок ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Игнорируем пустые ссылки (href="#")
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80; 
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Закрываем мобильное меню Bootstrap после клика
        const navbarCollapse = document.getElementById('mainMenu');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        }
      }
    });
  });

  // --- 2. Эффект "липкого" хедера ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  });

  // --- 3. Анимация появления карточек (Intersection Observer) ---
  const cards = document.querySelectorAll('.feature-card');
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Задержка создает эффект каскада
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150); 
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => cardObserver.observe(card));

  // --- 4. Анимация цифр (Счетчики) ---
  const counters = document.querySelectorAll('.stat__value');
  const speed = 200; 

  // Функция добавления запятых (например: 2245341 -> 2,245,341)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const startCounters = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.innerText.replace(/,/g, '');
        const updateCount = () => {
          const count = +counter.innerText.replace(/,/g, '');
          const inc = target / speed;

          if (count < target) {
            counter.innerText = formatNumber(Math.ceil(count + inc));
            setTimeout(updateCount, 20); // 20ms для видимости анимации
          } else {
            counter.innerText = formatNumber(target);
          }
        };
        updateCount();
        observer.unobserve(counter);
      }
    });
  };

  const counterObserver = new IntersectionObserver(startCounters, { threshold: 0.5 });
  counters.forEach(counter => counterObserver.observe(counter));

  // --- 5. Заглушка для формы подписки (Alert) ---
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = subscribeForm.querySelector('input');
      alert(`Спасибо! Вы подписались на рассылку (Email: ${input.value})`);
      input.value = ''; // Очистить поле
    });
  }

});