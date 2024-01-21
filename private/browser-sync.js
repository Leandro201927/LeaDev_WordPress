const browserSync = require('browser-sync').create();

browserSync.init({
  proxy: 'http://192.168.1.7/',
  files: './**/*',
  notify: false,
  serveStaticOptions: {
    extensions: ['html'], // pretty urls
    setHeaders: function (res, path, stat) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
  }
});
