class SliderController {
  constructor(sliderElement) {
    this.parentEl = sliderElement
    this.rawIndicator = sliderElement.querySelector('span#raw-indicator')
    this.trackLine = sliderElement.querySelector('div.track-line')
    this.trackCurrentActiveLine = sliderElement.querySelector('div.line-current-active-track')
    this.scrollDownArrow = sliderElement.querySelector('span#scroll-down-arrow')
    
    this.currentIndex = 0
    this.listeners = {}
  }
  _init() {
    const numSlides = document.querySelectorAll('.slider-sections .slide').length;
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
  on(event, callback) {
    if(this.listeners[event]) {
      this.listeners[event].push(callback)
    } else {
      this.listeners[event] = [callback]
    }
  }
  nextPage() {

  }
  previousPage() {

  }
  renderFirstSlide() {
    const allAnimateElements = this.parentEl.querySelectorAll('.animate')
    allAnimateElements.forEach(el => {
      el.classList.add('show')
    })
  }
}