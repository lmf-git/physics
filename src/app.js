import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Controls from './controls';
import engine from './engine';
import SOLAR_SYSTEM from './solarSystem';

/** NEXT STEPS */
// Get in spaceship (cube)
// Escape orbit, enter different SOI*
// Modularise/organise code

const canvas = document.querySelector('#canvas');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

// Global state/access.
window.WORLD = {
    renderer: new THREE.WebGLRenderer({ canvas: canvas }),
    scene: new THREE.Scene,
    controls: new OrbitControls(camera, canvas),
    camera,
    
    solar_system: SOLAR_SYSTEM,
    planets: [],

    depth_queue: [SOLAR_SYSTEM],
    player: null,
    current_planet: SOLAR_SYSTEM.children[1]
};

// Configure controls.
WORLD.controls.enableDamping = true;

WORLD.player = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshBasicMaterial({  color: 0xffff00 })
);

const buildChildren = (item) => {
    let body = new THREE.Mesh(
        new THREE.SphereGeometry(item.surface, 20, 20),
        new THREE.MeshBasicMaterial({ wireframe: true, color:item.color })
    );
    body.position.set(...item.position);
    item.pivot = new THREE.Group();
    item.body = body;
    item.pivot.add(item.body);
    WORLD.planets.push(item);

    if (item.children) {
        item.children.forEach(element => item.pivot.add(buildChildren(element)));
    };
    return item.pivot;
}

WORLD.scene.add(buildChildren(WORLD.solar_system));
WORLD.player.position.set(0, 0, 2);


WORLD.solar_system.children[1].body.add(WORLD.player);


// Configure and add camera.
camera.position.set(0, 30, 30);
WORLD.scene.add(WORLD.camera);


const resize = () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
  WORLD.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener('resize', resize);

resize();

engine();

Controls.initialise();