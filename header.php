<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>

    <!-- Script y Style globales -->
    <link href="<?php bloginfo('stylesheet_url'); ?>" rel="stylesheet"/>
    <script src="<?php bloginfo('template_url'); ?>/js/index.min.js"></script>

    <!-- Script de librerías -->
    <?php
      if(is_page('blogs')) { ?>
        <script src="<?php bloginfo('template_url'); ?>/js/lib/axios.min.js"></script>
      <?php
      }
    ?>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Google Material Symbol font-family -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" />
  </head>

  <body>
    <header>
      <div class="lock__ui">
        <a class="logo" href="<?php echo get_home_url(); ?>">
          <img class="lazy" data-src="<?php bloginfo('template_url'); ?>/assets/img/movier-instalaciones-logo.svg" alt="logo titulo movier"/>
        </a>

        <!-- Mobile menu (should be next of nav-supercontainer due to input:checked ~ .nav-supercontainer sass event) -->
        <label for="menu-btn" class="menu-icon"></label>
        <input type="checkbox" class="menu-btn" id="menu-btn"/>

        <div class="nav-supercontainer">
          
          <button class="fill primary">
            Contáctanos
          </button>
        </div>
      </div>
    </header>