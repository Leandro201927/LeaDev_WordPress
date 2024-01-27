export class DialogController {
  
  /**
   * Creates an instance of DialogController.
   * @date 1/25/2024 - 9:49:11 PM
   *
   * @constructor
   * @param {HTMLElement} dialogContainer
   * @param {NodeListOf<Element>} triggers
   * @param {() => void} onOpenHubSpotDialog
   */
  constructor(dialogContainer, triggers, onOpenHubSpotDialog) {
    this.dialogContainer = dialogContainer
    this.triggers = triggers
    this.onOpenHubSpotDialog = onOpenHubSpotDialog

    this.inserted = false

    this._init()
  }
  _init() {
    document.body.appendChild(this.dialogContainer);
    this.inserted = true;

    // Recorre el array de triggers y asigna la función _openDialog al evento click
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', () => { this._openDialog() });
    });

    this.closeElement = this.dialogContainer.querySelector('#close');
    this.closeElement.addEventListener('click', () => { this._closeDialog() });
  }

  _openDialog() {
    this.dialogContainer.style.display = 'flex';
    setTimeout(() => this.dialogContainer.style.opacity = 1, 0);
    this.onOpenHubSpotDialog();
  }

  _closeDialog() {
    console.log('mm vea pues')
    this.dialogContainer.style.opacity = 0;
    const transitionEndHandler = () => {
      this.dialogContainer.style.display = 'none';
      this.dialogContainer.removeEventListener('transitionend', transitionEndHandler);
      // Elimina el evento click del closeElement
      this.closeElement.removeEventListener('click', () => { this._closeDialog() });
    };
    this.dialogContainer.addEventListener('transitionend', transitionEndHandler);
  }
}