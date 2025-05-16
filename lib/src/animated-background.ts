import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';
import WAVES from 'vanta/dist/vanta.waves.min';
import BIRDS from 'vanta/dist/vanta.birds.min';
import NET from 'vanta/dist/vanta.net.min';
import RINGS from 'vanta/dist/vanta.rings.min';
import {chooseColorFromHueRanges} from './utils';


export function addBackground(element: HTMLElement) {
  const functions = [
    // floatingCubesBackground,
    vantaFogBackground, 
    dotsBackground,
    // vantaWavesBackground,
    // vantaBirdsBackground,
    vantaNetBackground,
    // vantaRingsBackground,
    particleSystemBackground,
    galaxyBackground,
    fluidSimulationBackground,
    geometricPatternsBackground,
    cosmicNebulaBackground,
  ];

  const hash = (element.textContent ?? '').length;
  const initializeAnimation = functions[hash % functions.length];

  let destroyAnimation: (() => void) | null = null;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        destroyAnimation = initializeAnimation(element);
      } else {
        if (destroyAnimation !== null) destroyAnimation();
      }
    });
  });

  observer.observe(element);
}

function vantaFogBackground(element: HTMLElement): () => void {
  const lowlightColorRanges = [[0, 251]];
  const lowlightBase = [100, 50];

  const midtoneColorRanges = [[7, 55]];
  const midtoneColorBase = [100, 50];

  const highlightColorRanges = [[0, 50], [246, 342]];
  const highlightColoBase = [100, 50];

  const effect = FOG({
    el: element,
    THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    lowlightColor: chooseColorFromHueRanges(lowlightColorRanges, lowlightBase[0], lowlightBase[1]),
    midtoneColor: chooseColorFromHueRanges(midtoneColorRanges, midtoneColorBase[0], midtoneColorBase[1]),
    highlightColor: chooseColorFromHueRanges(highlightColorRanges, highlightColoBase[0], highlightColoBase[1]),
  });

  return () => {
    effect.destroy();
  };
}

function vantaWavesBackground(element: HTMLElement): () => void {
  const colorRanges = [[180, 250]]; // Blue-ish colors
  const colorBase = [80, 60];

  const effect = WAVES({
    el: element,
    THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: chooseColorFromHueRanges(colorRanges, colorBase[0], colorBase[1]),
    shininess: 30.00,
    waveHeight: 15.00,
    waveSpeed: 0.75,
    zoom: 0.90
  });

  return () => {
    effect.destroy();
  };
}

function vantaBirdsBackground(element: HTMLElement): () => void {
  const backgroundColor = chooseColorFromHueRanges([[200, 240]], 15, 15); // Dark blue background
  const color1 = chooseColorFromHueRanges([[0, 60]], 80, 70); // Warm colors
  const color2 = chooseColorFromHueRanges([[180, 270]], 80, 70); // Cool colors

  const effect = BIRDS({
    el: element,
    THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: backgroundColor,
    color1: color1,
    color2: color2,
    colorMode: "variance",
    quantity: 3.00,
    birdSize: 1.50,
    wingSpan: 30.00,
    speedLimit: 5.00,
    separation: 60.00
  });

  return () => {
    effect.destroy();
  };
}

function vantaNetBackground(element: HTMLElement): () => void {
  const backgroundColor = chooseColorFromHueRanges([[200, 240]], 10, 10); // Dark background
  const color = chooseColorFromHueRanges([[0, 60], [180, 270]], 70, 70); // Vibrant foreground

  const effect = NET({
    el: element,
    THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: color,
    backgroundColor: backgroundColor,
    points: 10.00,
    maxDistance: 20.00,
    spacing: 15.00,
    showDots: true
  });

  return () => {
    effect.destroy();
  };
}

function vantaRingsBackground(element: HTMLElement): () => void {
  const backgroundColor = chooseColorFromHueRanges([[200, 240]], 10, 10); // Dark background
  const color = chooseColorFromHueRanges([[0, 60]], 70, 70); // Warm foreground

  const effect = RINGS({
    el: element,
    THREE,
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: backgroundColor,
    color: color
  });

  return () => {
    effect.destroy();
  };
}


