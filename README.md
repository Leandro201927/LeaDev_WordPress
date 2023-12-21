## Esqueleto básico para registro de componente en JavaScript

```javascript
registerComponent(() => {
  /**
   * 1. Key
   * 
   * @description Obtener el ID del key generado desde PHP extrayendo el src="" único de este script invocado.
   */
  const srcScript = new URL(document.currentScript.src); // (All browser support except IE).
  const queryParams = new URLSearchParams(srcScript.search);
  const uniqueId = queryParams.get('key');

  /**
   * 2. Global (component-scope) variables
   * 
   * @description Crear controles y lógica sólo para el contenedor con el id único
   */
  const parentEl = document.getElementById(uniqueId)

  /**
   * 3. Component logic
   * 
   * @description ↓↓↓↓↓↓↓ Todo el resto de la lógica irá abajo ↓↓↓↓↓↓↓
   */
  
  // ...
})
```