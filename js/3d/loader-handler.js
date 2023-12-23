registerComponent(() => {
  /**
	 * 1. Key
	 * 
	 * @description Obtener el ID del key generado desde PHP extrayendo el src="" único de este script invocado.
	 */
	const srcScript = new URL(document.currentScript.src); // import.meta.url equivalent when using module scripts. (<script type="module">)
	const queryParams = new URLSearchParams(srcScript.search);
	const uniqueId = queryParams.get('key');
	const templateUrl = queryParams.get('templateUrl');
	const componentName = queryParams.get('componentName');

  /**
	 * 2. Global (component-scope) variables
	 * 
	 * @description Crear controles y lógica sólo para el contenedor con el id único
	 */
	const parentEl = document.getElementById(uniqueId)
  const canvas = parentEl.querySelector("canvas.webgl")

  const mainScript = document.createElement('script');
	mainScript.type = 'module'
  mainScript.src = `${templateUrl}/js/parts/${componentName}/script.js?key=${uniqueId}&templateUrl=${templateUrl}`;
  document.body.appendChild(mainScript);


  function enable3d() {
    window.loaderHandler = renderLoaderScreen(canvas, 'center')
  }

  enable3d()
})