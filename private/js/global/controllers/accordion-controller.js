
/**
 * Description placeholder
 * @date 1/15/2024 - 4:33:11 PM
 *
 * @class AccordionController
 * @typedef {AccordionController}
 */
export class AccordionController {
  
  /**
   * Creates an instance of AccordionController.
   * @date 1/15/2024 - 4:33:19 PM
   *
   * @constructor
   * @param {HTMLDivElement} containerElement
   */
  constructor(containerElement) {
    this.containerElement = containerElement

    this.accordions = this.containerElement.querySelectorAll('.accordion-container')

    this.accordions.forEach((a, i) => a.addEventListener('click', (e) => this._onClick(e, i)))
  }

  _onClick(e, i) {
    const clickedAccordion = this.accordions[i]
    if(!clickedAccordion.classList.contains('open')) {
      this.accordions.forEach(ac => ac.classList.remove('open'))
      clickedAccordion.classList.add('open')
    }
  }
}