function floatingCubesBackground(element: HTMLElement): () => void {
  // Used https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, raycaster: THREE.Raycaster, renderer: THREE.WebGLRenderer;

  let theta = 0;

  const pointer = new THREE.Vector2();
  const radius = 5;

  init();

  function init() {

    camera = new THREE.PerspectiveCamera(70, element.clientWidth / element.clientHeight, 0.1, 100);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const geometry = new THREE.BoxGeometry();

    for (let i = 0; i < 2000; i++) {

      const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));

      object.position.x = Math.random() * 40 - 20;
      object.position.y = Math.random() * 40 - 20;
      object.position.z = Math.random() * 40 - 20;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() + 0.5;
      object.scale.y = Math.random() + 0.5;
      object.scale.z = Math.random() + 0.5;

      scene.add(object);

    }

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }


  function animate() {
    render();
  }

  function render() {

    theta += 0.1;

    camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
    camera.lookAt(scene.position);

    camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera(pointer, camera);

    renderer.render(scene, camera);

  }

  return () => {
    renderer.setAnimationLoop(null);
    element.removeChild(renderer.domElement);
    renderer.dispose();
  };
}

function dotsBackground(element: HTMLElement): () => void {
  // Used https://github.com/mrdoob/three.js/blob/master/examples/webgl_points_billboards.html

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer,
    material: THREE.PointsMaterial;
  let mouseX = 0, mouseY = 0;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  init();

  function init() {

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 2, 2000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    const sprite = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/refs/heads/master/examples/textures/sprites/disc.png');
    sprite.colorSpace = THREE.SRGBColorSpace;

    for (let i = 0; i < 10000; i++) {

      const x = 2000 * Math.random() - 1000;
      const y = 2000 * Math.random() - 1000;
      const z = 2000 * Math.random() - 1000;

      vertices.push(x, y, z);

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    material = new THREE.PointsMaterial({
      size: 35,
      sizeAttenuation: true,
      map: sprite,
      alphaTest: 0.5,
      transparent: true,
    });
    material.color.setHSL(1.0, 0.3, 0.7, THREE.SRGBColorSpace);

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function animate() {
    render();
  }

  function render() {

    const time = Date.now() * 0.00005;

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    const h = (360 * (1.0 + time) % 360) / 360;
    material.color.setHSL(h, 0.5, 0.5);

    renderer.render(scene, camera);

  }

  return () => {
    renderer.setAnimationLoop(null);
    element.removeChild(renderer.domElement);
    renderer.dispose();
  };
}

function particleSystemBackground(element: HTMLElement): () => void {
  // Inspired by https://threejs.org/examples/#webgl_points_dynamic

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
  let particles: THREE.Points;
  let positions: Float32Array, colors: Float32Array;
  let particleCount = 5000;
  let particleSystem: THREE.BufferGeometry;

  init();

  function init() {
    camera = new THREE.PerspectiveCamera(45, element.clientWidth / element.clientHeight, 1, 1000);
    camera.position.z = 250;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    // Create particle system
    particleSystem = new THREE.BufferGeometry();
    positions = new Float32Array(particleCount * 3);
    colors = new Float32Array(particleCount * 3);

    const color = new THREE.Color();

    // Initialize particles with random positions and colors
    for (let i = 0; i < particleCount; i++) {
      // Position
      const x = Math.random() * 400 - 200;
      const y = Math.random() * 400 - 200;
      const z = Math.random() * 400 - 200;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color
      const vx = (x / 200) + 0.5;
      const vy = (y / 200) + 0.5;
      const vz = (z / 200) + 0.5;

      color.setRGB(vx, vy, vz);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleSystem.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleSystem.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: true
    });

    particles = new THREE.Points(particleSystem, material);
    scene.add(particles);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(element.clientWidth, element.clientHeight);
  }

  function animate() {
    // Rotate the entire particle system
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;

    // Update particle positions for a flowing effect
    const positions = particleSystem.attributes.position.array as Float32Array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Apply sine wave motion to particles
      positions[iy] = Math.sin(time + positions[ix] / 10) * 10;
      positions[iz] += 0.1;

      // Reset particles that go too far
      if (positions[iz] > 200) {
        positions[iz] = -200;
      }
    }

    particleSystem.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  return () => {
    renderer.setAnimationLoop(null);
    element.removeChild(renderer.domElement);
    renderer.dispose();
  };
}

function galaxyBackground(element: HTMLElement): () => void {
  // Inspired by https://threejs.org/examples/#webgl_points_sprites

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
  let galaxy: THREE.Points;

  init();

  function init() {
    camera = new THREE.PerspectiveCamera(60, element.clientWidth / element.clientHeight, 1, 2000);
    camera.position.z = 1000;
    camera.position.y = 100;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    // Create galaxy
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];

    const colorBase = new THREE.Color();
    const colorCenter = new THREE.Color(0xffaa00); // Yellowish center
    const colorOuter = new THREE.Color(0x4400ff);  // Purplish outer

    // Create spiral galaxy pattern
    const arms = 5;  // Number of spiral arms
    const particlesPerArm = 5000;

    for (let a = 0; a < arms; a++) {
      const armAngle = (a / arms) * Math.PI * 2;

      for (let i = 0; i < particlesPerArm; i++) {
        // Distance from center
        const distance = Math.random() * Math.random() * 800 + 50;

        // Angle based on distance (creates the spiral)
        const angle = armAngle + distance * 0.0025;

        // Position
        const x = Math.cos(angle) * distance;
        const y = (Math.random() - 0.5) * (50 - distance * 0.03); // Thinner at edges
        const z = Math.sin(angle) * distance;

        vertices.push(x, y, z);

        // Color (blend from center to outer based on distance)
        const blend = Math.min(distance / 800, 1);
        colorBase.copy(colorCenter).lerp(colorOuter, blend);

        // Add some randomness to color
        const r = colorBase.r + (Math.random() - 0.5) * 0.2;
        const g = colorBase.g + (Math.random() - 0.5) * 0.2;
        const b = colorBase.b + (Math.random() - 0.5) * 0.2;

        colors.push(r, g, b);
      }
    }

    // Add some random stars in the background
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 2000 - 1000;
      const y = Math.random() * 2000 - 1000;
      const z = Math.random() * 2000 - 1000;

      vertices.push(x, y, z);

      // White-ish stars with slight color variation
      const r = 0.7 + Math.random() * 0.3;
      const g = 0.7 + Math.random() * 0.3;
      const b = 0.7 + Math.random() * 0.3;

      colors.push(r, g, b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Material
    const sprite = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/refs/heads/master/examples/textures/sprites/disc.png');
    sprite.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.PointsMaterial({
      size: 12,
      map: sprite,
      vertexColors: true,
      alphaTest: 0.1,
      transparent: true
    });

    galaxy = new THREE.Points(geometry, material);
    scene.add(galaxy);

    // Renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(element.clientWidth, element.clientHeight);
  }

  function animate() {
    const time = Date.now() * 0.0001;

    // Slowly rotate the galaxy
    galaxy.rotation.y = time * 0.2;

    // Slightly tilt and move camera for a more dynamic view
    camera.position.x = Math.sin(time * 0.3) * 100;
    camera.position.y = Math.cos(time * 0.2) * 100 + 100;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  return () => {
    renderer.setAnimationLoop(null);
    element.removeChild(renderer.domElement);
    renderer.dispose();
  };
}

function fluidSimulationBackground(element: HTMLElement): () => void {
  // Inspired by fluid simulations and shader effects

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
  let time = 0;
  let mesh: THREE.Mesh;

  init();

  function init() {
    // Setup camera
    camera = new THREE.PerspectiveCamera(70, element.clientWidth / element.clientHeight, 0.01, 10);
    camera.position.z = 1;

    // Setup scene
    scene = new THREE.Scene();

    // Create shader material for fluid effect
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2(element.clientWidth, element.clientHeight) },
        colorA: { value: new THREE.Color(0x2c3e50) }, // Dark blue
        colorB: { value: new THREE.Color(0x3498db) }, // Light blue
        colorC: { value: new THREE.Color(0x1abc9c) }  // Teal
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec3 colorA;
        uniform vec3 colorB;
        uniform vec3 colorC;
        varying vec2 vUv;

        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
          m = m*m;
          m = m*m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
          vec3 g;
          g.x = a0.x * x0.x + h.x * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 st = gl_FragCoord.xy / resolution.xy;
          st.x *= resolution.x / resolution.y;

          // Create fluid-like motion using noise
          float noise1 = snoise(vec2(st.x * 3.0 + time * 0.1, st.y * 3.0 + time * 0.2));
          float noise2 = snoise(vec2(st.x * 2.0 - time * 0.15, st.y * 2.0 - time * 0.1));
          float noise3 = snoise(vec2(st.x * 4.0 + time * 0.2, st.y * 4.0 + time * 0.1));

          // Combine noise for fluid effect
          float combinedNoise = (noise1 + noise2 + noise3) / 3.0;

          // Create color gradient based on noise
          vec3 color = mix(colorA, colorB, smoothstep(-0.6, 0.6, combinedNoise));
          color = mix(color, colorC, smoothstep(0.2, 0.8, sin(time * 0.3 + st.x * 2.0) * 0.5 + 0.5));

          // Add some ripple effects
          float ripple = sin(50.0 * (st.x - st.y) + time * 2.0) * 0.02;
          color += ripple;

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    // Create a simple plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(element.clientWidth, element.clientHeight);

    // Update resolution uniform
    if (mesh && mesh.material) {
      const material = mesh.material as THREE.ShaderMaterial;
      material.uniforms.resolution.value.set(element.clientWidth, element.clientHeight);
    }
  }

  function animate() {
    time += 0.01;

    // Update time uniform for the shader
    if (mesh && mesh.material) {
      const material = mesh.material as THREE.ShaderMaterial;
      material.uniforms.time.value = time;
    }

    renderer.render(scene, camera);
  }

  return () => {
    renderer.setAnimationLoop(null);
    element.removeChild(renderer.domElement);
    renderer.dispose();
    window.removeEventListener('resize', onWindowResize);
  };
}

function geometricPatternsBackground(element: HTMLElement): () => void {
  // Inspired by geometric art and transforming shapes

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
  let shapes: THREE.Group;
  let time = 0;

  init();

  function init() {
    // Setup camera
    camera = new THREE.PerspectiveCamera(70, element.clientWidth / element.clientHeight, 0.1, 100);
    camera.position.z = 20;

    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111133); // Dark blue-ish background

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(1, 1, 1);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0x8844ff, 0.5);
    light2.position.set(-1, -1, -1);
    scene.add(light2);

    // Create geometric shapes
    shapes = new THREE.Group();
    scene.add(shapes);

    createShapes();

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
  }

  function createShapes() {
    // Create a variety of geometric shapes

    // Materials with different colors and properties
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.4, metalness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0x66ccff, roughness: 0.2, metalness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.6, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0x33cc99, roughness: 0.3, metalness: 0.7 }),
      new THREE.MeshStandardMaterial({ color: 0xcc33ff, roughness: 0.5, metalness: 0.5 }),
    ];

    // Create cubes
    for (let i = 0; i < 5; i++) {
      const size = Math.random() * 10 + 5;
      const geometry = new THREE.BoxGeometry(size, size, size);
      const material = materials[i % materials.length];
      const cube = new THREE.Mesh(geometry, material);

      // Position in a circular pattern
      const angle = (i / 5) * Math.PI * 2;
      const radius = 8;
      cube.position.x = Math.cos(angle) * radius;
      cube.position.y = Math.sin(angle) * radius;
      cube.position.z = Math.random() * 4 - 2;

      // Store initial position for animation
      cube.userData.initialPosition = cube.position.clone();
      cube.userData.rotationSpeed = {
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01
      };

      shapes.add(cube);
    }

    // Create spheres
    for (let i = 0; i < 5; i++) {
      const radius = Math.random() * 10 + 5;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = materials[(i + 2) % materials.length];
      const sphere = new THREE.Mesh(geometry, material);

      // Position in a circular pattern
      const angle = (i / 5) * Math.PI * 2 + Math.PI / 5;
      const distance = 5;
      sphere.position.x = Math.cos(angle) * distance;
      sphere.position.y = Math.sin(angle) * distance;
      sphere.position.z = Math.random() * 4 - 2;

      // Store initial position for animation
      sphere.userData.initialPosition = sphere.position.clone();
      sphere.userData.rotationSpeed = {
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01
      };

      shapes.add(sphere);
    }

    // Create torus knots
    for (let i = 0; i < 3; i++) {
      const radius = Math.random() * 0.8 + 0.3;
      const tube = Math.random() * 0.3 + 0.1;
      const tubularSegments = 64;
      const radialSegments = 8;
      const p = Math.floor(Math.random() * 3) + 2;
      const q = Math.floor(Math.random() * 3) + 2;

      const geometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
      const material = materials[(i + 4) % materials.length];
      const torusKnot = new THREE.Mesh(geometry, material);

      // Position in the center area
      const angle = (i / 3) * Math.PI * 2;
      const distance = 2;
      torusKnot.position.x = Math.cos(angle) * distance;
      torusKnot.position.y = Math.sin(angle) * distance;
      torusKnot.position.z = Math.random() * 2 - 1;

      // Store initial position for animation
      torusKnot.userData.initialPosition = torusKnot.position.clone();
      torusKnot.userData.rotationSpeed = {
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01
      };

      shapes.add(torusKnot);
    }

    // Create octahedrons
    for (let i = 0; i < 4; i++) {
      const radius = Math.random() * 1.2 + 0.8;
      const geometry = new THREE.OctahedronGeometry(radius);
      const material = materials[i % materials.length];
      const octahedron = new THREE.Mesh(geometry, material);

      // Position randomly
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 8;
      const distance = 10;
      octahedron.position.x = Math.cos(angle) * distance;
      octahedron.position.y = Math.sin(angle) * distance;
      octahedron.position.z = Math.random() * 4 - 2;

      // Store initial position for animation
      octahedron.userData.initialPosition = octahedron.position.clone();
      octahedron.userData.rotationSpeed = {
        x: Math.random() * 0.02 - 0.01,
        y: Math.random() * 0.02 - 0.01,
        z: Math.random() * 0.02 - 0.01
      };

      shapes.add(octahedron);
    }
  }

  function onWindowResize() {
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(element.clientWidth, element.clientHeight);
  }

  function animate() {
    time += 0.01;

    // Rotate the entire group
    shapes.rotation.y = time * 0.1;

    // Animate each shape
    shapes.children.forEach((shape, index) => {
      // Individual rotation
      shape.rotation.x += shape.userData.rotationSpeed.x;
      shape.rotation.y += shape.userData.rotationSpeed.y;
      shape.rotation.z += shape.userData.rotationSpeed.z;

      // Pulsating movement
      const initialPos = shape.userData.initialPosition;
      const pulseFreq = 0.2 + index * 0.05;
      const pulseAmp = 0.5;

      shape.position.x = initialPos.x + Math.sin(time * pulseFreq) * pulseAmp;
      shape.position.y = initialPos.y + Math.cos(time * pulseFreq) * pulseAmp;
      shape.position.z = initialPos.z + Math.sin(time * pulseFreq * 1.5) * pulseAmp * 0.5;

      // Scale pulsation
      const scaleFactor = 1 + Math.sin(time * 0.3 + index) * 0.1;
      shape.scale.set(scaleFactor, scaleFactor, scaleFactor);
    });

    // Move camera slightly for more dynamic view
    camera.position.x = Math.sin(time * 0.2) * 2;
    camera.position.y = Math.cos(time * 0.1) * 2;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  return () => {
    renderer.setAnimationLoop(null);
    element.removeChild(renderer.domElement);
    renderer.dispose();
    window.removeEventListener('resize', onWindowResize);
  };
}


