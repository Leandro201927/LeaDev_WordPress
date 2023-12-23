/**
 * Carga de componentes
 * 
 * @description debido a la posibilidad de cargar componentes iguales, no basta con
 * un key único por componente, ya que el código declarará variables iguales. Habrá
 * una función genérica (registerComponent) que encapsulará la lógica de todos los
 * componentes, sin importar si son iguales o distintos.
 * 
 * @rule no se podrá usar la declaración 'var' de ninguna variable, o dará error de ejecución.
 * en su efecto se usará 'let' y 'const' para mantener el blocked-scope activo entre las lógicas.
 */

/**
 * @param {() => void} callback
 * @returns {() => void}
 */
function registerComponent(callback) {
  return callback()
}

/**
 * 
 * @param {HTMLCanvasElement} canvas
 * @param {'right' | 'left' | 'center'} position
 * @returns {{ checkIfIsOpened: () => boolean; finish: () => void; changeLoaderLabelState: (state: any) => void; }}
 */
function renderLoaderScreen(canvas, position) {
  let isOpened = true

  canvas.parentElement.innerHTML += `
    <div class="background-loader" id="loaderElement3d">
      <div class="penrose-loader ${position}">
        <!-- <svg width="91" height="79" viewBox="0 0 91 79" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45.112 0L43.4829 2.8195L39.7549 9.30435L39.2224 10.2442L39.7549 11.184L65.569 55.8887H41.8539H40.7574L40.2249 56.8286L36.4968 63.3447L34.8678 66.1329H38.0946L80.0738 66.1642L83.3005 66.1329L81.6715 63.3134L46.741 2.8195L45.112 0ZM38.1885 11.9985L36.5595 14.818L1.62904 75.3433L0 78.1314H3.25809H10.7454H11.8419L12.3745 77.1916L38.1885 32.4869L50.0618 53.0066L50.563 53.9464H51.6595H59.1468H62.4049L60.7759 51.1582L39.8176 14.818L38.1885 11.9985ZM38.0632 36.1836L36.4655 39.0031L15.4759 75.3119L13.8469 78.1314H17.105H86.9972H90.224L88.5949 75.3119L84.8669 68.8271L84.303 67.8873H83.2379H31.6097L43.4516 47.3676L43.9842 46.4277L43.4516 45.4879L39.6923 39.0031L38.0632 36.1836Z" fill="white"/>
        </svg> -->
        <svg width="127" height="118" viewBox="0 0 127 118" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_319_7)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M95.887 75.692L68.746 31H59.091H59.083L80.378 66.527C80.519 66.762 80.523 67.055 80.388 67.295C80.252 67.534 79.998 67.683 79.725 67.683H58.967L54.268 75.693L95.887 75.692Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M96 77.217H85.803H74.363H52.937C52.664 77.217 52.412 77.071 52.277 76.833C52.143 76.601 52.144 76.315 52.274 76.083L52.273 76.08L61.993 58.804L57.761 52.005L55.265 56.31L37.399 87.132H90.977L96 77.217Z" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M31 76.481L36.112 86.311L57.076 50.141C57.209 49.912 57.453 49.767 57.719 49.761C57.989 49.732 58.234 49.889 58.378 50.112L58.383 50.121L58.397 50.143L68.665 66.157H78.377L57.737 31.722L31 76.481Z" fill="white"/>
        </g>
        <defs>
        <filter id="filter0_d_319_7" x="0.6" y="0.6" width="125.8" height="116.932" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset/>
        <feGaussianBlur stdDeviation="15.2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_319_7"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_319_7" result="shape"/>
        </filter>
        </defs>
        </svg>

      </div>
    </div>`;

  return {
    checkIfIsOpened: () => isOpened,
    getLoaderParentElement: function() {
      const loaderElement = document.getElementById("loaderElement3d")
      return loaderElement
    },
    finish: function() {
      isOpened = false
      const loaderElement = document.getElementById("loaderElement3d")
      loaderElement.style.display = "none"
    },
    changeLoaderLabelState: (state) => {
      
    }
  }
}