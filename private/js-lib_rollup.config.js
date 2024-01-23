import resolve from '@rollup/plugin-node-resolve';
import multiInput from 'rollup-plugin-multi-input';
import { rollupImportMapPlugin } from 'rollup-plugin-import-map';
import { terser } from "rollup-terser";
import copy from 'rollup-plugin-copy';
import path from 'path';

export default {
  input: [
    'private/js/lib/**/*.js', // patrón que coincide con todos los archivos .js en el directorio private/js
    '!private/js/**/*.min.js' // ignora los archivos .min.js (usar rollup-plugin-copy más abajo para pasarlos directamente)
  ],
  plugins: [
    multiInput.default(), // primero el plugin de multi-input
    // rollupImportMapPlugin('rollup-importmap-3d.json'), // luego el plugin de importmap
    resolve({ // luego el plugin de node-resolve
      browser: true,
    }),
    terser(), // sigue utilizando el plugin terser para la minificación
    copy({
      targets: [
        {
          src: 'private/js/**/*.wasm',
          dest: 'js',
          rename: (name, extension, fullPath) => {
            console.log('oe soy yo :) - ', name, extension, fullPath)
            return fullPath.replace('private/js/', '')
          } // mantiene la estructura de directorios original
        }
      ]
    })
  ],
  output: {
    dir: 'js', // directorio de salida
    format: 'esm',
    entryFileNames: chunkInfo => chunkInfo.name.replace('private/js/', '') + '.min.js', // nombre del archivo de salida (elimina el prefijo 'private/' de la ruta del archivo de salida)
    chunkFileNames: '[name]-[hash].min.js', // nombre del archivo para chunks (si los hay)
    sourcemap: false,
  },
};