function cosmicNebulaBackground(element: HTMLElement): () => void {
  // Inspired by cosmic nebulae and space phenomena

  let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
  let particleSystem: THREE.Points;
  let dustParticles: THREE.Points;
  let glowingSpheres: THREE.Group;
  let time = 0;

  init();

  function init() {
    // Setup camera
    camera = new THREE.PerspectiveCamera(60, element.clientWidth / element.clientHeight, 0.1, 1000);
    camera.position.z = 70;

    // Setup scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    // Create particle systems and glowing elements
    createNebulaParticles();
    createDustParticles();
    createGlowingSpheres();

    // Setup renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(element.clientWidth, element.clientHeight);
    renderer.setAnimationLoop(animate);
    element.appendChild(renderer.domElement);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
  }

  function createNebulaParticles() {
    // Create main nebula particle system
    const particleCount = 15000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Define nebula shape and colors
    const nebulaCenter = new THREE.Vector3(0, 0, 0);
    const nebulaSize = 60;
    const colorPalette = [
      new THREE.Color(0x3677ac), // Blue
      new THREE.Color(0x9977bb), // Purple
      new THREE.Color(0xcc3388), // Pink
      new THREE.Color(0x2255cc), // Deep blue
      new THREE.Color(0x55ddff)  // Cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Create a cloud-like distribution using spherical coordinates with noise
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = Math.pow(Math.random(), 0.5) * nebulaSize; // Concentrate particles toward center

      // Add some spiral structure
      const spiralFactor = 0.5;
      const spiralOffset = r * spiralFactor;

      positions[i3] = nebulaCenter.x + r * Math.sin(phi) * Math.cos(theta + spiralOffset);
      positions[i3 + 1] = nebulaCenter.y + r * Math.sin(phi) * Math.sin(theta + spiralOffset) * 0.6; // Flatten vertically
      positions[i3 + 2] = nebulaCenter.z + r * Math.cos(phi);

      // Add some noise to positions for more natural look
      positions[i3] += (Math.random() - 0.5) * 10;
      positions[i3 + 1] += (Math.random() - 0.5) * 10;
      positions[i3 + 2] += (Math.random() - 0.5) * 10;

      // Color based on position
      const distFromCenter = Math.sqrt(
          Math.pow(positions[i3], 2) +
          Math.pow(positions[i3 + 1], 2) +
          Math.pow(positions[i3 + 2], 2)
      );

      // Choose color based on distance and some randomness
      const colorIndex = Math.min(
          Math.floor((distFromCenter / nebulaSize) * colorPalette.length + Math.random() * 1.5),
          colorPalette.length - 1
      );

      const color = colorPalette[colorIndex].clone();

      // Add some color variation
      color.r += (Math.random() - 0.5) * 0.2;
      color.g += (Math.random() - 0.5) * 0.2;
      color.b += (Math.random() - 0.5) * 0.2;

      // Fade out particles at the edges
      const opacity = Math.max(0, 1 - distFromCenter / nebulaSize);
      color.multiplyScalar(opacity);

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create particle material with additive blending for glow effect
    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
  }

  function createDustParticles() {
    // Create background dust particles
    const particleCount = 5000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const dustSize = 150;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Random positions in a larger volume than the nebula
      positions[i3] = (Math.random() - 0.5) * dustSize;
      positions[i3 + 1] = (Math.random() - 0.5) * dustSize;
      positions[i3 + 2] = (Math.random() - 0.5) * dustSize;

      // White-ish colors with slight variations
      const brightness = Math.random() * 0.3 + 0.1; // Keep dust subtle
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      sizeAttenuation: true
    });

    dustParticles = new THREE.Points(geometry, material);
    scene.add(dustParticles);
  }

  function createGlowingSpheres() {
    // Create a few glowing spheres to represent stars or energy concentrations
    glowingSpheres = new THREE.Group();
    scene.add(glowingSpheres);

    const sphereColors = [
      0x3677ac, // Blue
      0xcc3388, // Pink
      0x55ddff, // Cyan
      0xffaa22  // Orange
    ];

    for (let i = 0; i < 6; i++) {
      const radius = Math.random() * 1.5 + 0.5;

      // Create a sphere with emissive material for glow
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const color = sphereColors[i % sphereColors.length];

      const material = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
      });

      const sphere = new THREE.Mesh(geometry, material);

      // Position randomly within the nebula
      const distance = Math.random() * 30;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 20;

      sphere.position.x = Math.cos(angle) * distance;
      sphere.position.y = height;
      sphere.position.z = Math.sin(angle) * distance;

      // Store initial position and other animation parameters
      sphere.userData.initialPosition = sphere.position.clone();
      sphere.userData.pulseFactor = Math.random() * 0.2 + 0.9;
      sphere.userData.pulseSpeed = Math.random() * 0.02 + 0.01;
      sphere.userData.orbitSpeed = Math.random() * 0.01 + 0.005;
      sphere.userData.orbitRadius = distance;
      sphere.userData.orbitAngle = angle;

      glowingSpheres.add(sphere);
    }
  }

  function onWindowResize() {
    camera.aspect = element.clientWidth / element.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(element.clientWidth, element.clientHeight);
  }

  function animate() {
    time += 0.005;

    // Rotate the nebula slowly
    if (particleSystem) {
      particleSystem.rotation.y = time * 0.1;
    }

    // Animate dust particles
    if (dustParticles) {
      dustParticles.rotation.y = time * 0.05;
      dustParticles.rotation.x = time * 0.02;
    }

    // Animate glowing spheres
    if (glowingSpheres) {
      glowingSpheres.children.forEach((sphere) => {
        const userData = sphere.userData;

        // Pulsate size
        const scale = userData.pulseFactor + Math.sin(time * userData.pulseSpeed * 10) * 0.1;
        sphere.scale.set(scale, scale, scale);

        // Orbit around center
        userData.orbitAngle += userData.orbitSpeed;
        sphere.position.x = Math.cos(userData.orbitAngle) * userData.orbitRadius;
        sphere.position.z = Math.sin(userData.orbitAngle) * userData.orbitRadius;
      });
    }

    // Move camera slightly for more dynamic view
    camera.position.x = Math.sin(time * 0.2) * 5;
    camera.position.y = Math.cos(time * 0.1) * 5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  return () => {
    renderer.setAnimationLoop(null);
    element.removeChild(renderer.domElement);
    renderer.dispose();
    window.removeEventListener('resize', onWindowResize);
  };
}
