/**
 * Description placeholder
 * @date 1/17/2024 - 11:24:18 PM
 *
 * @class SliderController
 * @typedef {SliderController}
 */
class SliderController {
  
  /**
   * Creates an instance of SliderController.
   * @date 1/17/2024 - 11:24:25 PM
   *
   * @constructor
   * @param {HTMLElement} sliderElement
   */
  constructor(sliderElement) {
    this.parentEl = sliderElement
    this.rawIndicator = sliderElement.querySelector('span#raw-indicator')
    this.trackLine = sliderElement.querySelector('div.track-line')
    this.trackCurrentActiveLine = sliderElement.querySelector('div.line-current-active-track')
    this.scrollDownArrow = sliderElement.querySelector('span#scroll-down-arrow')
    
    this.prevIndex = 0
    this.currentIndex = 0
    this.listeners = {}
    this.canScroll = false

    this._init()

    this.animationInProgress = false;
    // Add a scroll sensitivity property
    this.scrollSensitivity = 4; // Adjust this value to your needs

    // Bind the scroll event to the parent element
    document.addEventListener('wheel', this._handleScroll.bind(this));

    // Bind the transitionend handler to this and store it as a property so it can be referenced later
    this.boundHandleTransitionEndOnSlideHide = this._handleTransitionEndOnSlideHide.bind(this);
    this.parentEl.addEventListener('transitionend', this.boundHandleTransitionEndOnSlideHide);
  }
  /**
   * Manejador para el evento touchstart en dispositivos móviles.
   * @param {TouchEvent} event - Objeto de evento touchstart.
   */
  _handleTouchStart(event) {
    if (!this.animationInProgress) {
      this.startY = event.touches[0].clientY;
    }
  }

  /**
   * Manejador para el evento touchmove en dispositivos móviles.
   * @param {TouchEvent} event - Objeto de evento touchmove.
   */
  _handleTouchMove(event) {
    if (!this.animationInProgress) {
      const touchMoved = this.startY - event.touches[0].clientY;
      this.startY = event.touches[0].clientY;

      if (touchMoved > this.scrollSensitivity) {
        this.nextPage();
      } else if (touchMoved < -this.scrollSensitivity) {
        this.previousPage();
      }
    }
  }
  _initMobileScroll() {
    this.boundHandleTouchStart = this._handleTouchStart.bind(this);
    this.boundHandleTouchMove = this._handleTouchMove.bind(this);

    document.addEventListener('touchstart', this.boundHandleTouchStart);
    document.addEventListener('touchmove', this.boundHandleTouchMove);
  }
  _init() {
    const numSlides = document.querySelectorAll('.slider-sections .slide').length;
    this.numSlides = numSlides
    const trackHeight = 100 / numSlides;
    // Aplica la altura a cada track
    const track = document.querySelector('.line-current-active-track');
    track.style.height = trackHeight + '%';

    this._initMobileScroll(); // Inicializa los eventos de scroll en dispositivos móviles
  }
  // private .on that will execute every public .on callbacks when event is called
  _on(event, data) { 
    if(this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data))
    }
  }
  _handleTransitionEndOnSlideHide(event) {
    // Check if the event target has the 'animate' class
    if(event.target.classList.contains('animate') && !event.target.classList.contains('show')) {
      const lastSlide = this.parentEl.querySelectorAll('.slider-sections .slide')[this.prevIndex]
      lastSlide.style.display = 'none'

      const currentSlide = this.parentEl.querySelectorAll('.slider-sections .slide')[this.currentIndex]
      const firstSlideElements = currentSlide.querySelectorAll('.animate')
      currentSlide.style.display = 'flex'
      setTimeout(() => {
        firstSlideElements.forEach(el => {
          this.parentEl.addEventListener('transitionend', (event) => {
            if(event.target.classList.contains('animate') && event.target.classList.contains('show')) {
              this.animationInProgress = false
            }
          });
          el.classList.add('show')
        })
      }, 0)
    }
  }
  _disableSmoothScroll() {
    // Deshabilita el desplazamiento suave (fricción)
    document.body.style.scrollBehavior = 'auto';
    // Oculta el desbordamiento del cuerpo para desactivar el scroll
    document.body.style.overflow = 'hidden';
    // Fija la posición para evitar el desplazamiento
    document.body.style.position = 'fixed';
  }

  _enableSmoothScroll() {
    // Vuelve a habilitar el desplazamiento suave
    document.body.style.scrollBehavior = 'smooth';
    // Restaura las propiedades originales de desbordamiento y posición
    document.body.style.overflow = '';
    document.body.style.position = '';
  }
  _handleScroll(event) {
    console.log(event.target === this.parentEl)
    if(this.canScroll) {
      // Check if an animation is in progress
      if (!this.animationInProgress) {
        // Check the scroll direction
        if (event.deltaY < -this.scrollSensitivity) {
          // Scrolling up
          this.previousPage();
        } else if (event.deltaY > this.scrollSensitivity) {
          // Scrolling down
          this.nextPage();
        }
      }
    }
  }
  _renderNewSlide() {
    this.animationInProgress = true;
    this._disableSmoothScroll();
    // 1. Remove every .show class in every element
    const allElements = this.parentEl.querySelectorAll('.animate')

    this._renderTrackerPosition()

    allElements.forEach(el => {
      if(!el.classList.contains('slider-indicator')) {
        el.classList.remove('show')
        // ... (Check _handleTransitionEndOnSlideHide for next slide entry animation)
      }
    })
  }
  _renderTrackerPosition() {
    // const trackHeight = 100 / this.numSlides;
    const yDistance = 100 * this.currentIndex
    const track = this.parentEl.querySelector('.line-current-active-track');
    track.style.transform = `translateY(${yDistance}%)`;

    const rawIndicator = this.parentEl.querySelector('#raw-indicator');
    rawIndicator.innerText = `0${this.currentIndex + 1}`
  }

  /**
   * -----------------------------------------
   * ----------- Public methods --------------
   * -----------------------------------------
   */
  on(event, callback) {
    if(this.listeners[event]) {
      this.listeners[event].push(callback)
    } else {
      this.listeners[event] = [callback]
    }
  }
  nextPage() {
    // Increase the index and limit it to the number of slides
    this.prevIndex = this.currentIndex
    this.currentIndex = Math.min(this.currentIndex + 1, this.numSlides - 1);

    if (this.currentIndex !== this.prevIndex) {
      this._renderNewSlide();
      // Trigger the onslidechange event
      this._on('onslidechange', this.currentIndex);
    }
  }
  previousPage() {
    // Decrease the index and ensure it doesn't go below 0
    this.prevIndex = this.currentIndex
    this.currentIndex = Math.max(this.currentIndex - 1, 0);

    if (this.currentIndex !== this.prevIndex) {
      this._renderNewSlide();
      // Trigger the onslidechange event
      this._on('onslidechange', this.currentIndex);
    }
  }
  renderFirstSlide() {
    const firstSlide = this.parentEl.querySelectorAll('.slider-sections .slide')[0]
    const firstSlideElements = firstSlide.querySelectorAll('.animate')
    const sliderIndicator = this.parentEl.querySelector('.slider-indicator')
    firstSlide.style.display = 'flex'
    setTimeout(() => {
      firstSlideElements.forEach(el => {
        el.classList.add('show')
      })
      sliderIndicator.classList.add('show')
      sliderIndicator.addEventListener('transitionend', () => {
        this.canScroll = true
      })
    }, 0)
  }
}

