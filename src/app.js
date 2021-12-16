import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene;

// const lilOne = createSphere(0.5, { x: 0, y: 3, z: 0 }, 2);
// const lilOneTwo = createSphere(0.5, { x: 3, y: 3, z: 3 }, 1);
// const bigOne = createSphere(5, { x: 30, y: 0, z: 0 }, 0);


const lilOne = new THREE.Mesh(
  new THREE.SphereGeometry(.5, 20, 20),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
);
const lilOneTwo = new THREE.Mesh(
  new THREE.SphereGeometry(.75, 20, 20),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
);
const bigOne = new THREE.Mesh(
  new THREE.SphereGeometry(5, 20, 20),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
);
lilOne.position.set(15, 5, 10)
lilOneTwo.position.set(5, 10, 20)
bigOne.position.set(15, 20, 5)
scene.add(lilOne, lilOneTwo, bigOne);


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 30, 30);
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });

const update = () => {
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(update);
}

const resize = () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener('resize', resize);

resize();

update();







/** NEXT STEPS */
// Movement around the planet
// Fake gravity
// Get in spaceship (cube)
// Get into orbit
// Escape orbit, enter different SOI*


// * SOI = Sphere of influence






console.log(lilOne.position);
console.log(lilOneTwo.position);
console.log(bigOne.position);