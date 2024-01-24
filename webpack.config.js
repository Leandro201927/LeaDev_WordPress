const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');

// Obtiene el modo de los argumentos de la línea de comandos
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode: mode,

  // Puntos de entrada de tu aplicación
  entry: glob.sync('./private/js/parts/**/*.js').reduce((entries, filePath) => {
    // Utiliza el nombre del archivo relativo como clave
    const newFilePath = filePath.replace('./private/js/', '');  
    entries[newFilePath] = filePath;
    return entries;
  }, {}),

  // Configuración de salida
  output: {
    filename: (pathData) => {
      return pathData.chunk.name.replace('.js', '') + '.min.js';
    },
    path: path.resolve(__dirname, 'js'),
    publicPath: '/js/', // Ajusta la ruta pública según tu estructura
  },

  // Configuración de módulos y reglas
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },

  // Configuración de optimización
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    })],
  },

  // Configuración de resolución
  resolve: {
    alias: {
      // Aquí puedes agregar alias para tus módulos
    },
  },

  plugins: [
    // Puedes habilitar el Bundle Analyzer si es necesario
    // new BundleAnalyzerPlugin()
  ],
};