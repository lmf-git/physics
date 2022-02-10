import * as THREE from 'three';
import Controls from './controls';

let velocity = new THREE.Vector3(0, 0, 0);
let time = 0;

export default function engine() {
    const delta = 0.01;
    time = time + delta;

    let currentSOI = WORLD.current_planet;
    let soiLimit = WORLD.current_planet.SOISize;

    // get player data
    let worldPos = new THREE.Vector3(0, 0, 1);
    WORLD.player.getWorldPosition(worldPos);
    let playerHeight = WORLD.player.position.length();

    // check soi
    let newPlanet = null;
    if (playerHeight > soiLimit) {
        newPlanet = WORLD.depth_queue.pop();
    } else {
        const matches = currentSOI.children.filter(item => {
            let distance2 = item.body.position.distanceToSquared(WORLD.player.position);
            return distance2 < item.SOISize * item.SOISize;
        });
        if (matches[0]) {
            newPlanet = matches[0];
            WORLD.depth_queue.push(currentSOI);
        }
    }

    // change planet if needed
    if (newPlanet) { 
        // leaving the soi
        const newitem = newPlanet;
        const oldbody = currentSOI.body;
        const newbody = newitem.body;
        newbody.attach(WORLD.player);

        // Transform velocity to new coordinate frame
        let Amat = new THREE.Matrix3().getNormalMatrix(oldbody.matrixWorld).invert();
        let Bmat = new THREE.Matrix3().getNormalMatrix(newbody.matrixWorld);

        // Apply gravity capture velocity and newest SOI.
        velocity = velocity.applyMatrix3(Amat).applyMatrix3(Bmat);
        currentSOI = WORLD.current_planet = newitem;
    }

    // look up planet infomation
    let surfaceHeight = WORLD.current_planet.surface;
    let surfaceGravity = WORLD.current_planet.surfaceGravity;

    // Caculate and set up direction(forward)
    const planetWorldPos = new THREE.Vector3(0, 0, 1);
    currentSOI.body.getWorldPosition(planetWorldPos);
    const altDirection = WORLD.player.localToWorld(new THREE.Vector3(0, 1, 0)).sub(worldPos).normalize();
    WORLD.player.up.set(altDirection.x, altDirection.y, altDirection.z);

    // Look at the ground
    WORLD.player.lookAt(planetWorldPos);

    // Caculate ground
    let playerSize = 0.4 / 2;
    let height = playerSize + surfaceHeight;
    
    // Caculate Gravity
    let heightScaled = playerHeight / surfaceHeight;
    let gravity = surfaceGravity / (heightScaled * heightScaled);

    // Move player
    let Y = 50 * ((Controls.Keypad.w ? 1 : 0) - (Controls.Keypad.s ? 1 : 0));
    let X = 50 * ((Controls.Keypad.a ? 1 : 0) - (Controls.Keypad.d ? 1 : 0));
    let Z = (Controls.Keypad.space ? -10 : gravity);
    let acceleration = new THREE.Vector3(X, Y, Z );

    // Transform to local cordinates
    let normalMatrix = new THREE.Matrix3().getNormalMatrix(WORLD.player.matrix);
    acceleration.applyMatrix3(normalMatrix);
   
    // Move the player
    velocity.addScaledVector(acceleration, delta);
    WORLD.player.position.addScaledVector(acceleration, 0.5 * delta * delta);
    WORLD.player.position.addScaledVector(velocity, delta);
    playerHeight = WORLD.player.position.length();

    // Caculate Atmosphere
    let friction = 0;
    friction = friction + 5 / Math.pow(1 + (playerHeight - height) / height, 2);

    // Reset friction if it becomes too extreme/corrupted.
    if (isNaN(friction)) friction = 0;

    // Ground collision
    if (playerHeight <= height) {
        WORLD.player.position.clampLength(height, 100000);
        
        friction += 300;

        const speed = velocity.length();
        const direction = WORLD.player.position.clone().normalize();
        velocity.addScaledVector(direction, -velocity.dot(direction) / speed);
    }

    // Apply friction
    let speedFactor = friction * delta;
    if (speedFactor > 1) speedFactor = 1;
    velocity.multiplyScalar(1 - speedFactor);

    // Rotate the planets.
    WORLD.planets.forEach(element => {
        if (element.velocity) {
            element.pivot.rotation.y = 2 * Math.PI * element.velocity * time;
            element.body.rotation.y = 2 * Math.PI * element.spin * time;
        }
    });

    WORLD.controls.update();
    WORLD.renderer.render(WORLD.scene, WORLD.camera);
    window.requestAnimationFrame(engine);
}