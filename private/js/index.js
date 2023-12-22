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
export function registerComponent(callback) {
  return callback()
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {'right' | 'left' | 'center'} position
 * @returns {{ checkIfIsOpened: () => boolean; finish: () => void; changeLoaderLabelState: (state: any) => void; }}
 */
export function renderLoaderScreen(canvas, position) {
  let isOpened = true

  canvas.parentElement.innerHTML += `
    <div class="background-loader">
      <div class="penrose-loader ${position}">
        <svg width="91" height="79" viewBox="0 0 91 79" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45.112 0L43.4829 2.8195L39.7549 9.30435L39.2224 10.2442L39.7549 11.184L65.569 55.8887H41.8539H40.7574L40.2249 56.8286L36.4968 63.3447L34.8678 66.1329H38.0946L80.0738 66.1642L83.3005 66.1329L81.6715 63.3134L46.741 2.8195L45.112 0ZM38.1885 11.9985L36.5595 14.818L1.62904 75.3433L0 78.1314H3.25809H10.7454H11.8419L12.3745 77.1916L38.1885 32.4869L50.0618 53.0066L50.563 53.9464H51.6595H59.1468H62.4049L60.7759 51.1582L39.8176 14.818L38.1885 11.9985ZM38.0632 36.1836L36.4655 39.0031L15.4759 75.3119L13.8469 78.1314H17.105H86.9972H90.224L88.5949 75.3119L84.8669 68.8271L84.303 67.8873H83.2379H31.6097L43.4516 47.3676L43.9842 46.4277L43.4516 45.4879L39.6923 39.0031L38.0632 36.1836Z" fill="white"/>
        </svg>
      </div>
    </div>`;

  return {
    checkIfIsOpened: () => isOpened,
    finish: function() {
      isOpened = false
      const loaderElement = document.getElementById("loaderElement3d")
      loaderElement.style.display = "none"
    },
    changeLoaderLabelState: (state) => {
      
    }
  }
}