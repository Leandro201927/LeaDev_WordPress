// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentSlide = 0;
    const totalSlides = 3;
    let isAnimating = false;
    let loadingProgress = 0;
    let loadingComplete = false;
    
    // Referencias a elementos DOM
    const slides = document.querySelectorAll('.slide');
    const sliderIndicator = document.querySelector('.raw-indicator');
    const lineCurrentActiveTrack = document.querySelector('.line-current-active-track');
    const nextButton = document.querySelector('button.next');
    const accordions = document.querySelectorAll('.accordion-container');
    const sliderImageContainers = document.querySelectorAll('.slider-image-container');
    
    // Inicializar la primera diapositiva
    slides[0].classList.add('show');
    
    // Sistema de lazy loading avanzado
    function initLazyLoading() {
        let lazyloadImages;
        let options = {
            root: null,
            threshold: 0,
            rootMargin: '200px'
        };

        // Función para observar las imágenes
        function observeImages(images) {
            let imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let image = entry.target;
                        image.src = image.dataset.src;
                        image.classList.remove("lazy");
                        image.classList.add("loaded");
                        imageObserver.unobserve(image);
                    }
                });
            }, options);

            images.forEach(function(image) {
                imageObserver.observe(image);
            });
        }

        if ('IntersectionObserver' in window) {
            // Lazy load con Intersection Observer API
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
            // Fallback para navegadores antiguos
            let lazyloadThrottleTimeout;
            lazyloadImages = document.querySelectorAll(".lazy");
            
            function lazyload() {
                if(lazyloadThrottleTimeout) {
                    clearTimeout(lazyloadThrottleTimeout);
                }    

                lazyloadThrottleTimeout = setTimeout(function() {
                    let scrollTop = window.pageYOffset;

                    lazyloadImages.forEach(function(img) {
                        if(img.offsetTop < (window.innerHeight + scrollTop)) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
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
    }
    
    // Inicializar lazy loading
    initLazyLoading();
    
    // Mostrar animaciones iniciales
    setTimeout(() => {
        document.querySelectorAll('.animate').forEach(el => {
            el.classList.add('show');
        });
    }, 500);
    
    // Configurar Three.js con sistema de loading
    setupThreeJS();
    
    // Sistema de loading
    function updateLoadingProgress(progress) {
        loadingProgress = progress;
        const progressLabelElement = document.getElementById("progress-label-loaderscreen");
        progressLabelElement.innerText = `Cargando entorno 3D: ${progress}%`;
        
        // Cuando el loading llegue al 100%, ocultamos el loader después de un breve retraso
        if (progress >= 100 && !loadingComplete) {
            loadingComplete = true;
            setTimeout(() => {
                const loaderElement = document.getElementById("loaderElement3d");
                loaderElement.style.opacity = "0";
                setTimeout(() => {
                    loaderElement.style.display = "none";
                }, 500);
            }, 1000);
        }
    }
    
    // Event Listeners
    
    // Manejo del slider
    document.addEventListener('wheel', handleScroll);
    
    // Botón siguiente en el slider de imágenes
    if (nextButton) {
        nextButton.addEventListener('click', handleNextImageSlide);
    }
    
    // Manejo de acordeones
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function() {
            if (!this.classList.contains('open')) {
                accordions.forEach(acc => {
                    acc.classList.remove('open');
                });
                this.classList.add('open');
            }
        });
    });
    
    // Botones de diálogo
    const dialogTriggers = document.querySelectorAll('#dialog-form-hubspot-trigger, #dialog-form-underconstruction-trigger');
    dialogTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            alert('Formulario de contacto - Esta funcionalidad estaría conectada a HubSpot en la versión completa');
        });
    });
    
    // Funciones
    
    function handleScroll(e) {
        if (isAnimating) return;
        
        isAnimating = true;
        
        if (e.deltaY > 0) {
            // Scroll hacia abajo
            if (currentSlide < totalSlides - 1) {
                changeSlide(currentSlide + 1);
            }
        } else {
            // Scroll hacia arriba
            if (currentSlide > 0) {
                changeSlide(currentSlide - 1);
            }
        }
        
        setTimeout(() => {
            isAnimating = false;
        }, 1000);
    }
    
    function changeSlide(newSlide) {
        // Ocultar slide actual
        slides[currentSlide].classList.remove('show');
        
        // Mostrar nuevo slide
        currentSlide = newSlide;
        slides[currentSlide].classList.add('show');
        
        // Actualizar indicador
        updateSlideIndicator();
        
        // Animar elementos del nuevo slide
        animateSlideElements(currentSlide);
        
        // Actualizar cámara en Three.js
        updateThreeJSCamera(currentSlide);
    }
    
    function updateSlideIndicator() {
        // Actualizar número de slide
        sliderIndicator.textContent = (currentSlide + 1).toString().padStart(2, '0');
        
        // Actualizar línea de progreso
        const progress = (currentSlide / (totalSlides - 1)) * 100;
        lineCurrentActiveTrack.style.height = `${33.33 * (currentSlide + 1)}%`;
    }
    
    function animateSlideElements(slideIndex) {
        const elements = slides[slideIndex].querySelectorAll('.animate');
        elements.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('show');
            }, i * 100);
        });
    }
    
    function handleNextImageSlide() {
        const currentVisible = document.querySelector('.slider-image-container.show');
        const currentIndex = Array.from(sliderImageContainers).indexOf(currentVisible);
        const nextIndex = (currentIndex + 1) % sliderImageContainers.length;
        
        currentVisible.classList.remove('show');
        sliderImageContainers[nextIndex].classList.add('show');
    }
    
    // Three.js setup
    function setupThreeJS() {
        // Configuración básica de Three.js
        const scene1 = new THREE.Scene();
        const scene2 = new THREE.Scene();
        
        // Configuración de cámaras
        const camera1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Configuración de renderizadores
        const renderer1 = new THREE.WebGLRenderer({
            canvas: document.getElementById('webgl1'),
            antialias: true,
            alpha: true
        });
        
        const renderer2 = new THREE.WebGLRenderer({
            canvas: document.getElementById('webgl2'),
            antialias: true,
            alpha: true
        });
        
        renderer1.setSize(window.innerWidth, window.innerHeight);
        renderer2.setSize(window.innerWidth, window.innerHeight);
        
        // Configuración de luces
        const ambientLight1 = new THREE.AmbientLight(0xffffff, 0.5);
        scene1.add(ambientLight1);
        
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(5, 5, 5);
        scene1.add(directionalLight1);
        
        const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.5);
        scene2.add(ambientLight2);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(5, 5, 5);
        scene2.add(directionalLight2);
        
        // Posición inicial de cámaras
        camera1.position.z = 5;
        camera2.position.z = 5;
        
        // Simulación de carga progresiva
        simulateLoading();
        
        // Crear geometrías básicas para demostración
        // En la versión completa, aquí se cargarían los modelos 3D
        const geometry1 = new THREE.BoxGeometry(1, 1, 1);
        const material1 = new THREE.MeshStandardMaterial({
            color: 0x01B969,
            metalness: 0.3,
            roughness: 0.4
        });
        const cube1 = new THREE.Mesh(geometry1, material1);
        scene1.add(cube1);
        
        const geometry2 = new THREE.SphereGeometry(1, 32, 32);
        const material2 = new THREE.MeshStandardMaterial({
            color: 0x0085FF,
            metalness: 0.3,
            roughness: 0.4
        });
        const sphere = new THREE.Mesh(geometry2, material2);
        scene2.add(sphere);
        
        // Función para simular la carga progresiva de assets
        function simulateLoading() {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 5) + 1; // Incremento aleatorio entre 1-5%
                if (progress > 100) progress = 100;
                
                updateLoadingProgress(progress);
                
                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 150);
        }
        
        // Función de animación
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotación de objetos
            cube1.rotation.x += 0.01;
            cube1.rotation.y += 0.01;
            
            sphere.rotation.y += 0.01;
            
            // Renderizar escenas
            if (currentSlide === 0) {
                renderer1.render(scene1, camera1);
                document.getElementById('webgl1').style.opacity = 1;
                document.getElementById('webgl2').style.opacity = 0;
            } else {
                renderer2.render(scene2, camera2);
                document.getElementById('webgl1').style.opacity = 0;
                document.getElementById('webgl2').style.opacity = 1;
            }
        }
        
        // Manejar resize
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            camera1.aspect = width / height;
            camera1.updateProjectionMatrix();
            
            camera2.aspect = width / height;
            camera2.updateProjectionMatrix();
            
            renderer1.setSize(width, height);
            renderer2.setSize(width, height);
        });
        
        // Iniciar animación
        animate();
    }
    
    // Función para actualizar la cámara según el slide actual
    function updateThreeJSCamera(slideIndex) {
        // Esta función simularía las transiciones de cámara en la escena 3D
        // En la versión completa, aquí se manejarían las animaciones de cámara
        // y los cambios de escena según el slide actual
        console.log(`Cambiando a la vista 3D para el slide ${slideIndex + 1}`);
    }
});
