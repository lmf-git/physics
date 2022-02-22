import * as THREE from 'three';
import PLANETS_SPECIFICATION from '../generation/planets-specification.json';

export default class Player {
    constructor() {

    }

    onGround = false;

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );

    aim = new THREE.Quaternion();
    
    velocity = new THREE.Vector3(0, 0, 0);

    current_planet = PLANETS_SPECIFICATION.children[1];

    depth_queue = [PLANETS_SPECIFICATION];
}