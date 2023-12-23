const browserSync = require('browser-sync').create();

browserSync.init({
  proxy: 'http://localhost/',
  files: './**/*',
  notify: false,
  serveStaticOptions: {
    extensions: ['html'], // pretty urls
    setHeaders: function (res, path, stat) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
});