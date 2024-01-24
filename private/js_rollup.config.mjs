import resolve from '@rollup/plugin-node-resolve';
import multiInput from 'rollup-plugin-multi-input';
import { rollupImportMapPlugin } from 'rollup-plugin-import-map';
import { terser } from "rollup-terser";
import copy from 'rollup-plugin-copy';
import path from 'path';

export default {
  // treeshake: false, // three shaking desactivado: se incluirá todo el código "inutilizable" a ojos de rollup. (e.g: "private/js/index", "private/js/3d/performance-monitor", "private/js/controllers/accordion-controller", "private/js/controllers/slider-controller)
  input: [
    'private/js/parts/**/*.js',
    // 'private/js/3d/*.js',
    // 'private/js/controllers/*.js',
    // 'private/js/index.js',
  ],
  plugins: [
    multiInput.default(), // primero el plugin de multi-input
    rollupImportMapPlugin('private/rollup-importmap-3d.json'), // usar importmap para cuando rollup detecte un import de un path desconocido. (por ejemplo los imports del parts/homepage/script.js)
    resolve({ // luego el plugin de node-resolve
      browser: true,
    }),
    terser(), // sigue utilizando el plugin terser para la minificación
  ],
  output: {
    dir: 'js', // directorio de salida
    format: 'esm',
    // inlineDynamicImports: true,
    entryFileNames: chunkInfo => chunkInfo.name.replace('private/js/', '') + '.min.js', // nombre del archivo de salida (elimina el prefijo 'private/' de la ruta del archivo de salida)
    chunkFileNames: '[name]-[hash].min.js', // nombre del archivo para chunks (si los hay)
    sourcemap: false,
  },
};