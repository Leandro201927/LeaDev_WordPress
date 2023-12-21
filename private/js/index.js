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