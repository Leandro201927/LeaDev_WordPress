<?php
  // Deshabilitar los logs en WordPress (comentar las 6 líneas siguientes si deseas ver los errores en la página)
  ini_set('log_errors','On');
  ini_set('display_errors','Off');
  ini_set('error_reporting', E_ALL );
  define('WP_DEBUG', false);
  define('WP_DEBUG_LOG', true);
  define('WP_DEBUG_DISPLAY', false);
?>