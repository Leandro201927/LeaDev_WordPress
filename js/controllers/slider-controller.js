class SliderController {
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
    this.scrollSensitivity = 0; // Adjust this value to your needs

    // Bind the scroll event to the parent element
    document.addEventListener('wheel', this._handleScroll.bind(this));

    // Bind the transitionend handler to this and store it as a property so it can be referenced later
    this.boundHandleTransitionEndOnSlideHide = this._handleTransitionEndOnSlideHide.bind(this);
    this.parentEl.addEventListener('transitionend', this.boundHandleTransitionEndOnSlideHide);
  }
  _init() {
    const numSlides = document.querySelectorAll('.slider-sections .slide').length;
    this.numSlides = numSlides
    const trackHeight = 100 / numSlides;
    // Aplica la altura a cada track
    const track = document.querySelector('.line-current-active-track');
    track.style.height = trackHeight + '%';
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
      currentSlide.style.display = 'block'
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
  _handleScroll(event) {
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

    console.log(this.prevIndex, this.currentIndex)

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

    console.log(this.prevIndex, this.currentIndex)

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
    firstSlide.style.display = 'block'
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