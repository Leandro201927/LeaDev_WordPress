<!-- < Key generate > -->
<?php $component_key = uniqid(); ?>
<!-- < Styling > -->
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/homepage/hero/style.css">
<!-- < Component > -->
<section class="leadev-component-section part-homepage-hero" id="<?php echo $component_key; ?>">
  <canvas id="webgl1" class="webgl"></canvas>
  <canvas id="webgl2" class="webgl"></canvas>
  <video style="display: none;" id="movier-video" src="<?php bloginfo('template_url'); ?>/assets/3d/homepage/movier.mp4" width="19.2" height="10.8" playsinline webkit-playsinline></video>
  <div class="lock__ui">
    <div class="left">
      <div class="slider-container">
        <div class="slider-indicator animate horizontal-fade-reveal">
          <span id="raw-indicator" class="raw-indicator">01</span>
          <div class="line-container">
            <div class="track-line"></div>
            <div class="line-current-active-track"></div>
          </div>
          <p class="scroll-label">Scroll</p>
          <span id="scroll-down-arrow" class="material-symbols-outlined">
            arrow_back_ios
          </span>
        </div>
        <div class="slider-sections">
          <div class="slide slide-0">
            <span class="category-parent animate vertical-reveal">
              <span class="category"> Soluciones Digitales </span>
            </span>
            <h1>
              <span class="animate vertical-reveal">
                <span> Transforma tu </span>
              </span>
              <span class="animate vertical-reveal">
                <span> presencia en línea </span>
              </span>
            </h1>
            <p class="description animate vertical-fade-reveal">
              Desde la creación de páginas web especializadas en 3D, hasta la automatización de tu negocio con Inteligencia Artificial, en un sólo lugar.
            </p>
            <button class="fill primary animate vertical-fade-reveal">
              Contáctanos
            </button>
          </div>
          <div class="slide slide-1">
            <span class="category-parent animate vertical-reveal">
              <span class="category"> Servicios </span>
            </span>
            <div class="accordion-container animate vertical-fade-reveal">
              <div class="illustration">
                <img src="" alt="">
              </div>
              <div class="accordion-info">
                <div class="summary">
                  <h4 class="title">
                    Páginas web en 3D
                  </h4>
                  <div class="complete">
                    <p>
                      Nos destacamos por realizar páginas web en 3D de alta calidad para tu empresa o marca personal. Ac proin neque ut feugiat adipiscing in at ullamcorper integer vivamus alorem tincidunt posuere.
                    </p>
                    <button class="fill primary">
                      Solicitar servicio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="slide slide-2">
            <span class="category-parent animate vertical-reveal">
              <span class="category"> Soluciones Digitales </span>
            </span>
            <h1>
              <span class="animate vertical-reveal">
                <span> Transforma tu </span>
              </span>
              <span class="animate vertical-reveal">
                <span> presencia en línea </span>
              </span>
            </h1>
            <p class="description animate vertical-fade-reveal">
              Desde la creación de páginas web especializadas en 3D, hasta la automatización de tu negocio con Inteligencia Artificial, en un sólo lugar.
            </p>
            <button class="fill primary animate vertical-fade-reveal">
              Contáctanos
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- < Script > -->
<!-- <script type="module" src="<?php bloginfo('template_url'); ?>/js/3d/performance-monitor.js"></script> -->
<script src="<?php bloginfo('template_url'); ?>/js/controllers/slider-controller.js"></script>
<script src="<?php bloginfo('template_url'); ?>/js/3d/loader-handler.js?key=<?php echo $component_key; ?>&model3d=homepage&templateUrl=<?php bloginfo('template_url');?>&componentName=homepage/hero"></script>