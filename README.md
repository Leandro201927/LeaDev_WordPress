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

## Habilitando la compresión en el lado del servidor (solo para Bitnami/Apache)

1. Escoger la ruta `/opt/bitnami/apache/conf/deflate.conf` (especificada en el `/opt/bitnami/apache2/conf/httpd.conf` y `/opt/bitnami/apache/conf/httpd.conf` donde hay un `Include "/opt/bitnami/apache/conf/deflate.conf"` casi al final del archivo de configuracion)

```conf
<IfModule mod_deflate.c>
  # Compress .glb and .wasm (for DRACOLoader)
  AddOutputFilterByType DEFLATE model/gltf-binary
  AddOutputFilterByType DEFLATE application/wasm

  # Compress HTML, CSS, JavaScript, Text, XML and fonts
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
  AddOutputFilterByType DEFLATE application/x-font
  AddOutputFilterByType DEFLATE application/x-font-opentype
  AddOutputFilterByType DEFLATE application/x-font-otf
  AddOutputFilterByType DEFLATE application/x-font-truetype
  AddOutputFilterByType DEFLATE application/x-font-ttf
  AddOutputFilterByType DEFLATE application/x-javascript
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE font/opentype
  AddOutputFilterByType DEFLATE font/otf
  AddOutputFilterByType DEFLATE font/ttf
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE image/x-icon
  AddOutputFilterByType DEFLATE image/webp
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml

  # Remove browser bugs (only needed for really old browsers)
  BrowserMatch ^Mozilla/4 gzip-only-text/html
  BrowserMatch ^Mozilla/4\.0[678] no-gzip
  BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
  Header append Vary User-Agent
</IfModule>
```

2. Una vez guardes, reiniciar el servicio apache con `sudo /opt/bitnami/ctlscript.sh restart apache`
3. Probablemente el .glb no esté comprimiéndose debido a que apache no trae el header 'Content-Type' para los archivos .glb, para darle soporte y poder ser comprimidos, habrá que modificar el archivo que se encuentra en `/opt/bitnami/apache/conf/mime.types`.
4. Estando dentro del archivo `mime.types`, ir a la linea 1638 o casi al 80 - 90% donde se encuentren los prefijos `model/..` y agregar lo siguiente:
```conf
...
# model/gltf+json
model/gltf-binary                               glb
...
```
En caso de no encontrar en que linea de referencia buscar, se puede ver los mime.types de referencia en https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
3. Testear si la compresion está funcionando, usando esta herramienta: http://www.gidnetwork.com/tools/gzip-test.php