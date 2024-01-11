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
          <svg width="463" height="79" viewBox="0 0 463 79" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M58.0879 60.3859V78.1314H0V0H19.1499V60.3859H58.0879ZM67.7905 0H125.878V17.7455H86.9404V30.2568H118.218V48.0023H86.9404V60.3859H125.878V78.1314H67.7905V0Z" fill="white"/>
            <path d="M181.842 0L180.213 2.8195L176.485 9.30435L175.952 10.2442L176.485 11.184L202.299 55.8887H178.584H177.487L176.955 56.8286L173.227 63.3447L171.598 66.1329H174.825L216.804 66.1642L220.031 66.1329L218.401 63.3134L183.471 2.8195L181.842 0ZM174.919 11.9985L173.289 14.818L138.359 75.3433L136.73 78.1314H139.988H147.475H148.572L149.104 77.1916L174.919 32.4869L186.792 53.0066L187.293 53.9464H188.389H195.877H199.135L197.506 51.1582L176.548 14.818L174.919 11.9985ZM174.793 36.1836L173.195 39.0031L152.206 75.312L150.577 78.1314H153.835H223.727H226.954L225.325 75.312L221.597 68.8271L221.033 67.8873H219.968H168.34L180.182 47.3676L180.714 46.4277L180.182 45.4879L176.422 39.0031L174.793 36.1836Z" fill="url(#paint0_linear_289_10)"/>
            <path d="M266.183 78.1314H238.735V0H266.183C290.057 0 306.398 15.5752 306.398 39.0657C306.398 63.1946 289.163 78.1314 266.183 78.1314ZM257.885 17.7455V60.3859H266.183C279.716 60.3859 287.248 51.8323 287.248 39.0657C287.248 36.1294 286.865 33.4484 286.099 30.7674C282.78 21.4478 275.503 17.7455 266.183 17.7455H257.885ZM318.271 0H376.359V17.7455H337.421V30.2568H368.699V48.0023H337.421V60.3859H376.359V78.1314H318.271V0ZM441.213 0H462.15L430.872 78.1314H411.722L380.444 0H401.254L421.297 56.3006L441.213 0Z" fill="white"/>
            <defs>
              <linearGradient id="paint0_linear_289_10" x1="136.73" y1="0" x2="226.954" y2="0" gradientUnits="userSpaceOnUse">
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