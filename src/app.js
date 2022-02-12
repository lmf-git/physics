import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Controls from './controls';
import engine from './engine';
import buildSolarSystem from './buildSolarSystem';
import resizer from './resizer';

import PLANETS_SPECIFICATION from './planets-specification.json';

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


WORLD.players.push({
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    ),
    current_planet: PLANETS_SPECIFICATION.children[1],
    depth_queue: [PLANETS_SPECIFICATION]
});
WORLD.players[0].mesh.position.set(0, 0, 2);


WORLD.scene.add(buildSolarSystem(PLANETS_SPECIFICATION));
PLANETS_SPECIFICATION.children[1].body.add(WORLD.players[0].mesh);

// Configure and add camera.
camera.position.set(0, 30, 30);
WORLD.scene.add(WORLD.camera);


resizer();

Controls.initialise();

engine();