/**
 * Description placeholder
 * @date 1/17/2024 - 11:23:57 PM
 *
 * @class SliderImageController
 * @typedef {SliderImageController}
 */
class SliderImageController {
  constructor(sliderElement) {
    this.sliderElement = sliderElement;
    this.nextButton = sliderElement.querySelector('button.next');

    this.listeners = {};

    this.actualPage = 1;
    this.numSlides = this.sliderElement.querySelectorAll('.slider-image-container').length;

    this.nextButton.addEventListener('click', this.nextPage.bind(this));
    this._init();
  }

  _on(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  _handleTransitionEnd(lastSlide, newSlide) {
    lastSlide.removeEventListener('transitionend', this._handleTransitionEndPointer);

    lastSlide.style.display = 'none';
    newSlide.style.display = 'flex';

    // this._on('slidechange', this.actualPage);

    // Agregar setTimeout para retrasar la llamada a _delayNextSlide
    setTimeout(() => {
      this._delayNextSlide(newSlide);
    }, 0);
  }

  _delayNextSlide(newSlide) {
    this._handleNewSlideTransitionEndPointer = this._handleNewSlideTransitionEnd.bind(this, newSlide);
    newSlide.addEventListener('transitionend', this._handleNewSlideTransitionEndPointer);
    newSlide.classList.add('show');
  }

  _handleNewSlideTransitionEnd(newSlide) {
    newSlide.removeEventListener('transitionend', this._handleNewSlideTransitionEndPointer);

    this._on('slidechange', this.actualPage);
  }

  _init() {
    this.sliderElement.querySelectorAll('.slider-image-container').forEach(s => {
      s.style.display = 'none';
    });
    this.sliderElement.querySelectorAll('.slider-image-container')[0].style.display = 'flex';
  }

  prevPage(e) {
    this.lastPage = this.actualPage;
    this.actualPage = (this.actualPage - 1 < 1) ? this.numSlides : this.actualPage - 1;

    this._on('preslidechange', this.actualPage);

    let lastSlide = this.sliderElement.querySelector(`.slider-image-container-${this.lastPage}`);
    let newSlide = this.sliderElement.querySelector(`.slider-image-container-${this.actualPage}`);

    this._handleTransitionEndPointer = this._handleTransitionEnd.bind(this, lastSlide, newSlide);
    lastSlide.addEventListener('transitionend', this._handleTransitionEndPointer);

    lastSlide.classList.remove('show');
  }

  nextPage(e) {
    this.lastPage = this.actualPage;
    this.actualPage = (this.actualPage + 1 > this.numSlides) ? 1 : this.actualPage + 1;

    this._on('preslidechange', this.actualPage);

    let lastSlide = this.sliderElement.querySelector(`.slider-image-container-${this.lastPage}`);
    let newSlide = this.sliderElement.querySelector(`.slider-image-container-${this.actualPage}`);

    this._handleTransitionEndPointer = this._handleTransitionEnd.bind(this, lastSlide, newSlide);
    lastSlide.addEventListener('transitionend', this._handleTransitionEndPointer);

    lastSlide.classList.remove('show');
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    } else {
      this.listeners[event] = [callback];
    }
  }
}


