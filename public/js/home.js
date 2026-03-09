const carousel = document.querySelector('[data-carousel]');

if (carousel) {
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
  const dots = Array.from(carousel.querySelectorAll('[data-carousel-dot]'));
  const prevButton = carousel.querySelector('[data-carousel-prev]');
  const nextButton = carousel.querySelector('[data-carousel-next]');

  let currentIndex = 0;
  let timerId = null;

  function updateCarousel(index) {
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentIndex);
    });
  }

  function nextSlide() {
    updateCarousel(currentIndex + 1);
  }

  function prevSlide() {
    updateCarousel(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    timerId = setInterval(nextSlide, 4000);
  }

  function stopAutoPlay() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  prevButton.addEventListener('click', () => {
    prevSlide();
    startAutoPlay();
  });

  nextButton.addEventListener('click', () => {
    nextSlide();
    startAutoPlay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      updateCarousel(index);
      startAutoPlay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  updateCarousel(0);
  startAutoPlay();
}
