import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';
import {chooseColorFromHueRanges} from './utils';


export function addBackground(element: HTMLElement) {
  const functions = [floatingCubesBackground, vantaFogBackground, dotsBackground];

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
