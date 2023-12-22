const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

// Función para obtener todos los archivos JavaScript en un directorio y sus subdirectorios
function getJavaScriptFiles(dir, files = {}) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Ignora el directorio 'private/js/lib'
      if (filePath !== path.resolve(__dirname, 'private/js/lib')) {
        getJavaScriptFiles(filePath, files);
      }
    } else if (file.endsWith('.js')) {
      const name = path.relative(path.join(__dirname, 'private/js'), filePath).replace(/\.js$/, '');
      files[name] = filePath;
    }
  });
  return files;
}

// Usa la función para obtener los archivos JavaScript
const entry = getJavaScriptFiles(path.resolve(__dirname, 'private/js'));

module.exports = {
  // Usa el objeto de entrada que acabamos de crear
  entry: entry,
  output: {
    // Genera los archivos de salida en el directorio 'dist/js'
    path: path.resolve(__dirname, 'js'),
    // Usa el nombre del archivo de entrada para el archivo de salida
    filename: '[name].min.js',
  },
  // Permitir invocacion de scripts hacia localhost:3000
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
      // Recargar la página automáticamente al encontrar cambios
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        proxy: 'http://localhost/', // Este debería ser la URL de tu aplicación WordPress
        files: '**/*', // Observa todos los archivos de tu proyecto
        notify: false
      })
    ],
  },
};