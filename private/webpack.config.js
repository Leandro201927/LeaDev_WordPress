const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const glob = require('glob');

let entries = {};
// Busca todos los archivos .js en el directorio 'private/js/parts' y los agrega como puntos de entrada
glob.sync('./private/js/**/*.js').forEach(filePath => {
  let entry = filePath.replace('/private/js/', '');
  entries[entry] = filePath;
});

module.exports = {
  mode: 'production',

  // Puntos de entrada de tu aplicación
  entry: entries,

  // Configuración de salida
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'js'),
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
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },

  // Configuración de optimización
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  // Configuración de resolución
  resolve: {
    alias: {
      // Aquí puedes agregar alias para tus módulos
    }
  },

  plugins: [
    // new BundleAnalyzerPlugin()
  ]
};

// const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// module.exports = {
//   mode: 'production',

//   // Punto de entrada de tu aplicación
//   entry: './private/js/parts/homepage/hero/script.js',

//   // Configuración de salida
//   output: {
//     filename: 'script_wbpck.min.js',
//     path: path.resolve(__dirname, 'js'),
//   },

//   // Configuración de módulos y reglas
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /(node_modules)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//     ]
//   },

//   // Configuración de optimización
//   optimization: {
//     minimize: true,
//     minimizer: [new TerserPlugin()],
//   },

//   // Configuración de resolución
//   resolve: {
//     alias: {
//       // Aquí puedes agregar alias para tus módulos
//     }
//   },

//   plugins: [
//     new BundleAnalyzerPlugin()
//   ]
// };