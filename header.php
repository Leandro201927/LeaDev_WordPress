<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <script type="importmap">
      {
        "imports": {
          "lil-gui": "https://cdn.skypack.dev/lil-gui",
          "tween": "https://cdn.skypack.dev/@tweenjs/tween.js",
          "three": "https://unpkg.com/three@0.156.1/build/three.module.js",
          "three/renderers/CSS3DRenderer": "https://unpkg.com/three@0.156.1/examples/jsm/renderers/CSS3DRenderer.js",
          "three/controls/OrbitControls": "https://unpkg.com/three@0.156.1/examples/jsm/controls/OrbitControls.js",
          "three/loaders/DRACOLoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/DRACOLoader.js",
          "three/loaders/GLTFLoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/GLTFLoader.js",
          "three/loaders/RGBELoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/RGBELoader.js",
          "three/loaders/EXRLoader": "https://unpkg.com/three@0.156.1/examples/jsm/loaders/EXRLoader.js",
          "three/addons/CurveModifier": "https://unpkg.com/three@0.156.1/examples/jsm/modifiers/CurveModifier.js",
          "three/postprocessing/EffectComposer": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/EffectComposer.js",
          "three/postprocessing/UnrealBloomPass": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/UnrealBloomPass.js",
          "three/postprocessing/GlitchPass": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/GlitchPass.js",
          "three/postprocessing/RenderPass": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/RenderPass.js",
          "three/postprocessing/ShaderPass": "https://unpkg.com/three@0.156.1/examples/jsm/postprocessing/ShaderPass.js",
          "three/shaders/GammaCorrectionShader": "https://unpkg.com/three@0.156.1/examples/jsm/shaders/GammaCorrectionShader.js",
          "three/shaders/RGBShiftShader": "https://unpkg.com/three@0.156.1/examples/jsm/shaders/RGBShiftShader.js",
          "three/shaders/FXAAShader": "https://unpkg.com/three@0.156.1/examples/jsm/shaders/FXAAShader.js",
          "three/math/MathUtils": "https://unpkg.com/three@0.156.1/src/math/MathUtils.js",
          "threejs/environment/RoomEnvironment": "https://unpkg.com/three@0.156.1/examples/jsm/environments/RoomEnvironment.js"
        }
      }
    </script>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>

    <!-- Script y Style globales -->
    <link href="<?php bloginfo('stylesheet_url'); ?>" rel="stylesheet"/>
    <script src="<?php bloginfo('template_url'); ?>/js/index.js"></script>

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
          <svg width="369" height="49" viewBox="0 0 369 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M109.859 0L108.852 1.74256L106.548 5.75044L106.219 6.33129L106.548 6.91215L122.502 34.5414H107.846H107.168L106.839 35.1222L104.535 39.1495L103.528 40.8727H105.522L131.467 40.892L133.461 40.8727L132.454 39.1301L110.866 1.74256L109.859 0ZM105.58 7.41555L104.573 9.15811L82.9851 46.565L81.9783 48.2882H83.9919H88.6194H89.297L89.6262 47.7074L105.58 20.0781L112.918 32.7601L113.228 33.3409H113.906H118.533H120.547L119.54 31.6177L106.587 9.15811L105.58 7.41555ZM105.503 22.3628L104.515 24.1054L91.543 46.5456L90.5362 48.2882H92.5498H135.746H137.74L136.733 46.5456L134.429 42.5378L134.081 41.9569H133.422H101.514L108.833 29.275L109.162 28.6941L108.833 28.1133L106.51 24.1054L105.503 22.3628Z" fill="url(#paint0_linear_448_30)"/>
            <path d="M35.5324 37.098V48H0V0H11.714V37.098H35.5324ZM41.4675 0H77V10.902H53.1815V18.5882H72.3144V29.4902H53.1815V37.098H77V48H41.4675V0Z" fill="white"/>
            <path d="M144.8 0.743991V47.5854H142.859V0.743991H144.8ZM187.158 0.743991H189.098V47.5854H187.626L154.77 4.42438V47.5854H152.83V0.743991H154.302L187.158 44.0388V0.743991ZM231.456 0.743991H233.397V47.5854H231.925L199.069 4.42438V47.5854H197.128V0.743991H198.6L231.456 44.0388V0.743991ZM264.044 0.0748291C275.554 0.0748291 287.733 10.0453 287.733 24.1647C287.733 38.284 275.554 48.2545 264.044 48.2545C252.535 48.2545 240.423 38.284 240.423 24.1647C240.423 10.0453 252.535 0.0748291 264.044 0.0748291ZM264.044 46.247C274.416 46.247 285.792 37.2803 285.792 24.1647C285.792 11.0491 274.416 2.08232 264.044 2.08232C253.739 2.08232 242.364 11.0491 242.364 24.1647C242.364 37.2803 253.739 46.247 264.044 46.247ZM329.823 0.743991H331.897L310.886 47.5854H309.882L288.937 0.743991H291.012L310.417 44.2395L329.823 0.743991ZM366.359 47.5854L360.404 34.269H333.503L327.548 47.5854H325.474L346.418 0.743991H347.422L368.434 47.5854H366.359ZM334.306 32.3954H359.601L346.954 4.0898L334.306 32.3954Z" fill="white"/>
            <defs>
            <linearGradient id="paint0_linear_448_30" x1="81.9783" y1="0" x2="137.74" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#00FF8F"/>
            <stop offset="1" stop-color="#00A1FF"/>
            </linearGradient>
            </defs>
          </svg>
        </a>

        <!-- Mobile menu (should be next of nav-supercontainer due to input:checked ~ .nav-supercontainer sass event) -->
        <label for="menu-btn" class="menu-icon"></label>
        <input type="checkbox" class="menu-btn" id="menu-btn"/>

        <div class="nav-supercontainer">
          <nav class="nav-container">
            <ul>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Servicios</a></li> 
              <li><a href="#">Acerca de</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </nav>
          <button class="fill primary">
            Contáctanos
          </button>
        </div>
      </div>
    </header>