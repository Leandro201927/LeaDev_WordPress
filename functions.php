<?php
  // Deshabilitar los logs en WordPress (comentar las 6 líneas siguientes si deseas ver los errores en la página)
  ini_set('log_errors','On');
  ini_set('display_errors','Off');
  ini_set('error_reporting', E_ALL );
  define('WP_DEBUG', false);
  define('WP_DEBUG_LOG', true);
  define('WP_DEBUG_DISPLAY', false);

  function remove_block_css() {
    wp_dequeue_style( 'wp-block-library' );
  }
  add_action( 'wp_enqueue_scripts', 'remove_block_css', 100 );

  function recaptcha_verify_callback() {
    $recaptcha_secret_key = '6LdI3VwpAAAAAI5TxUHclisaAABrZfvxcr_2tfoW';
    $token = $_POST['token'];
    
    // Crea una solicitud HTTP a la API de reCAPTCHA para verificar el token.
    $response = wp_remote_post('https://www.google.com/recaptcha/api/siteverify', array(
      'body' => array(
        'secret' => $recaptcha_secret_key,
        'response' => $token
      )
    ));

    if (is_wp_error($response)) {
      // Maneja el error de la solicitud HTTP de forma adecuada.
      return;
    }
    
    $response_body = json_decode(wp_remote_retrieve_body($response));
    
    if ($response_body->success) {
      // El token se verificó con éxito, puedes realizar acciones adicionales aquí.
      // Por ejemplo, guardar el token en la base de datos o permitir que se envíe el formulario.
      // ...
      
      // Devuelve una respuesta JSON con éxito.
      wp_send_json_success('Verificación reCAPTCHA exitosa');
    } else {
      // La verificación del token falló, puedes manejarlo de acuerdo a tus necesidades.
      // Por ejemplo, mostrar un error al usuario o bloquear el envío del formulario.
      // ...
      
      // Devuelve una respuesta JSON con error.
      wp_send_json_error('Error en la verificación reCAPTCHA');
    }
  }

  // Registra la función como un punto final AJAX en WordPress.
  add_action('wp_ajax_recaptcha_verify', 'recaptcha_verify_callback');
  add_action('wp_ajax_nopriv_recaptcha_verify', 'recaptcha_verify_callback');

  // if (substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip')) {
  //   ob_start("ob_gzhandler");
  // } else {
  //   ob_start();
  // }
?>