import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SOLAR_SYSTEM from './solarSystem';
import Controls from './controls';
import engine from './engine';
import buildSolarSystem from './buildSolarSystem';
import resizer from './resizer';


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
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
WORLD.player.position.set(0, 0, 2);


WORLD.scene.add(buildSolarSystem(WORLD.solar_system));
WORLD.solar_system.children[1].body.add(WORLD.player);

// Configure and add camera.
camera.position.set(0, 30, 30);
WORLD.scene.add(WORLD.camera);


resizer();

Controls.initialise();

engine();