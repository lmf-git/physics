import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Controls from './controls/controls';
import engine from './engine';
import buildSolarSystem from './generation/buildSolarSystem';

import PLANETS_SPECIFICATION from './generation/planets-specification.json';
import Player from './entities/player';

const canvas = document.querySelector('#canvas');
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);

// Global state/access.
window.WORLD = {
    renderer: new THREE.WebGLRenderer({ canvas: canvas }),
    scene: new THREE.Scene,
    controls: new OrbitControls(camera, canvas),
    camera,
    
    planets: [],

    players: []
};

// Configure controls.
WORLD.controls.enableDamping = true;


// Add testing player (refactor into networking later).
const player = new Player();
WORLD.players.push(player);
WORLD.players[0].handle.position.set(0, -1, -1);

// Add the mesh to the handle.
player.handle.add(player.mesh);

WORLD.scene.add(buildSolarSystem(PLANETS_SPECIFICATION));
player.current_planet = WORLD.planets[1];
player.current_planet.body.add(WORLD.players[0].handle);


// Configure and add camera.
camera.position.set(0, 30, 30);
WORLD.scene.add(WORLD.camera);


function resizer() {
    // Update camera
    WORLD.camera.aspect = window.innerWidth / window.innerHeight;
    WORLD.camera.updateProjectionMatrix();
  
    // Update renderer
    WORLD.renderer.setSize(window.innerWidth, window.innerHeight);
    WORLD.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener('resize', resizer);
resizer();

Controls.initialise();

engine();