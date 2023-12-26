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
import { GLTFLoader } from 'three/loaders/GLTFLoader';
import { RGBELoader } from 'three/loaders/RGBELoader';
import { DRACOLoader } from 'three/loaders/DRACOLoader';
import { EffectComposer } from 'three/postprocessing/EffectComposer';
import { RenderPass } from 'three/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/postprocessing/UnrealBloomPass';
import { GlitchPass } from 'three/postprocessing/GlitchPass';
import { ShaderPass } from 'three/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/shaders/GammaCorrectionShader';
import { RGBShiftShader } from 'three/shaders/RGBShiftShader';
import { FXAAShader } from 'three/shaders/FXAAShader';
import { MathUtils } from 'three/math/MathUtils';
import { OrbitControls } from 'three/controls/OrbitControls';
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
  const sliderElement = parentEl.querySelector('.slider-container')
  const sliderController = new SliderController(sliderElement)

  // function setupSlider() {
  //   setTimeout(() => {
  //     console.log('sisass', sliderController)
  //   }, 3000)
  // }; setupSlider()

  let gltfModel, penroseTriangleMesh = []
  let mixer
  let splinePointsLength = 4, positions = [];
  let FRUSTRUM_SIZE = 45 // 6.5

  // Canvas
  const canvas = parentEl.querySelector('canvas#webgl1')

  // Scene
  const scene = new THREE.Scene()
  // scene.background = new THREE.Color(0x7cb8d2)

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

  const loadTexture = (url) => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          texture.flipY = false;
          texture.colorSpace = THREE.SRGBColorSpace;
          resolve(texture);
        },
        undefined,
        (error) => reject(error)
      );
    });
  };

  const baseColorMap = textureLoader.load(`${templateUrl}/assets/3d/homepage/delivery_machine_4k_baked.jpg`, () => {
    baseColorMap.flipY = false
    baseColorMap.colorSpace = THREE.SRGBColorSpace
  });

  const bakedMaterial = new THREE.MeshBasicMaterial({
    map: baseColorMap,
  });
  const shadowPortalAlphaMap = textureLoader.load(`${templateUrl}/assets/3d/homepage/shadow.png`, () => {
    shadowPortalAlphaMap.flipY = false
    shadowPortalAlphaMap.colorSpace = THREE.SRGBColorSpace
  })
  const portalShadowMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF8F, transparent: true, alphaMap: shadowPortalAlphaMap, opacity: 1 })

  const boxTransformedProjectionAlphaMap = await loadTexture(`${templateUrl}/assets/3d/homepage/alphamap proyection.png`)
  const boxTransformedProjectionMaterial = new THREE.MeshBasicMaterial({
    color: 0x00FF8F, transparent: true, alphaMap: boxTransformedProjectionAlphaMap, opacity: 0.3, depthWrite: false
  })
  // const shadow = new THREE.Mesh(
  //   new THREE.PlaneGeometry(3, 3, 10, 10),
  //   new THREE.MeshBasicMaterial({ color: 0x00FF8F, transparent: true, alphaMap: bumpMap, opacity: 1 })
  // )
  // shadow.position.z = - 0.25
  // // shadow.rotation.x = - Math.PI * 0.5
  // scene.add(shadow)

  /**
   * Environment
   */
  let envmap;
  const hdrEquirect = new RGBELoader().load(
    `${templateUrl}/assets/3d/homepage/kloppenheim_02_4k.hdr`,
    (texture) => {
      hdrEquirect.mapping = THREE.EquirectangularReflectionMapping;
      envmap = texture
      scene.environment = envmap
    }
  );

  // Crea una textura de color sólido
  const solidColorTexture = textureLoader.load(`${templateUrl}/assets/3d/homepage/white.png`, () => {
    baseColorMap.flipY = false
    baseColorMap.colorSpace = THREE.SRGBColorSpace
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
    'SpawnUpperConveyorBelt', 'SpawnLowerConveyorBelt', 'SpawnLTransformMachine', 'SpawnTransformMachine'
  ];
  let infiniteFactoryCycleAnimations, infiniteFactoryCycleActions = {}, infiniteFactoryCycleNameFilter = [
    'CycleTranslateUpperConveyorBelt', 'CycleTranslateLowerConveyorBelt'
  ];
  let controlledManuallyAnimations, controlledManuallyActions = {}, controlledManuallyNameFilter = [
    'CrateAction', 'BoxTransformedCycleTranslate', 'MegaphoneAction.001', 'AIBotAction', 'WWW_InternetAction'
  ];

  function beginConveyorItemsFlow() {
    let itemsInOrder = ['AIBotAction', 'WWW_InternetAction', 'MegaphoneAction.001']
    let assignedItem = 0

    function beginBoxTransformedPlusImplicatedItem() {
      // Logica del 'Crate' manual loop
      const cycleItemsHandler = (e) => {
        const actionName = e.action.getClip().name
        if(actionName === 'BoxTransformedCycleTranslate') {
          console.log('terminó el BoxTransformedCycleTranslate')
          mixer.removeEventListener('finished', cycleItemsHandler)
          assignedItem = assignedItem + 1 > itemsInOrder.length - 1 ? 0 : assignedItem + 1
          // beginBoxTransformedPlusImplicatedItem()
          beginCrate()
        }
      }
      mixer.addEventListener('finished', cycleItemsHandler)

      playAction(controlledManuallyActions, 'BoxTransformedCycleTranslate')
      playAction(controlledManuallyActions, itemsInOrder[assignedItem])
    }

    function beginCrate() {
      // Logica del 'Crate' manual loop
      const cycleCrateHandler = (e) => {
        const actionName = e.action.getClip().name
        if(actionName === 'CrateAction') {
          console.log('terminó el crate')
          mixer.removeEventListener('finished', cycleCrateHandler)
          beginBoxTransformedPlusImplicatedItem()
        }
      }
      mixer.addEventListener('finished', cycleCrateHandler)
      playAction(controlledManuallyActions, 'CrateAction')
    }

    beginCrate()
  }

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
          let position = gltfCamera.position;
          let quaternion = gltfCamera.quaternion;

          let factorMove = 3.5
          position.y += factorMove - 2.4
          position.x += factorMove
          // position.y += 5

          // Asigna la posición y la rotación a tu cámara actual
          camera.position.copy(position);
          camera.quaternion.copy(quaternion);
        }

        gltf.scene.traverse((child) => {
          count++;

          if(child instanceof THREE.Mesh) {
            console.log(child.name)

            child.material = bakedMaterial

            // Hologram effect items
            if(child.name.includes('Megaphone') || child.name.includes('AIBot') || child.name.includes('WWW_Internet')) {
              child.material = new THREE.MeshStandardMaterial({
                color: 0x00FF8F,
                transparent: true,
                opacity: 0.01,
                depthWrite: true,
                side: THREE.DoubleSide,
                envMapIntensity: 0.4
              })
            }
            if(child.name === 'WWW_Internet_3' || child.name === 'AIBot_3') {
              child.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
              })
            }
            if(child.name === 'BoxTransformed_3') {
              child.material = boxTransformedProjectionMaterial
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

            // Conveyor base transparency
            if(child.name === 'LowerConveyorBelt_1' || child.name === 'UpperConveyorBelt_1') {
              child.material = new THREE.MeshPhysicalMaterial({
                transmission: 1,
                roughness: 0.2,
              })
            }

            if(child.name === 'Crate_2') {
              child.material = new THREE.MeshBasicMaterial({
                color: 0x02c972
              })
            }

            let emissiveObjects = [
              // 'PenroseTriangle_2',
              'UpperConveyorBelt_2',
              'LowerConveyorBelt_2',
              'TransformMachine_1',
              'TransformMachine_3',
              'LTransformMachine_2',
              'LTransformMachine_3',
              'Crate_3',
              'BoxTransformed_2',
              'Megaphone_2',
              'AIBot_2',
              'WWW_Internet_2'
            ]
            
            if(emissiveObjects.includes(child.name)) {
              child.material = generalNeonEmisiveMaterial
            }

            if(child.name === 'TransformMachine_1' || child.name === 'LTransformMachine_3') {
              child.material = portalShadowMaterial
            }

            // Objetos iniciales a esconder
            let hideObjectList = [
              'Floor',
              'AIBot',
              'WWW_Internet',
              'Megaphone',
              'BoxTransformed',
              'Crate',
              'TransformMachine',
              'LTransformMachine',
              'LowerConveyorBelt',
              'UpperConveyorBelt'
            ]

            if(hideObjectList.some(a => {
              // console.log(a, child.name, a.includes(child.name))
              return child.name.includes(a)
            })) {
              // console.log('sisas', child.name)
              // const transparentBasicMaterial = new THREE.MeshBasicMaterial({
              //   transparent: true,
              //   opacity: 0
              // })
              // child.material = transparentMaterial
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
            beginConveyorItemsFlow()
            sliderController.renderFirstSlide()
          }
          // Aquí puedes poner el código que quieras ejecutar cuando la animación termine
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
        let start = { value: FRUSTRUM_SIZE };
        let end = { value: 6.5 };
        new TWEEN.Tween(start)
          .to(end, 1500) // Duración de la transición en milisegundos
          .easing(TWEEN.Easing.Quadratic.InOut) // Función de suavizado
          .onUpdate(function() {
            // Actualiza el frustumSize y la cámara en cada fotograma
            let newFrustumSize = start.value;
            const frustumHalfSize = newFrustumSize / 2;
            camera.left = -frustumHalfSize * aspect;
            camera.right = frustumHalfSize * aspect;
            camera.top = frustumHalfSize;
            camera.bottom = -frustumHalfSize;
            camera.updateProjectionMatrix(); // Actualiza la matriz de proyección de la cámara
          })
          .start();
        // Translate X
        let factorMove = 4
        new TWEEN.Tween(camera.position)
          .to({ x: camera.position.x - factorMove, y: camera.position.y - (factorMove / 3) }, 1500) // transición durante 2000 ms
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onComplete(() => {
          })
          .start();
      }, 1000)
    }; beginLogoHide()

    const loaderElement = loaderHandler.getLoaderParentElement()
    new TWEEN.Tween(loaderElement.style)
    .to({ opacity: 0 }, 500)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onComplete(() => {
      canvas.addEventListener('transitionend', function() {
        beginLogoShow()
      })
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
    const action = actions[actionName].action
    console.log('play singular encontrado', action)
    action.reset()
    action.setEffectiveTimeScale(1)
    action.play();
  }

  function playActionInReverse() {

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

    // Update camera
    const aspect = sizes.width / sizes.height;
    const frustumSize = FRUSTRUM_SIZE
    const frustumHalfSize = frustumSize / 2; // Ajusta este valor según tus necesidades

    const left = -frustumHalfSize * aspect
    const right = frustumHalfSize * aspect
    const top = frustumHalfSize
    const bottom = -frustumHalfSize

    camera.left = left;
    camera.right = right;
    camera.top = top;
    camera.bottom = bottom;
    camera.near = -100
    camera.far = 1000
    camera.updateProjectionMatrix()

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
  const frustumSize = FRUSTRUM_SIZE // 6.5; // lejanía de la cámara
  const frustumHalfSize = frustumSize / 2;

  const camera = new THREE.OrthographicCamera(
    -frustumHalfSize * aspect, // left
    frustumHalfSize * aspect, // right
    frustumHalfSize, // top
    -frustumHalfSize, // bottom
    -100, // near
    1000 // far
  );

  // 0.2801308418021325,0.3644685994588807,0.1159583736286828,0.8804788510038735

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

  scene.add(camera)

  // Controls
  // const controls = new OrbitControls(camera, canvas)
  // controls.enableDamping = true

  // controls.addEventListener("change", event => {
  //   // extraer información de la cámara cuando orbit controls la altera
  //   // console.log( `[Rotate] ${JSON.stringify(controls.object.quaternion)} \n [Position] ${JSON.stringify(controls.object.position)} \n [Scale] ${JSON.stringify(controls.object.scale)}` );
  // })

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

  // ---------------------------------------------- Post Processing -------------------------------------------------------

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio( 1 ); // ensure pixel ratio is always 1 for performance reasons

  // Create RenderPass
  const renderPass = new RenderPass(scene, camera);

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
  // composer.addPass(rgbShiftPass);
  // // Definir los shaders
  // var vertexShader = `
  //     uniform mat4 matViewProjection;
  //     uniform mat4 matView;
  //     uniform vec4 u_characterPos;
  //     attribute vec4 rm_Vertex;
  //     attribute vec2 rm_TexCoord0;
  //     varying vec2 v_texCoord;
  //     varying float v_characterDist;

  //     void main () {
  //         vec4 vViewPos = matView * rm_Vertex;
  //         v_characterDist = length (vViewPos - u_characterPos);
  //         gl_Position = matViewProjection * rm_Vertex;
  //         v_texCoord = rm_TexCoord0.xy;
  //     }
  // `;

  // var fragmentShader = `
  //     precision mediump float;
  //     uniform vec4 u_fogColor;
  //     uniform float u_fogMaxDist;
  //     uniform float u_fogMinDist;
  //     uniform sampler2D baseMap;
  //     varying vec2 v_texCoord;
  //     varying float v_characterDist;

  //     float computeLinearFogFactor () {
  //         float factor;
  //         factor = (u_fogMaxDist - v_characterDist) / (u_fogMaxDist - u_fogMinDist);
  //         factor = clamp (factor, 0.0, 1.0);
  //         return factor;
  //     }

  //     void main () {
  //         float fogFactor = computeLinearFogFactor ();
  //         vec4 fogColor = fogFactor * u_fogColor;
  //         vec4 baseColor = texture2D (baseMap, v_texCoord);
  //         gl_FragColor = baseColor * fogFactor + fogColor * (1.0 - fogFactor);
  //     }
  // `;

  // // Crear el material con los shaders
  // var shaderMaterial = new THREE.ShaderMaterial({
  //     vertexShader: vertexShader,
  //     fragmentShader: fragmentShader
  // });

  // var mesh = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), shaderMaterial);
  // scene.add(mesh);


  /**
   * Animate
   */
  const clock = new THREE.Clock()

  const tick = () => {
    // if(penroseTriangleMesh.length) {
    //   penroseTriangleMesh.forEach(child => {
    //     const q = new THREE.Quaternion()
    //     child.getWorldQuaternion(q)
    //     // console.log('Q', q)
    //   })
    // }

    TWEEN.update()

    // Render using composer instead of renderer (for PostProcessing)
    composer.render();

    mixer && mixer.update( clock.getDelta() );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }; tick()
})