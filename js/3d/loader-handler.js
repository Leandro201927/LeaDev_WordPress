try {
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
	
		function enable3d() {
			window.loaderHandler = renderLoaderScreen(canvas, 'center')
	
			const mainScript = document.createElement('script');
			mainScript.type = 'module'
			// mainScript.src = `${templateUrl}/js/parts/${componentName}/script.js?key=${uniqueId}&templateUrl=${templateUrl}`;
			mainScript.src = `${templateUrl}/js/parts/${componentName}/script.min.js?key=${uniqueId}&templateUrl=${templateUrl}`;
			mainScript.id = `test-melo`;
			document.body.appendChild(mainScript);
	
			loaderHandler.updateProgress(`llegue ${document.getElementById('test-melo').src}`)
		}
	
		const script3 = document.createElement('script');
		script3.type = 'importmap';
		script3.innerHTML = `
			{
				"imports": {
					"three": "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.156.1/three.module.min.js"
				}
			}
		`;
		document.head.appendChild(script3);
	
		// const script3 = document.createElement('script');
		// script3.type = 'importmap';
		// // "three": "${templateUrl}/js/lib/threejs/three.module.js",
		// script3.innerHTML = `
		// 	{
		// 		"imports": {
		// 			"lil-gui": "https://cdn.jsdelivr.net/npm/lil-gui@0.19/+esm",
		// 			"tween": "https://cdnjs.cloudflare.com/ajax/libs/tween.js/21.0.0/tween.esm.min.js",
		// 			"three": "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.156.1/three.module.min.js",
		// 			"three/controls/OrbitControls": "${templateUrl}/js/lib/threejs/controls/OrbitControls.min.js",
		// 			"three/loaders/DRACOLoader": "${templateUrl}/js/lib/threejs/loaders/DRACOLoader.min.js",
		// 			"three/loaders/GLTFLoader": "${templateUrl}/js/lib/threejs/loaders/GLTFLoader.min.js",
		// 			"three/postprocessing/EffectComposer": "${templateUrl}/js/lib/threejs/postprocessing/EffectComposer.min.js",
		// 			"three/postprocessing/UnrealBloomPass": "${templateUrl}/js/lib/threejs/postprocessing/UnrealBloomPass.min.js",
		// 			"three/postprocessing/RenderPass": "${templateUrl}/js/lib/threejs/postprocessing/RenderPass.min.js",
		// 			"three/postprocessing/ShaderPass": "${templateUrl}/js/lib/threejs/postprocessing/ShaderPass.min.js",
		// 			"three/shaders/GammaCorrectionShader": "${templateUrl}/js/lib/threejs/shaders/GammaCorrectionShader.min.js",
		// 			"three/shaders/RGBShiftShader": "${templateUrl}/js/lib/threejs/shaders/RGBShiftShader.min.js",
		// 			"three/shaders/FXAAShader": "${templateUrl}/js/lib/threejs/shaders/FXAAShader.min.js",
		// 			"three/environment/RoomEnvironment": "${templateUrl}/js/lib/threejs/environments/RoomEnvironment.min.js"
		// 		}
		// 	}
		// `;
		// document.head.appendChild(script3);
		enable3d()
	})
} catch(e) {
	loaderHandler.updateProgress('ups error: ', e)
}