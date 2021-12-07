import * as THREE from 'three';
import { World, Box, Body, Vec3, Plane, Sphere } from 'cannon-es';

// Spherical body attempt?
// https://codepen.io/anon/pen/ygvLGV

const physicsTimeStep = 1 / 60;

const clock = new THREE.Clock;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 5;

const scene = new THREE.Scene(); 
const world = new World();

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
const cubeBody = new Body({
    mass: 1,
    shape: new Box(new Vec3(2, 2, 2))
});

scene.add(cubeMesh);
world.addBody(cubeBody);

const groundBody = new Body({
    type: Body.STATIC,
    shape: new Plane(),
});
world.addBody(groundBody);

const animate = () => {
    // Calculate physics.
    cubeMesh.position.copy(cubeBody.position);
    world.step(physicsTimeStep, clock.getDelta());

    // Render scene.
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();


// const sphereRadius = 1;
// const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
// const sphereMaterial = new THREE.MeshNormalMaterial();
// const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphereMesh);
// const sphereBody = new Body({
//   mass: 5,
//   shape: new Sphere(sphereRadius),
// });
// sphereBody.position.set(0, 10, 0);
// world.addBody(sphereBody);
