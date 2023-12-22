<!-- < Key generate > -->
<?php $component_key = uniqid(); ?>
<!-- < Styling > -->
<link rel="stylesheet" href="<?php bloginfo('template_url'); ?>/parts/homepage/hero/style.css">
<!-- < Component > -->
<section class="leadev-component-section part-homepage-hero" id="<?php echo $component_key; ?>">
  <canvas id="webgl1" class="webgl"></canvas>
  <canvas id="webgl2" class="webgl"></canvas>
  <div class="logo-3js">
    <svg width="953" height="161" viewBox="0 0 953 161" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M119.698 124.433V161H0V0H39.4608V124.433H119.698ZM139.691 0H259.389V36.567H179.152V62.348H243.605V98.915H179.152V124.433H259.389V161H139.691V0Z" fill="white"/>
      <path d="M548.505 161H491.944V0H548.505C597.699 0 631.372 32.0948 631.372 80.5C631.372 130.221 595.858 161 548.505 161ZM531.405 36.567V124.433H548.505C576.39 124.433 591.912 106.807 591.912 80.5C591.912 74.4493 591.123 68.9248 589.544 63.4003C582.704 44.1961 567.709 36.567 548.505 36.567H531.405ZM655.838 0H775.536V36.567H695.299V62.348H759.752V98.915H695.299V124.433H775.536V161H655.838V0ZM909.176 0H952.32L887.868 161H848.407L783.954 0H826.835L868.137 116.015L909.176 0Z" fill="white"/>
    </svg>
  </div>
  <!-- <div class="lock__ui">
    <div class="left">
      
    </div>
  </div> -->
</section>
<!-- < Script > -->
<script src="<?php bloginfo('template_url'); ?>/js/3d/performance-monitor.min.js"></script>
<script src="<?php bloginfo('template_url'); ?>/js/3d/loader-handler.min.js?key=<?php echo $component_key; ?>&model3d=homepage&templateUrl=<?php bloginfo('template_url');?>&componentName=homepage/hero"></script>