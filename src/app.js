import * as THREE from 'three';
import { World, Box, Body, Vec3, Plane, Sphere } from 'cannon-es';

// // Spherical body attempt?
// // https://codepen.io/anon/pen/ygvLGV

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

const sphereRadius = 1;
const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
const sphereMaterial = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);
const sphereBody = new Body({
  mass: 5,
  shape: new Sphere(sphereRadius),
});
sphereBody.position.set(0, 10, 0);
world.addBody(sphereBody);


const geometry = new THREE.BoxBufferGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const shape = new Box(new Vec3(2, 2, 2));
const body = new Body({
    mass: 1
});
body.addShape(shape);
body.position.set(1, 1, 1);
body.angularVelocity.set(0, 2, 0);
body.angularDamping = 0.5;
world.addBody(body);

const groundBody = new Body({
    type: Body.STATIC,
    shape: new Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);


const animate = () => {
    requestAnimationFrame(animate);

    // Copy coordinates from cannon.js to three.js
    mesh.position.copy(body.position);
    mesh.quaternion.copy(body.quaternion);

    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)

    // Update physics
    world.step(physicsTimeStep, clock.getDelta());

    renderer.render(scene, camera)
};

animate();