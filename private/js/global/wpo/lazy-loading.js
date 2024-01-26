/**
 * <img> Lazy Loading
 * @TODO use <img class="lazy" data-src""> instead <img src=""> to avoid load img by default.
 */

export default function LazyLoadingOptimizator() {
  document.addEventListener("DOMContentLoaded", function() {
    let lazyloadImages;
    let options = {
        root: null,
        threshold: 0,
        rootMargin: '200px'
    }

    // Función para observar las imágenes
    function observeImages(images) {
      let imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            let image = entry.target;
            image.src = image.dataset.src;
            image.classList.remove("lazy");
            imageObserver.unobserve(image);
          }
        });
      }, options);

      images.forEach(function(image) {
        imageObserver.observe(image);
      });
    }

    if ('IntersectionObserver' in window) {
      //Lazy load with Intersection Observer API
      lazyloadImages = document.querySelectorAll(".lazy");
      observeImages(lazyloadImages);

      // Observa los cambios en el DOM
      let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            let newImages = mutation.target.querySelectorAll(".lazy");
            observeImages(newImages);
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      //Lazy load with scroll event listener
      //Supports < IE v11
      let lazyloadThrottleTimeout;
      lazyloadImages = document.querySelectorAll(".lazy");
      
      function lazyload () {
        if(lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }    

        lazyloadThrottleTimeout = setTimeout(function() {
          let scrollTop = window.pageYOffset;

          lazyloadImages.forEach(function(img) {
            if(img.offsetTop < (window.innerHeight + scrollTop)) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
            }
          });

          if(lazyloadImages.length == 0) { 
            document.removeEventListener("scroll", lazyload);
            window.removeEventListener("resize", lazyload);
            window.removeEventListener("orientationChange", lazyload);
          }
        }, 20);
      }

      document.addEventListener("scroll", lazyload);
      window.addEventListener("resize", lazyload);
      window.addEventListener("orientationChange", lazyload);
    }
  })
}