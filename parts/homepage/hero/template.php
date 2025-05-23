<!-- < Key generate > -->
<?php $component_key = uniqid(); ?>
<!-- < Styling > -->
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/homepage/hero/style.css">
<!-- < Component > -->
<section class="leadev-component-section part-homepage-hero" id="<?php echo $component_key; ?>">
  <div class="background-gradient-mobile"></div>
  <canvas id="webgl1" class="webgl"></canvas>
  <canvas id="webgl2" class="webgl"></canvas>
  <!-- <video style="display: none;" id="movier-video" src="<?php bloginfo('template_url'); ?>/assets/3d/homepage/movier.mp4" width="19.2" height="10.8" playsinline webkit-playsinline></video> -->
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
          <svg id="scroll-down-arrow" width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6.35101 6.35101L1 11.702" stroke="white" stroke-width="1.34154"></path>
          </svg>
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
                <span> <span class="gradient-green-blue"> presencia </span> en línea </span>
              </span>
            </h1>
            <p class="description animate vertical-fade-reveal">
              Desde la creación de páginas web especializadas en 3D, hasta la automatización de tu negocio con Inteligencia Artificial, en un sólo lugar.
            </p>
            <button class="fill primary animate vertical-fade-reveal" id="dialog-form-hubspot-trigger">
              Contáctanos
            </button>
          </div>
          <div class="slide slide-1">
            <span class="category-parent animate vertical-reveal">
              <span class="category"> Servicios </span>
            </span>
            <div class="accordions-supercontainer">
              <div class="accordion-container open animate vertical-fade-reveal">
                <div class="illustration">
                  <img class="lazy" data-src="<?php bloginfo('template_url'); ?>/assets/img/homepage/www_internet-removebg-preview.webp" alt="">
                </div>
                <div class="accordion-info">
                  <div class="summary">
                    <div class="content-title">
                      <div class="tag available hide-expanded">
                        <div class="circle-tag"></div>
                          Disponible
                        </div>
                        <div class="title-subcontainer">
                          <h4 class="title">
                            Páginas web en <span class="green"> 3D </span>
                          </h4>
                          <div class="arrow-container">
                          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.58301 1.5L7.99967 8.5L14.4163 1.5" stroke="#01B969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="complete">
                      <p>
                      Nos destacamos por realizar páginas web en 3D de alta calidad destacables para los buscadores, para tu empresa o marca personal. <span class="green"> Sé diferente a tu competencia, y escoge 3D. </span> ¡Contáctanos para una cotización gratis!
                      </p>
                      <button class="fill primary" id="dialog-form-hubspot-trigger">
                        Solicitar servicio
                      </button>
                      <!-- <button class="fill blank">
                        Ver más
                      </button> -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="accordion-container animate vertical-fade-reveal">
                <div class="illustration">
                  <img class="lazy" data-src="<?php bloginfo('template_url'); ?>/assets/img/homepage/ai_bot-removebg-preview.webp" alt="">
                </div>
                <div class="accordion-info">
                  <div class="summary">
                    <div class="content-title">
                      <div class="tag unavailable hide-expanded">
                        <div class="circle-tag"></div>
                          Próximamente
                        </div>
                        <div class="title-subcontainer">
                          <h4 class="title">
                          <span class="green"> Inteligencia artificial </span> para marketing
                          </h4>
                          <div class="arrow-container">
                          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.58301 1.5L7.99967 8.5L14.4163 1.5" stroke="#01B969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="complete">
                      <p>
                        Podrás <span class="green"> reinventar tus estrategias </span> de marketing gracias a la potencia de la inteligencia artificial. Prepárate para una revolución en la forma en que te conectas con tu audiencia.
                      </p>
                      <button class="fill blank" id="dialog-form-underconstruction-trigger">
                        Notificarme
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="accordion-container animate vertical-fade-reveal">
                <div class="illustration">
                  <img class="lazy" data-src="<?php bloginfo('template_url'); ?>/assets/img/homepage/megaphone-removebg-preview.webp" alt="">
                </div>
                <div class="accordion-info">
                  <div class="summary">
                    <div class="content-title">
                      <div class="tag unavailable hide-expanded">
                        <div class="circle-tag"></div>
                          Próximamente
                        </div>
                        <div class="title-subcontainer">
                          <h4 class="title">
                          <span class="green"> Automatizacion </span> de redes sociales y contenido
                          </h4>
                          <div class="arrow-container">
                          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.58301 1.5L7.99967 8.5L14.4163 1.5" stroke="#01B969" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div class="complete">
                      <p>
                        Podrás simplificar tu vida digital con nuestra automatización de redes sociales y contenido. <span class="green"> Libera tiempo mientras mantenemos tu presencia online </span> dinámica y relevante.
                      </p>
                      <button class="fill blank" id="dialog-form-underconstruction-trigger">
                        Notificarme
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="slide slide-2">
            <span class="category-parent animate vertical-reveal">
              <span class="category"> Obras realizadas </span>
            </span>
            <div class="slider-image-supercontainer animate vertical-fade-reveal">
              <div class="slider-image-container slider-image-container-1 movier show">
                <div class="image-container">
                  <img class="lazy" data-src="<?php bloginfo('template_url'); ?>/assets/img/homepage/movier-instalaciones-home.webp" alt="">
                </div>
                <div class="title-content">
                  <p>
                    Movier Instalaciones
                  </p>
                  <div class="tag fill primary">
                    3D
                  </div>
                  <div class="tag fill primary">
                    Automatización
                  </div>
                </div>
                <div class="description">
                <p> Para Movier, desarrollamos una página web innovadora en 3D que destaca por su diseño altamente competitivo y su rendimiento excepcional. Nuestra atención meticulosa a la optimización SEO garantiza una visibilidad óptima en los motores de búsqueda, asegurando que su presencia en línea sea tanto impactante como estratégica. </p>
                </div>
              </div>
              <div class="slider-image-container slider-image-container-2 cproc">
                <div class="image-container">
                  <img id="cproc-img" class="lazy" data-src="<?php bloginfo('template_url'); ?>/assets/img/homepage/cproc-dashboard.webp" alt="">
                </div>
                <div class="title-content">
                  <p>
                    CPROC
                  </p>
                  <div class="tag fill primary">
                    Automatización
                  </div>
                  <div class="tag fill primary">
                    Nativa
                  </div>
                </div>
                <div class="description">
                  <p> Ac proin 2 neque ut feugiat adipiscing in at ullamcorper integer commodo nisl enim risus mollis mattis nascetur <span class="green"> ornare scelerisque</span>. </p>
                </div>
              </div>
              <button class="next animate vertical-fade-reveal">
                Siguiente
                <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6.35101 6.35101L1 11.702" stroke="white" stroke-width="1.34154"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- < Script > -->
<!-- <script type="module" src="<?php bloginfo('template_url'); ?>/js/3d/performance-monitor.js"></script> -->
<!-- <script src="<?php bloginfo('template_url'); ?>/js/controllers/accordion-controller.js"></script> -->
<!-- <script src="<?php bloginfo('template_url'); ?>/js/controllers/slider-controller.js"></script> -->
<script src="<?php bloginfo('template_url'); ?>/js/parts/homepage/hero/script.min.js?key=<?php echo $component_key; ?>&model3d=homepage&templateUrl=<?php bloginfo('template_url');?>&componentName=homepage/hero"></script>