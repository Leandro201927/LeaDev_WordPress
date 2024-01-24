const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const glob = require('glob');

module.exports = {
  mode: 'production',

  // Puntos de entrada de tu aplicación
  entry: {
    // Utiliza el nombre del archivo relativo como clave y el path completo como valor
    ...glob.sync('./private/js/parts/**/*.js').reduce((entries, filePath) => {
      const newFilePath = filePath.replace('./private/js/', '');
      entries[newFilePath] = path.resolve(__dirname, filePath);
      return entries;
    }, {}),
  },

  // Configuración de salida
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'js'),
    publicPath: '/js/', // Agrega esta línea para indicar la ruta pública de tus archivos generados
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
    minimizer: [new TerserPlugin()],
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