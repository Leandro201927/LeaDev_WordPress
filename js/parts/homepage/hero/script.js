// import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader'
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
// import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
// import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// import * as TWEEN from 'tween';

import * as THREE from 'three';
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/loaders/GLTFLoader';
import { DRACOLoader } from 'three/loaders/DRACOLoader';
import { EffectComposer } from 'three/postprocessing/EffectComposer';
import { RenderPass } from 'three/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/shaders/GammaCorrectionShader';
import { RGBShiftShader } from 'three/shaders/RGBShiftShader';
import { FXAAShader } from 'three/shaders/FXAAShader';
import { OrbitControls } from 'three/controls/OrbitControls';
import { RoomEnvironment } from 'three/environment/RoomEnvironment';
import * as TWEEN from 'tween';

registerComponent(async () => {

  /**
   * 1. Key
   * 
   * @description Obtener el ID del key generado desde PHP extrayendo el src="" único de este script invocado.
   */
  const srcScript = new URL(import.meta.url); // document.currentScript.src equivalent when using module scripts. (<script type="module">)
  const queryParams = new URLSearchParams(srcScript.search);
  const uniqueId = queryParams.get('key');
	const templateUrl = queryParams.get('templateUrl');
	const componentName = queryParams.get('componentName');

  /**
   * 2. Global (component-scope) variables
   * 
   * @description Crear controles y lógica sólo para el contenedor con el id único
   */
  const parentEl = document.getElementById(uniqueId)
  const backgroundGradientMobile = parentEl.querySelector('.background-gradient-mobile')
  const sliderElement = parentEl.querySelector('.slider-container')
  const accordionParentElement = parentEl.querySelector('.slide-1')
  const sliderImageElement = parentEl.querySelector('.slide-2 .slider-image-supercontainer')
  new AccordionController(accordionParentElement)
  const sliderController = new SliderController(sliderElement)
  const sliderImageController = new SliderImageController(sliderImageElement)
  const clock = new THREE.Clock()
  const lookAt = new THREE.Vector3();
  
  /**
   * Screen
   */
  function getActualScreenSize() {
    if(window.innerWidth > 1366) return 'desktopL'
    else if(window.innerWidth <= 1366 && window.innerWidth > 1024) return 'desktopM'
    else if(window.innerWidth <= 1024 && window.innerWidth > 768) return 'desktopS'
    else if(window.innerWidth <= 768 && window.innerWidth > 425) return 'tablet'
    else return 'mobile';
  }
  let actualScreenSize = getActualScreenSize()
  console.log('actualscrensize', actualScreenSize)

  let activeScene = 1
  /**
   * Camera 1 properties
   */
  let camera1;
  const INITIAL_FRUSTRUM_SIZE = 45
  const camera1Props = {
    desktopL: {
      position: {
        x: 9.89600658416748,
        y: 13.16525993347168,
        z: 13.140523910522461
      },
      frustrumSizeCamera: 6, // @TODO
    },
    desktopM : {
      position: {
        x: 9.89600658416748,
        y: 13.16525993347168 + 0.25,
        z: 13.140523910522461 + 0.5
      },
      frustrumSizeCamera: 5.5,
    },
    desktopS: {
      // A este punto está literalmente centrada la escena
      position: {
        x: 9.89600658416748 + 3.5,
        y: 13.16525993347168 - 0.5,
        z: 13.140523910522461 + 0.5
      },
      frustrumSizeCamera: 10,
    },
    tablet: {
      // A este punto está literalmente centrada la escena
      position: {
        x: 9.89600658416748 + 4,
        y: 13.16525993347168 - 0.5,
        z: 13.140523910522461 + 0.5
      },
      frustrumSizeCamera: 10,
    },
    mobile: {
      // A este punto está literalmente centrada la escena
      position: {
        x: 9.89600658416748 + 4,
        y: 13.16525993347168 - 0.5,
        z: 13.140523910522461 + 0.5
      },
      frustrumSizeCamera: 10,
    }
  }
  /**
   * Camera 2 properties
   */
  let camera2;
  const camera2Props = {
    desktopL: {
      position: {
        x: 5.1674322498544223,
        y: 9,
        z: 13.312374668985601
      },
      lookAt: {
        x: -4.5,
        y: -0.5,
        z: 0
      },
      frustrumSizeCamera: 2
    },
    desktopM : {
      position: {
        x: 5.1674322498544223,
        y: 9,
        z: 13.312374668985601
      },
      lookAt: {
        x: -4.5,
        y: -0.5,
        z: 0
      },
      frustrumSizeCamera: 2
    },
    desktopS: {
      // A este punto está literalmente centrada la escena
      position: {
        x: 5.1674322498544223,
        y: 9,
        z: 13.312374668985601
      },
      lookAt: {
        x: -3.5,
        y: -1.5,
        z: 0
      },
      frustrumSizeCamera: 3
    },
    tablet: {
      // A este punto está literalmente centrada la escena
      position: {
        x: 5.1674322498544223,
        y: 9,
        z: 13.312374668985601
      },
      lookAt: {
        x: -3.5,
        y: -1.5,
        z: 0
      },
      frustrumSizeCamera: 3
    },
    mobile: {
      // A este punto está literalmente centrada la escena
      position: {
        x: 5.1674322498544223,
        y: 9,
        z: 13.312374668985601
      },
      lookAt: {
        x: -3.5,
        y: -1.15,
        z: 0
      },
      frustrumSizeCamera: 2.5
    }
  }

  // Canvas
  const canvas = parentEl.querySelector('canvas#webgl1')
  const canvas2 = parentEl.querySelector('canvas#webgl2')

  /**
   * Parent Slider logic
   */
  let currentActiveSlide = 0
  function onSlideChange(index) {
    if(index === 0) {
      if(currentActiveSlide === 1) {
        // crossfade to second canvas (laptop scene)
        const transitionEndHandle = () => {
          // Finished hiding the first canvas
          canvas.style.opacity = 1
          activeScene = 1
          canvas2.removeEventListener('transitionend', transitionEndHandle)
        }
        canvas2.addEventListener('transitionend', transitionEndHandle)
        /**
         * Scene 1: zoom camera IN
         */
        let start = { value: camera1Props[actualScreenSize].frustrumSizeCamera + 1.5 };
        let end = { value: camera1Props[actualScreenSize].frustrumSizeCamera };
        new TWEEN.Tween(start)
          .to(end, 1000) // Duración de la transición en milisegundos
          .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
          .onUpdate(function() {
            // Actualiza el frustumSize y la cámara en cada fotograma
            let newFrustumSize = start.value;
            const frustumHalfSize = newFrustumSize / 2;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            camera1.left = -frustumHalfSize * aspect;
            camera1.right = frustumHalfSize * aspect;
            camera1.top = frustumHalfSize;
            camera1.bottom = -frustumHalfSize;
            camera1.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
          })
          .start();
        /**
         * Scene 2: zoom camera OUT
         */
        let start2 = { value: camera2Props[actualScreenSize].frustrumSizeCamera };
        let end2 = { value: camera2Props[actualScreenSize].frustrumSizeCamera + 0.5 };
        new TWEEN.Tween(start2)
          .to(end2, 1000) // Duración de la transición en milisegundos
          .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
          .onUpdate(function() {
            // Actualiza el frustumSize y la cámara en cada fotograma
            let newFrustumSize = start2.value;
            const frustumHalfSize = newFrustumSize / 2;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            camera2.left = -frustumHalfSize * aspect;
            camera2.right = frustumHalfSize * aspect;
            camera2.top = frustumHalfSize;
            camera2.bottom = -frustumHalfSize;
            camera2.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
          })
          .start();
        canvas2.style.opacity = 0
        currentActiveSlide = index // currentActiveSlide -> 0
      }
    }
    if(index === 1) {
      if(currentActiveSlide === 0) {
        // crossfade to second canvas (laptop scene)
        const transitionEndHandle = () => {
          // Finished hiding the first canvas
          canvas2.style.opacity = 1
          activeScene = 2
          canvas.removeEventListener('transitionend', transitionEndHandle)
        }
        canvas.addEventListener('transitionend', transitionEndHandle)
        /**
         * Scene 1: zoom camera OUT
         */
        let start = { value: camera1Props[actualScreenSize].frustrumSizeCamera };
        let end = { value: camera1Props[actualScreenSize].frustrumSizeCamera + 1.5 };
        new TWEEN.Tween(start)
          .to(end, 1000) // Duración de la transición en milisegundos
          .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
          .onUpdate(function() {
            // Actualiza el frustumSize y la cámara en cada fotograma
            let newFrustumSize = start.value;
            const frustumHalfSize = newFrustumSize / 2;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            camera1.left = -frustumHalfSize * aspect;
            camera1.right = frustumHalfSize * aspect;
            camera1.top = frustumHalfSize;
            camera1.bottom = -frustumHalfSize;
            camera1.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
          })
          .start();
        /**
         * Scene 2: zoom camera IN
         */
        let start2 = { value: camera2Props[actualScreenSize].frustrumSizeCamera + 0.5 };
        let end2 = { value: camera2Props[actualScreenSize].frustrumSizeCamera };
        new TWEEN.Tween(start2)
          .to(end2, 1000) // Duración de la transición en milisegundos
          .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
          .onUpdate(function() {
            // Actualiza el frustumSize y la cámara en cada fotograma
            let newFrustumSize = start2.value;
            const frustumHalfSize = newFrustumSize / 2;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            camera2.left = -frustumHalfSize * aspect;
            camera2.right = frustumHalfSize * aspect;
            camera2.top = frustumHalfSize;
            camera2.bottom = -frustumHalfSize;
            camera2.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
          })
          .start();
        canvas.style.opacity = 0
      } else if(currentActiveSlide === 2) {
        enable3rdSectionAnimations('close')

        /**
         * Scene 2: zoom camera OUT
         */
        if(!(actualScreenSize === 'desktopS' || actualScreenSize === 'tablet' || actualScreenSize === 'mobile')) {
          // !! Only desktop animation !!
          const start = { value: camera2Props[actualScreenSize].frustrumSizeCamera - 0.5 };
          const end = { value: camera2Props[actualScreenSize].frustrumSizeCamera };
          new TWEEN.Tween(start)
            .to(end, 1000) // Duración de la transición en milisegundos
            .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
            .onUpdate(function() {
              // Actualiza el frustumSize y la cámara en cada fotograma
              let newFrustumSize = start.value;
              const frustumHalfSize = newFrustumSize / 2;
              const aspect = canvas.clientWidth / canvas.clientHeight;
              camera2.left = -frustumHalfSize * aspect;
              camera2.right = frustumHalfSize * aspect;
              camera2.top = frustumHalfSize;
              camera2.bottom = -frustumHalfSize;
              camera2.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
            })
            .start();
        }

        // Camera2 look at (in case if mobile side increased the camera up (look 'if(index === 2) ... new TWEEN.Tween.to(lookAt.y + 0.5)' below))
        new TWEEN.Tween(lookAt)
        .to({ y: camera2Props[actualScreenSize].lookAt.y }, 1000) // Duración de la transición en milisegundos
        .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
        .onUpdate(function() {
          // camera2.lookAt(lookAt)
          // camera2.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
        })
        .start();
      }

      currentActiveSlide = index // currentActiveSlide -> 1
    }
    if(index === 2) {
      enable3rdSectionAnimations('open', currentCompanyInSliderImage)

      /**
       * Scene 2: zoom camera OUT
       */
      if(!(actualScreenSize === 'desktopS' || actualScreenSize === 'tablet' || actualScreenSize === 'mobile')) {
        // !! Only desktop animation !!
        const start = { value: camera2Props[actualScreenSize].frustrumSizeCamera };
        const end = { value: camera2Props[actualScreenSize].frustrumSizeCamera - 0.5 };
        new TWEEN.Tween(start)
          .to(end, 1000) // Duración de la transición en milisegundos
          .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
          .onUpdate(function() {
            // Actualiza el frustumSize y la cámara en cada fotograma
            let newFrustumSize = start.value;
            const frustumHalfSize = newFrustumSize / 2;
            const aspect = canvas.clientWidth / canvas.clientHeight;
            camera2.left = -frustumHalfSize * aspect;
            camera2.right = frustumHalfSize * aspect;
            camera2.top = frustumHalfSize;
            camera2.bottom = -frustumHalfSize;
            camera2.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
          })
          .start();
      }
      // camera look at
      if(actualScreenSize === 'desktopS' || actualScreenSize === 'tablet' || actualScreenSize === 'mobile') {
        // !! Only mobile animation !!
        new TWEEN.Tween(lookAt)
        .to({ y: lookAt.y + 0.5 }, 1000) // Duración de la transición en milisegundos
        .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
        .onUpdate(function() {
          // camera2.lookAt(lookAt)
          // camera2.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
        })
        .start();
      }
      currentActiveSlide = index // currentActiveSlide -> 2
    }
  }
  sliderController.on('onslidechange', onSlideChange)

  /**
   * Slider Image logic
   */
  let currentCompanyInSliderImage = 'movier'
  sliderImageController.on('preslidechange', (index) => {
    shutDownLaptopScreen()
    const currentSlide = sliderImageElement.querySelector(`.slider-image-container-${index}`)
    console.log(index, currentSlide.classList)
    if(currentSlide.classList.contains('movier')) {
      currentCompanyInSliderImage = 'movier'
    } else if(currentSlide.classList.contains('cproc')) {
      currentCompanyInSliderImage = 'cproc'
    }
    console.log(currentCompanyInSliderImage)
  })
  sliderImageController.on('slidechange', (index) => {
    projectImgOrVideoInLaptopScreen(currentCompanyInSliderImage)
  })

  /**
   * Sizes
   */
  const sizes = {
    width: canvas2.clientWidth,
    height: canvas2.clientHeight
  }

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.physicallyCorrectLights = true; // hacer mas realista la luz
  renderer.toneMapping = THREE.LinearToneMapping
  renderer.toneMappingExposure = 1.04

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio); // Limit DPR to a maximum of 2
  const pmremGenerator = new THREE.PMREMGenerator( renderer );

  /**
   * Loaders
   */
  // Texture loader
  const textureLoader = new THREE.TextureLoader()

  // Draco loader
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath(`${templateUrl}/js/lib/draco/`)

  // GLTF loader
  const gltfLoader = new GLTFLoader()
  gltfLoader.setDRACOLoader(dracoLoader)

  const loadTexture = (url, flipY = false) => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          texture.flipY = flipY;
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve(texture);
        },
        undefined,
        (error) => reject(error)
      );
    });
  };

  /**
   * 
   * @param {() => void} preLoadScene2Resources preload 2nd scene resources 
   * @returns 
   */
  let envMap;
  let envMap2;
  let envMapWhite;
  async function loadScene1(preLoadScene2Resources) {
    let gltfModel, penroseTriangleMesh = []
    let mixer
    let splinePointsLength = 4, positions = [];
    let scene2Loaded = false

    // Scene
    const scene = new THREE.Scene()

    const baseColorMap = await loadTexture(`${templateUrl}/assets/3d/homepage/delivery_machine_4k_baked.jpg`)
    const crateBaseColorMap = await loadTexture(`${templateUrl}/assets/3d/homepage/crate_baked.jpg`)

    const crateBakedMaterial = new THREE.MeshBasicMaterial({
      map: crateBaseColorMap,
    });
    const bakedMaterial = new THREE.MeshBasicMaterial({
      map: baseColorMap,
    });

    /**
     * Environment
     */
    // envMap = await loadTexture(`${templateUrl}/assets/3d/homepage/kloppenheim_02_4k.jpg`)
    textureLoader.load(`${templateUrl}/assets/3d/homepage/kloppenheim_02_4k.jpg`, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      envMap2 = texture;
    })
    envMap = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

    // Crea una textura de color sólido
    const solidColorTexture = textureLoader.load(`${templateUrl}/assets/3d/homepage/white.png`, (texture) => {
      baseColorMap.flipY = false
      baseColorMap.colorSpace = THREE.SRGBColorSpace
      envMapWhite = texture
    })
    const penroseBaseMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texture1: { type: 't', value: solidColorTexture },
        texture2: { type: 't', value: baseColorMap },
        transition: { type: 'f', value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float transition;
        varying vec2 vUv;
        void main() {
          vec4 tex1 = texture2D(texture1, vUv);
          vec4 tex2 = texture2D(texture2, vUv);
          gl_FragColor = mix(tex1, tex2, transition);
          gl_FragColor.a = 1.0; // Asegura que la salida no sea transparente
        }
      `
    });
    const penroseLineEmisiveMaterial = new THREE.MeshPhongMaterial({
      emissive: 0x00FF8F,
      emissiveIntensity: 0
    })
    const generalNeonEmisiveMaterial = new THREE.MeshPhongMaterial({
      emissive: 0x00FF8F,
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0
    })
  
    const initialObjectsHidden = [] // Los objetos que vayan a ser escondidos debido a la animación del logo inicial, se encolarán acá para hacerlos aparecer después.
    let initialPenroseRotateAnimations, initialPenroseRotateActions = {}, initialPenroseRotateNameFilter = 'PenroseInitRotate';
    let spawnFactoryAnimations, spawnFactoryActions = {}, spawnFactoryNameFilter = [
      'SpawnUpperConveyorBelt', 'SpawnLowerConveyorBelt', 'SpawnLTransformMachine', 'SpawnTransformMachine', 'SpawnALogo', 'SpawnALogoContainer', 'SpawnTuNegocioCover', 'SpawnTuNegocio'
    ];
    let infiniteFactoryCycleAnimations, infiniteFactoryCycleActions = {}, infiniteFactoryCycleNameFilter = [
      'CycleTranslateUpperConveyorBelt', 'CycleTranslateLowerConveyorBelt', 'CicleFloatingLogoContainer', 'CicleFloatingLogo', 'CicleFloatingTuNegocioCover', 'CicleFloatingTuNegocio'
    ];
    let controlledManuallyAnimations, controlledManuallyActions = {}, controlledManuallyNameFilter = [
      'CrateAction', 'MegaphoneAction.001', 'AIBotAction', 'WWW_InternetAction'
    ];
  
    function beginConveyorItemsFlow() {
      let itemsInOrder = ['MegaphoneAction.001', 'AIBotAction', 'WWW_InternetAction']
      let assignedItem = 0
  
      function beginBoxTransformedPlusImplicatedItem() {
        // Logica del 'Crate' manual loop
        const cycleItemsHandler = (e) => {
          const actionName = e.action.getClip().name
          if(actionName === 'AIBotAction' || actionName === 'WWW_InternetAction' || actionName === 'MegaphoneAction.001') {
            mixer.removeEventListener('finished', cycleItemsHandler)
            assignedItem = assignedItem + 1 > itemsInOrder.length - 1 ? 0 : assignedItem + 1
            // beginBoxTransformedPlusImplicatedItem()
            beginCrate()
          }
        }
        mixer.addEventListener('finished', cycleItemsHandler)
  
        playAction(controlledManuallyActions, itemsInOrder[assignedItem])
      }
  
      function beginCrate() {
        // Logica del 'Crate' manual loop
        const cycleCrateHandler = (e) => {
          const actionName = e.action.getClip().name
          if(actionName === 'CrateAction') {
            mixer.removeEventListener('finished', cycleCrateHandler)
            beginBoxTransformedPlusImplicatedItem()
          }
        }
        mixer.addEventListener('finished', cycleCrateHandler)
        playAction(controlledManuallyActions, 'CrateAction')
      }
  
      beginCrate()
    }

    // Crear la luz puntual
    const lightPosition = {
      x: 20.8,
      y: 100,
      z: 28.6
    };

    const pointLight = new THREE.PointLight(0x0000FF, 10000, 100);
    pointLight.position.set(lightPosition.x, lightPosition.y, lightPosition.z);

    // Añadir la luz a la escena
    scene.add(pointLight);

    // // Añadir la posición de la luz al GUI
    // const gui = new dat.GUI({
    //   width: 400
    // })
    // const lightFolder = gui.addFolder('Light Position');
    // lightFolder.add(lightPosition, 'x', -100, 100).onChange(function(value) {
    //     pointLight.position.x = value;
    // });
    // lightFolder.add(lightPosition, 'y', -100, 100).onChange(function(value) {
    //     pointLight.position.y = value;
    // });
    // lightFolder.add(lightPosition, 'z', -100, 100).onChange(function(value) {
    //     pointLight.position.z = value;
    // });

    // Crear un raycaster
    const raycaster = new THREE.Raycaster();

    // Crear un vector2 para el mouse
    const mouse = new THREE.Vector2();
    const mouseEventCoordinates = new THREE.Vector2();

    // Añadir un event listener para el movimiento del mouse
    document.addEventListener('mousemove', onMouseMove, false);

    function onMouseMove(event) {
      // Calcular las coordenadas del mouse en la normalización del espacio (-1 a +1) para Raycaster
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseEventCoordinates.x = event.clientX
      mouseEventCoordinates.y = event.clientY
    }

    let TransformMachine_1, LTransformMachine_3
  
    new Promise((resolve, reject) => {
      canvas.style.opacity = 0
  
      gltfLoader.load(
        `${templateUrl}/assets/3d/homepage/delivery machine addon + animation.glb`,
        (gltf) => {
          gltfModel = gltf
          let totalChildren = gltf.scene.children.length;
          let count = 0;
  
          if(gltf.animations) {
            initialPenroseRotateAnimations = gltf.animations.filter(animation => animation.name === initialPenroseRotateNameFilter)
            spawnFactoryAnimations = gltf.animations.filter(animation => spawnFactoryNameFilter.includes(animation.name))
            infiniteFactoryCycleAnimations = gltf.animations.filter(animation => infiniteFactoryCycleNameFilter.includes(animation.name))
            controlledManuallyAnimations = gltf.animations.filter(animation => controlledManuallyNameFilter.includes(animation.name))
          }
  
          if(gltf.cameras.length) {
            const gltfCamera = gltf.cameras[0]
            // Obtén la posición y la rotación (en quaternión) de la cámara del GLTF
            // let position = gltfCamera.position;
            let position = new THREE.Vector3(camera1Props[actualScreenSize].position.x, camera1Props[actualScreenSize].position.y, camera1Props[actualScreenSize].position.z)
            console.log('camera1Positions[actualScreenSize]', camera1Props[actualScreenSize], actualScreenSize)
            let quaternion = gltfCamera.quaternion;
  
            // let factorMove = 3.5
            // position.y += factorMove - 2.4
            // position.x += factorMove
  
            // Asigna la posición y la rotación a tu cámara actual
            camera1.position.copy(position);
            camera1.quaternion.copy(quaternion);
          }
  
          gltf.scene.traverse((child) => {
            count++;
  
            if(child instanceof THREE.Mesh) {
              // console.log(child.name)

              child.material = bakedMaterial

              if(child.name.includes('Crate') || child.name.includes('Megaphone') || child.name.includes('AIBot') || child.name.includes('WWW_Internet')) {
                child.material = crateBakedMaterial
              }

              if(child.name === 'TransformMachine_1') {
                TransformMachine_1 = child
              }
              if(child.name === 'LTransformMachine_3') {
                LTransformMachine_3 = child
              }

              if(child.name === 'TransformMachine_1' || child.name === 'LTransformMachine_3') {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x00FF8F,
                  transparent: true,
                  opacity: 0.06,
                  envMap,
                  envMapIntensity: 1,
                  depthWrite: false,
                  side: THREE.FrontSide,
                  // envMapIntensity: 0.4
                })
              }

              if(child.name === 'WWW_Internet_3' || child.name === 'AIBot_3') {
                child.material = new THREE.MeshBasicMaterial({
                  color: 0x000000,
                })
              }

              // Penrose material
              if(child.name.includes('PenroseTriangle')) {
                penroseTriangleMesh.push(child)
                if(child.name === 'PenroseTriangle_1') {
                  child.material = penroseBaseMaterial
                } else {
                  child.material = penroseLineEmisiveMaterial
                }
              }
  
              // // Conveyor base transparency
              if(child.name === 'LowerConveyorBelt_1' || child.name === 'UpperConveyorBelt_1') {
                // child.material.color = new THREE.Color(0x333333)
                child.receiveShadow = true
                child.material = new THREE.MeshBasicMaterial({
                  color: 0x333333,
                  // envMap
                })
              }

              if(child.name === 'Megaphone_2' || child.name === 'AIBot_2' || child.name === 'WWW_Internet_2') {
                child.material = new THREE.MeshPhongMaterial({
                  emissive: 0x00FF8F,
                  emissiveIntensity: 1.5,
                  // transparent: true,
                  // opacity: 0
                })
              }
  
              let emissiveObjects = [
                'ALogo',
                'UpperConveyorBelt_2',
                'LowerConveyorBelt_2',
                'TransformMachine_2',
                'TuNegocioText',
                'LTransformMachine_2',
                'Crate_2',
              ]
              
              if(emissiveObjects.includes(child.name)) {
                child.material = generalNeonEmisiveMaterial
              }
  
              // Objetos iniciales a esconder
              let hideObjectList = [
                'Floor',
                'AIBot',
                'WWW_Internet',
                'Megaphone',
                'Crate',
                // 'TransformMachine',
                // 'LTransformMachine',
                'LowerConveyorBelt',
                'UpperConveyorBelt'
              ]
  
              if(hideObjectList.some(a => {
                return child.name.includes(a)
              })) {
                child.material.transparent = true
                child.material.opacity = 0
                initialObjectsHidden.push(child)
              }
            }
  
            if(count === totalChildren) {
              resolve();
            }
          })
  
          scene.add(gltf.scene)
        })
    }).then(() => {
      /**
       * Scene 2 preload
       * (load scehe2 resources in parallel)
       */
      preLoadScene2Resources()

      /**
       * Scene 1 animations
       */
      setupAnimations()
  
      function beginLogoHide() {
        setTimeout(() => {
          /**
           * UI
           */
          const header = document.querySelector('header')
          header.style.transform = 'translateY(0px)'
  
          mixer.addEventListener('finished', function(e) {
            const actionName = e.action.getClip().name
            if(actionName === 'PenroseInitRotate') {
              backgroundGradientMobile.classList.add('show') // smooth fade-in from background gradient in all sliders

              // Rotación terminada, hacer proceso de spawneo de fábrica
              /**
               * Materials (factory | opacity)
               */
              new TWEEN.Tween(penroseBaseMaterial.uniforms.transition)
              .to({ value: 1 }, 500) // transición durante 2000 ms
              .easing(TWEEN.Easing.Quadratic.InOut)
              .onComplete(() => {
              })
              .start();
    
            new TWEEN.Tween(penroseLineEmisiveMaterial)
              .to({ emissiveIntensity: 1.25 }, 500) // transición durante 2000 ms
              .easing(TWEEN.Easing.Quadratic.InOut)
              .onComplete(() => {
              })
              .start();
  
              initialObjectsHidden.forEach(child => {
                new TWEEN.Tween(child.material)
                .to({ opacity: 1 }, 700)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onComplete(() => {
                  
                })
                .start();
              })
            } else if (actionName === 'SpawnLTransformMachine') {
              playActions(infiniteFactoryCycleActions)
              sliderController.renderFirstSlide()
            }
          });
  
          /**
           * Materials (Penrose initial LOGO Animation)
           */
          playActions(initialPenroseRotateActions)
          playActions(spawnFactoryActions)
  
          /**
           * Camera
           */
          // Zoom
          let start = { value: INITIAL_FRUSTRUM_SIZE };
          let end = { value: camera1Props[actualScreenSize].frustrumSizeCamera };
          new TWEEN.Tween(start)
            .to(end, 1500) // Duración de la transición en milisegundos
            .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
            .onUpdate(function() {
              // Actualiza el frustumSize y la cámara en cada fotograma
              const newFrustumSize = start.value;
              const frustumHalfSize = newFrustumSize / 2;
              // camera1Props[actualScreenSize].frustrumSizeCamera = newFrustumSize

              camera1.left = -frustumHalfSize * aspect;
              camera1.right = frustumHalfSize * aspect;
              camera1.top = frustumHalfSize;
              camera1.bottom = -frustumHalfSize;
              camera1.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
            })
            .onComplete(function(){
              beginConveyorItemsFlow()
            })
            .start();
          // // Translate X
          // let factorMove = 3
          // new TWEEN.Tween(camera1.position)
          //   .to({ x: camera1.position.x - factorMove, y: camera1.position.y - (factorMove / 3) }, 1500) // transición durante 2000 ms
          //   .easing(TWEEN.Easing.Quadratic.InOut)
          //   .onComplete(() => {
          //   })
          //   .start();
        }, 1000)
      }; beginLogoHide()
  
      const loaderElement = loaderHandler.getLoaderParentElement()
      new TWEEN.Tween(loaderElement.style)
      .to({ opacity: 0 }, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onComplete(() => {
        loaderElement.style.display = 'none'
        canvas.style.opacity = 1
      })
      .start()
    })
  
    function playActions(actions) {
      Object.entries(actions).forEach(([key, value]) => {
        const action = value.action
        action.reset()
        action.setEffectiveTimeScale(1)
        action.play();
      });
    }
  
    function playAction(actions, actionName) {
      console.log('intentando reproducir accion', actionName)
      const action = actions[actionName].action
      // console.log('play singular encontrado', action)
      action.reset()
      action.setEffectiveTimeScale(1)
      action.play();
    }
  
    function setupAnimations() {
      /**
       * Setup de controlador de animaciones
       */
      mixer = new THREE.AnimationMixer(gltfModel.scene);
      mixer.timeScale = 1
      // Setup panel solar
      // spawnFactoryAnimations
      // 
  
      initialPenroseRotateAnimations.forEach((clip) => {
        let action = mixer.clipAction(clip)
  
        action.enabled = true;
        action.setLoop(THREE.LoopOnce)
        action.clampWhenFinished = true
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
  
        initialPenroseRotateActions[clip.name] = { action }
      })
  
      spawnFactoryAnimations.forEach((clip) => {
        let action = mixer.clipAction(clip)
  
        action.enabled = true;
        action.setLoop(THREE.LoopOnce)
        action.clampWhenFinished = true
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
  
        spawnFactoryActions[clip.name] = { action }
      })
  
      infiniteFactoryCycleAnimations.forEach(clip => {
        let action = mixer.clipAction(clip)
  
        action.enabled = true;
        action.setLoop(THREE.LoopRepeat)
        action.clampWhenFinished = true
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
  
        infiniteFactoryCycleActions[clip.name] = { action }
      })
  
      controlledManuallyAnimations.forEach(clip => {
        let action = mixer.clipAction(clip)
  
        action.enabled = true;
        action.setLoop(THREE.LoopOnce)
        action.clampWhenFinished = true
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(1);
  
        controlledManuallyActions[clip.name] = { action }
      })
    }
  
    /**
     * Sizes
     */
    const sizes = {
      width: canvas.clientWidth,
      height: canvas.clientHeight
    }
  
    function refreshSceneRenderer() {
      // Update sizes
      sizes.width = canvas.clientWidth
      sizes.height = canvas.clientHeight

      actualScreenSize = getActualScreenSize()
      let position = new THREE.Vector3(camera1Props[actualScreenSize].position.x, camera1Props[actualScreenSize].position.y, camera1Props[actualScreenSize].position.z);
      camera1.position.copy(position);
  
      const aspect = sizes.width / sizes.height;
      const frustumSize = camera1Props[actualScreenSize].frustrumSizeCamera
      const frustumHalfSize = frustumSize / 2; // Ajusta este valor según tus necesidades
  
      const left = -frustumHalfSize * aspect
      const right = frustumHalfSize * aspect
      const top = frustumHalfSize
      const bottom = -frustumHalfSize
  
      camera1.left = left;
      camera1.right = right;
      camera1.top = top;
      camera1.bottom = bottom;
      camera1.near = -100
      camera1.far = 1000
      camera1.updateProjectionMatrix()
  
      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      composer.setSize(sizes.width, sizes.height); // También actualiza el tamaño del composer
      renderer.setPixelRatio(window.devicePixelRatio)
    }
  
    window.addEventListener('resize', refreshSceneRenderer)
  
    /**
     * Camera
     */
    // Base camera
    const lookAt = new THREE.Vector3();
    // const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 150)
  
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const frustumSize = INITIAL_FRUSTRUM_SIZE // lejanía de la cámara
    const frustumHalfSize = frustumSize / 2;
  
    camera1 = new THREE.OrthographicCamera(
      -frustumHalfSize * aspect, // left
      frustumHalfSize * aspect, // right
      frustumHalfSize, // top
      -frustumHalfSize, // bottom
      -100, // near
      1000 // far
    );
  
    // camera.quaternion.x = 0.2801308418021325
    // camera.quaternion.y = 0.3644685994588807
    // camera.quaternion.z = 0.1159583736286828
    // camera.quaternion.w = 0.8804788510038735
  
    // camera.position.x = 8.597218021180728
    // camera.position.y = 11.927835302647004
    // camera.position.z = 12.494560430566109
  
    // lookAt.x = -25.4
    // lookAt.y = -2.7
    // lookAt.z = -0.7
  
    scene.add(camera1)
  
    // Controls
    // const controls = new OrbitControls(camera1, canvas)
    // controls.enableDamping = true
  
    // controls.addEventListener("change", event => {
    //   // extraer información de la cámara cuando orbit controls la altera
    //   console.log( `[Rotate] ${JSON.stringify(controls.object.quaternion)} \n [Position] ${JSON.stringify(controls.object.position)} \n [Scale] ${JSON.stringify(controls.object.scale)}` );
    // })
  
    // ---------------------------------------------- Post Processing -------------------------------------------------------
  
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio( 1 ); // ensure pixel ratio is always 1 for performance reasons
  
    // Create RenderPass
    const renderPass = new RenderPass(scene, camera1);
  
    // Bloom pass
    const unrealBloomPass = new UnrealBloomPass()
    unrealBloomPass.strength = 0.29 // 0.3
    unrealBloomPass.radius = 1 // 1.246
    unrealBloomPass.threshold = 0.754
  
    // Gamma Correction (make sRGB colors live again)
    const gammaCorrectionPass = new ShaderPass( GammaCorrectionShader );
  
    // Crea el pase de FXAA
    const fxaaPass = new ShaderPass(FXAAShader);
    // Configura el pase de FXAA
    fxaaPass.uniforms['resolution'].value.set(1 / sizes.width, 1 / sizes.height); // Configura la resolución
    fxaaPass.material.uniforms['resolution'].value.x = 1 / sizes.width;
    fxaaPass.material.uniforms['resolution'].value.y = 1 / sizes.height;
  
    // Shift RGB Pass
    const rgbShiftPass = new ShaderPass(RGBShiftShader)
    rgbShiftPass.uniforms.amount.value = 0.0015
    rgbShiftPass.uniforms.angle.value = 0.0
  
    // adding passes to composer
    composer.addPass(renderPass);
    composer.addPass(unrealBloomPass);
    composer.addPass(gammaCorrectionPass);
    composer.addPass(fxaaPass);

    function updateLightGradientRaycaster() {
      // Actualizar el picking ray con la cámara y las coordenadas del mouse
      raycaster.setFromCamera(mouse, camera1);

      // Calcular los objetos que intersectan el picking ray
      const intersects = raycaster.intersectObjects(scene.children);

      let found = false;
      for (let i = 0; i < intersects.length; i++) {
        // console.log(intersects[i].object.name)
        // Si el raycaster detecta el 'PenroseTriangle'
        if (intersects[i].object.name === 'PenroseTriangle_1' || intersects[i].object.name === 'PenroseTriangle_2' || intersects[i].object.name.includes('TransformMachine') || intersects[i].object.name.includes('LTransformMachine')) {
          found = true;
          break;
        }
      }

      // Si se encontró una intersección, mover el eje Y de la posición de la luz
      return found
    }

    /**
     * 1. parallel intensity + independent light :y always working on mousemouve
     * 2. portal color intensity on: transformMachine (up, left), LTransformMachine (center, right)
     */
    let canAnimateLightIntensityOut = true;
    let canAnimateLightIntensityIn = true;
    let found, prevFound;
    // Crear colores para la interpolación
    const colorStart = new THREE.Color(0x00FF8F);
    const colorEnd = new THREE.Color(0xabf7ff);

    // Crear un objeto para el destino de la interpolación
    const colorObject = {t: 0};

    // Crear un tween que interpole el color
    const tweenColor = new TWEEN.Tween(colorObject).to({t: 1}, 0); // 2000 ms = 2 segundos

    // Actualizar el color del material en cada frame
    tweenColor.onUpdate(function() {
      TransformMachine_1.material.color.lerpColors(colorStart, colorEnd, colorObject.t);
      LTransformMachine_3.material.color.lerpColors(colorStart, colorEnd, colorObject.t);
    });

    // Crear un tween que interpole el color de vuelta al color inicial
    const tweenColorBack = new TWEEN.Tween(colorObject).to({t: 0}, 100); // 500 ms = 0.5 segundos

    // Actualizar el color del material en cada frame
    tweenColorBack.onUpdate(function() {
      TransformMachine_1.material.color.lerpColors(colorStart, colorEnd, colorObject.t);
      LTransformMachine_3.material.color.lerpColors(colorStart, colorEnd, colorObject.t);
    });

    function tick() {
      // Mover el eje Y de la posición de la luz siempre
      let y = mouseEventCoordinates.y / window.innerHeight * 200 - 100;
      pointLight.position.setY(y);
      
      prevFound = found ? found : false;
      found = updateLightGradientRaycaster();
    
      if(found === false) {
        // Se estaba animando el gradiente y ahora debe animarse el lightFadeOut
        if(canAnimateLightIntensityOut) {
          canAnimateLightIntensityOut = false;
          new TWEEN.Tween(pointLight)
          .to({ intensity: 0 }, 250) // transición durante 2000 ms
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onComplete(() => {
            canAnimateLightIntensityOut = true;
          })
          .start(); 
        }
    
        // // Animar el cambio de color de vuelta al color inicial
        // if (!canAnimateColorChange) {
        //   canAnimateColorChange = true;
        //   tweenColorBack.start();
        // }
      } else if(found === true) {
        // No hay lightFade, y se va a animar
        // pointLight.intensity = 10000;
        if(canAnimateLightIntensityIn) {
          canAnimateLightIntensityIn = false;
          new TWEEN.Tween(pointLight)
          .to({ intensity: 10000 }, 250) // transición durante 2000 ms
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onComplete(() => {
            canAnimateLightIntensityIn = true;
          })
          .start(); 
        }
    
        // // Animar el cambio de color solo la primera vez que se encuentra una intersección
        // if (canAnimateColorChange) {
        //   canAnimateColorChange = false;
        //   tweenColor.start();
        // }
      }
    
      // Render using composer instead of renderer (for PostProcessing)
      composer.render();
    
      mixer && mixer.update( clock.getDelta() );
    }

    return {
      RAF_1: tick,
    }
  }

  function prepareScene2() {
    let gltfModel
    let mixer
    let composer
    let laptopAnimations, laptopActions = {}, laptopFilter = ['ScreenPlateAction', 'ScreenAction.001', 'ALogoAction'];
    let ArrowNext, ArrowPrev, Repeat
    let screenMesh
    let canHoverControls = true
    let actualLaptopScreenElement
    const controlsMaterial = new THREE.MeshPhongMaterial({
      emissive: 0x00FF8F,
      emissiveIntensity: 1.8,
      transparent: true,
      opacity: 0
    })

    // Scene
    const scene = new THREE.Scene()

    function playActions(actions) {
      Object.entries(actions).forEach(([key, value]) => {
        const action = value.action
        action.reset()
        action.setEffectiveTimeScale(1)
        action.play();
      });
    }

    function playActionsInReverse(actions) {
      Object.entries(actions).forEach(([key, value]) => {
        const action = value.action
				let duration = action.getClip().duration;

				action.reset()
				action.time = duration;

				action.setEffectiveTimeScale(-1)
				action.play();
      });
    }

    function updateRepetirControl(shouldDisable) {
      if(!Repeat) return;
      if(shouldDisable) {
        Repeat.visible = false
        canHoverControls = false
      } else {
        Repeat.visible = true
        canHoverControls = true
      }
    }

    function shutDownLaptopScreen() {
      screenMesh.material = new THREE.MeshBasicMaterial({
        color: 0x282c24
      }) // videoMaterial;
    }

    function projectImgOrVideoInLaptopScreen(company) {
      if(!company) return;

      let texture;
      if(company === 'movier') {
        // const video = document.getElementById('movier-video');
        const video = document.createElement('video');
        video.src = `${templateUrl}/assets/3d/homepage/movier.mp4`;
        video.crossOrigin = 'anonymous'
        video.play();
        video.muted = true;
        
        actualLaptopScreenElement = video

        texture = new THREE.VideoTexture(video);
        updateRepetirControl(false)
      } else if('cproc') {
        const image = document.getElementById('cproc-img');
        actualLaptopScreenElement = image

        texture = new THREE.TextureLoader().load(image.src);
        updateRepetirControl(true)
      }
      
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.flipY = false;

      // Shader for VideoTexture with brightness and contrast tweaks
      THREE.ShaderLib['customVideoShader'] = {
        uniforms: {
          'tDiffuse': { type: 't', value: null },
          'brightness': { type: 'f', value: 0 },
          'contrast': { type: 'f', value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float brightness;
          uniform float contrast;
          varying vec2 vUv;
          void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            color.rgb += brightness;
            if (contrast > 0.0) {
              color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;
            } else {
              color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;
            }
            gl_FragColor = color;
          }
        `,
      };

      // Crea tu material con el shader personalizado
      const customMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib['customVideoShader'].uniforms),
        vertexShader: THREE.ShaderLib['customVideoShader'].vertexShader,
        fragmentShader: THREE.ShaderLib['customVideoShader'].fragmentShader,
      });

      // Asigna la textura de video al material
      customMaterial.uniforms['tDiffuse'].value = texture;

      // Ajusta el brillo y el contraste
      customMaterial.uniforms['brightness'].value = -0.3; // Ajusta este valor para cambiar el brillo
      customMaterial.uniforms['contrast'].value = -0.4; // Ajusta este valor para cambiar el contraste

      screenMesh.material = customMaterial // videoMaterial;
    }

    function enable3rdSectionAnimations(mode, company = null) {
      if(mode === 'open') {
        playActions(laptopActions)

        screenMesh.material = new THREE.MeshBasicMaterial({
          color: 0x000000
        })

        const onLaptopScreenOpened = (e) => {
          const actionName = e.action.getClip().name
          if(actionName === 'ScreenAction.001') {
            // Alumbrar controles
            new TWEEN.Tween(controlsMaterial)
              .to({ opacity: 1, emissiveIntensity: 1.8 }, 250)
              .easing(TWEEN.Easing.Quadratic.Out)
              .start();

            // Rotación terminada
            if(screenMesh) {
              projectImgOrVideoInLaptopScreen(company)
            }

            mixer.removeEventListener('finished', onLaptopScreenOpened);
          }
        }

        mixer.addEventListener('finished', onLaptopScreenOpened);
      } else if(mode === 'close') {
        playActionsInReverse(laptopActions)

        new TWEEN.Tween(controlsMaterial)
          .to({ opacity: 0, emissiveIntensity: 0 }, 250)
          .easing(TWEEN.Easing.Quadratic.Out)
          .start();

        if(screenMesh) {
          screenMesh.material = new THREE.MeshBasicMaterial({
            color: 0x000000
          })
        }
      }
    }

    function preLoadResources() {
      const bakedMap = textureLoader.load(`${templateUrl}/assets/3d/homepage/laptop_4k_baked.jpg`, () => {
        bakedMap.flipY = false
        bakedMap.colorSpace = THREE.SRGBColorSpace
      })
      const generalNeonEmisiveMaterial = new THREE.MeshPhongMaterial({
        emissive: 0x00FF8F,
        emissiveIntensity: 1.8,
      })

      new Promise((resolve, reject) => {
        gltfLoader.load(
          `${templateUrl}/assets/3d/homepage/105-laptop.glb`,
          (gltf) => {
            gltfModel = gltf
            let totalChildren = gltf.scene.children.length;
            let count = 0;
    
            if(gltf.animations) {
              laptopAnimations = gltf.animations.filter(animation => laptopFilter.includes(animation.name))
            }
    
            gltf.scene.traverse((child) => {
              count++;
    
              if(child instanceof THREE.Mesh) {
                console.log(child.name)
    
                child.material = new THREE.MeshBasicMaterial({
                  map: bakedMap
                })
    
                if(child.name === 'Plane002_1') {
                  child.material = new THREE.MeshStandardMaterial({
                    color: 0x3C3C3C,
                    envMap: envMap2,
                  })
                }
    
                if(child.name === 'Plane002_2') {
                  child.material = generalNeonEmisiveMaterial
                }
                if(child.name === 'ALogo') {
                  child.material = generalNeonEmisiveMaterial
                }

                if(child.name === 'RaycastHoverArrowPrev' || child.name === 'RaycastHoverArrowNext' || child.name === 'RaycastHoverRepeat') {
                  child.material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0
                  })
                }

                if(child.name === 'ArrowNext' || child.name === 'ArrowPrev' || child.name === 'Repeat') {
                  switch(child.name) {
                    case 'ArrowNext':
                      ArrowNext = child
                      break;
                    case 'ArrowPrev':
                      ArrowPrev = child
                      break;
                    case 'Repeat':
                      Repeat = child
                      break;
                  }
                  child.material = controlsMaterial
                }

                if(child.name === 'Screen') {
                  screenMesh = child
                }
              }
    
              if(count === totalChildren) {
                resolve();
              }
            })
    
            scene.add(gltf.scene)
          })
      }).then(() => {
        setupAnimations()
      })
    
      function setupAnimations() {
        /**
         * Setup de controlador de animaciones
         */
        mixer = new THREE.AnimationMixer(gltfModel.scene);
        mixer.timeScale = 2
    
        laptopAnimations.forEach((clip) => {
          let action = mixer.clipAction(clip)
    
          action.enabled = true;
          action.setLoop(THREE.LoopOnce)
          action.clampWhenFinished = true
          action.setEffectiveTimeScale(1);
          action.setEffectiveWeight(1);
    
          laptopActions[clip.name] = { action }
        })
      }
    
      function refreshSceneRenderer() {
        // Update sizes
        sizes.width = canvas2.clientWidth
        sizes.height = canvas2.clientHeight

        actualScreenSize = getActualScreenSize()
    
        let position = new THREE.Vector3(camera2Props[actualScreenSize].position.x, camera2Props[actualScreenSize].position.y, camera2Props[actualScreenSize].position.z);
        camera2.position.copy(position);

        lookAt.x = camera2Props[actualScreenSize].lookAt.x
        // Debido a que en el onSlideChange (index === 2) se hace un lookAt.y + 0.5 para hacer que el portatil quepa en la pantalla movil, al hacer
        // un resize bruscamente, el lookAt pierde el 0.5, por eso hacemos la validación acá si es el 2do slide y está en modo mobile la escena.
        lookAt.y = (actualScreenSize === 'desktopS' || actualScreenSize === 'tablet' || actualScreenSize === 'mobile') && currentActiveSlide === 2 ? camera2Props[actualScreenSize].lookAt.y + 0.5 : camera2Props[actualScreenSize].lookAt.y
        lookAt.z = camera2Props[actualScreenSize].lookAt.z

        camera2.lookAt(
          lookAt.x,
          lookAt.y,
          lookAt.z
        )

        // Update camera
        const aspect = sizes.width / sizes.height;
        const frustumHalfSize = camera2Props[actualScreenSize].frustrumSizeCamera / 2; // Ajusta este valor según tus necesidades
    
        const left = -frustumHalfSize * aspect
        const right = frustumHalfSize * aspect
        const top = frustumHalfSize
        const bottom = -frustumHalfSize
    
        camera2.left = left;
        camera2.right = right;
        camera2.top = top;
        camera2.bottom = bottom;
        camera2.near = -100
        camera2.far = 1000
        camera2.updateProjectionMatrix()
    
        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        composer.setSize(sizes.width, sizes.height); // También actualiza el tamaño del composer
        renderer.setPixelRatio(window.devicePixelRatio)
      }
    
      window.addEventListener('resize', refreshSceneRenderer)
    
      /**
       * Camera
       */
      // Base camera
      // const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 150)
    
      const aspect = sizes.width / sizes.height;
      const frustumSize = camera2Props[actualScreenSize].frustrumSizeCamera; // lejanía de la cámara
      const frustumHalfSize = frustumSize / 2;
    
      camera2 = new THREE.OrthographicCamera(
        -frustumHalfSize * aspect, // left
        frustumHalfSize * aspect, // right
        frustumHalfSize, // top
        -frustumHalfSize, // bottom
        -100, // near
        1000 // far
      );
      
      lookAt.x = camera2Props[actualScreenSize].lookAt.x
      lookAt.y = camera2Props[actualScreenSize].lookAt.y
      lookAt.z = camera2Props[actualScreenSize].lookAt.z
    
      camera2.position.set(
        camera2Props[actualScreenSize].position.x,
        camera2Props[actualScreenSize].position.y,
        camera2Props[actualScreenSize].position.z
      )

      camera2.rotation.order = 'XYZ'
      camera2.rotation.set(
        0,
        0,
        0
      )

      camera2.lookAt(
        lookAt.x,
        lookAt.y,
        lookAt.z
      )
    
      scene.add(camera2)

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas2,
        antialias: true
      })
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(window.devicePixelRatio)
      // renderer.autoClear = false; // ¡Importante!
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.physicallyCorrectLights = true; // hacer mas realista la luz
      renderer.toneMapping = THREE.LinearToneMapping
      renderer.toneMappingExposure = 1.04
    
      // ---------------------------------------------- Post Processing -------------------------------------------------------
    
      composer = new EffectComposer(renderer);
      composer.setSize(sizes.width, sizes.height)
      composer.setPixelRatio( 1 ); // ensure pixel ratio is always 1 for performance reasons
    
      // Create RenderPass
      const renderPass = new RenderPass(scene, camera2);
    
      // Bloom pass
      const unrealBloomPass = new UnrealBloomPass()
    
      unrealBloomPass.strength = 0.22
      unrealBloomPass.radius = 0.2
      unrealBloomPass.threshold = 1
    
      // Gamma Correction (make sRGB colors live again)
      const gammaCorrectionPass = new ShaderPass( GammaCorrectionShader );
    
      // Crea el pase de FXAA
      const fxaaPass = new ShaderPass(FXAAShader);
      // Configura el pase de FXAA
      fxaaPass.uniforms['resolution'].value.set(1 / sizes.width, 1 / sizes.height); // Configura la resolución
      fxaaPass.material.uniforms['resolution'].value.x = 1 / sizes.width;
      fxaaPass.material.uniforms['resolution'].value.y = 1 / sizes.height;
    
      // Shift RGB Pass
      const rgbShiftPass = new ShaderPass(RGBShiftShader)
      rgbShiftPass.uniforms.amount.value = 0.0015
      rgbShiftPass.uniforms.angle.value = 0.0
    
      // adding passes to composer
      composer.addPass(renderPass);
      composer.addPass(unrealBloomPass);
      composer.addPass(gammaCorrectionPass);
    }

    /**
     * Animate
     */
    const LERP_SPEED = 0.08
		const CALIBRATE_ANGLE = 0
		const ROTATE_SENSITIVITY = 18
		const pointer = { x: 0, y: 0 };

    const LOOKAT_Y_POWER = 0.1
    const LOOKAT_Y_OFFSET = 0.02

		/**
     * Controles de laptop flotantes
     * ---------- Logica -----------
     */
    let tween = null;
		window.addEventListener('mousemove', (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
		});
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh = null;
    // Agregar un event listener para el movimiento del mouse
    window.addEventListener('mousemove', (event) => {
      // Calcular las coordenadas del mouse en la normalización del espacio del dispositivo (-1 a +1)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }, false);
    // Agregar un event listener para el click
    window.addEventListener('click', () => {
      // Actualizar el rayo del raycaster
      raycaster.setFromCamera(mouse, camera2);

      // Obtener los objetos que intersectan con el rayo
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === 'RaycastHoverArrowNext') {
          // Ejecutar la acción para ArrowNext
          sliderImageController.nextPage()
          console.log('arrownext')
        } else if (intersects[i].object.name === 'RaycastHoverArrowPrev') {
          // Ejecutar la acción para ArrowPrev
          sliderImageController.prevPage()
          console.log('arrowprev')
        } else if (intersects[i].object.name === 'RaycastHoverRepeat') {
          // Ejecutar la acción para Repeat
          try {
            actualLaptopScreenElement.pause();
            actualLaptopScreenElement.currentTime = '0';
            actualLaptopScreenElement.play();
          } catch(e) {
            console.warn('No es un video.')
          }
        }
      }
    }, false);

    function tick() {
      if(gltfModel) {
        gltfModel.scene.rotation.y += (((pointer.x) - gltfModel.scene.rotation.y * ROTATE_SENSITIVITY) - CALIBRATE_ANGLE) * (LERP_SPEED * 0.008); // -> 0.008 DISMINUYE LA VELOCIDAD, ENTRE MAS PEQUEÑO MENOR LA VELOCIDAD
        const vertRotationModel = ((((pointer.y * LOOKAT_Y_POWER) - lookAt.y) * 0.5) * LERP_SPEED) - LOOKAT_Y_OFFSET;
        // lookAt.y += vertRotationModel // @TODO
			  camera2.lookAt(lookAt)
      }

      /**
       * Controllers logic (RAF)
       */
      let selectedMesh = null;
      // Actualizar el rayo del raycaster
      raycaster.setFromCamera(mouse, camera2);
      // Obtener los objetos que intersectan con el rayo
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === 'RaycastHoverArrowPrev' || intersects[i].object.name === 'RaycastHoverArrowNext' || intersects[i].object.name === 'RaycastHoverRepeat') {
          // Cambiar el cursor y escalar el objeto
          document.body.style.cursor = 'pointer';
          const objectName = intersects[i].object.name;
          switch(objectName) {
            case 'RaycastHoverArrowPrev':
              selectedMesh = ArrowPrev;
              break;
            case 'RaycastHoverArrowNext':
              selectedMesh = ArrowNext;
              break;
            case 'RaycastHoverRepeat':
              if(!canHoverControls) {
                // Si está deshabilitado el control 'Repetir' debido a updateRepetirControl(), no debería mostrarse un cursor: pointer. 
                document.body.style.cursor = 'default';
              }
              selectedMesh = Repeat;
              break;
          }
          break;
        }
      }
      
      if (selectedMesh) {
        if (hoveredMesh !== selectedMesh) {
          if (hoveredMesh && (!tween || !tween.isPlaying())) {
            tween = new TWEEN.Tween(hoveredMesh.scale)
              .to({ x: 1, y: 1, z: 1 }, 250)
              .easing(TWEEN.Easing.Quadratic.Out)
              .start();
          }
          hoveredMesh = selectedMesh;
          tween = new TWEEN.Tween(hoveredMesh.scale)
            .to({ x: 1.15, y: 1.15, z: 1.15 }, 250)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();
        }
      } else {
        document.body.style.cursor = 'default';
        if (hoveredMesh && (!tween || !tween.isPlaying())) {
          tween = new TWEEN.Tween(hoveredMesh.scale)
            .to({ x: 1, y: 1, z: 1 }, 500)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
              hoveredMesh = null; // Restablecer hoveredMesh cuando no hay objeto seleccionado
            })
            .start();
        }
      }

      composer && composer.render();
      mixer && mixer.update( clock.getDelta() );
    }

    return {
      RAF_2: tick,
      preLoadResources,
      enable3rdSectionAnimations,
      projectImgOrVideoInLaptopScreen,
      shutDownLaptopScreen
    }
  };
  
  /**
   * Animate
   */  
  const { RAF_2, preLoadResources, enable3rdSectionAnimations, projectImgOrVideoInLaptopScreen, shutDownLaptopScreen } = prepareScene2()
  const { RAF_1 } = await loadScene1(preLoadResources)

  const tick = () => {
    TWEEN.update()

    if(activeScene === 1 && RAF_1) RAF_1()
    else if(activeScene === 2 && RAF_2) RAF_2()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }; tick()
})