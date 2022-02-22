import * as THREE from 'three';
import Controls from './controls/controls';


let time = 0;

export default function engine() {
    const delta = 0.01;
    time = time + delta;

    // Apply gravity to all players.
    WORLD.players.map(player => {
        const soiLimit = player.current_planet.SOISize;
        let currentSOI = player.current_planet;
    
        // get player data
        let worldPos = new THREE.Vector3(0, 0, 1);
        player.handle.getWorldPosition(worldPos);
        let playerHeight = player.handle.position.length();

        let BigToSmall = false;
        // Check if player left SOI gravity range.
        let newPlanet = null;
        if (playerHeight > soiLimit) {
            console.log("leave" + currentSOI.name );
            newPlanet = currentSOI.parent;
        }
        
        // Check if player entered another SOI gravity range.
        if (playerHeight < soiLimit) {
            const matches = currentSOI.children.filter(item => {
                let itemPos = new THREE.Vector3(0, 0, 1);
                item.body.getWorldPosition(itemPos);
                return itemPos.distanceToSquared(worldPos) < item.SOISize * item.SOISize;
            });
            
            if (matches[0]) {
                newPlanet = matches[0];
                BigToSmall = true;
            }

        }
    
        // Handle player captured by another SOI's gravity.
        if (newPlanet) { 
            // Attach the player handle to the new planet body.
            newPlanet.body.attach(player.handle);
    
            // Transform velocity to new coordinate frame
            let Amat = new THREE.Matrix3().getNormalMatrix(currentSOI.body.matrixWorld);
            let Bmat = new THREE.Matrix3().getNormalMatrix(newPlanet.body.matrixWorld).invert();
            
            let PlanetPrograde;
            let Speed;
            if (BigToSmall) {
                PlanetPrograde = newPlanet.body.position.clone().normalize().cross(new THREE.Vector3(0, 1, 0));
                Speed = 2 * Math.PI * newPlanet.velocity * newPlanet.body.position.length();
            } else {
                PlanetPrograde = currentSOI.body.position.clone().normalize().cross(new THREE.Vector3(0, 1, 0));
                Speed = -2 * Math.PI * currentSOI.velocity * currentSOI.body.position.length();
            }
          
            console.log(Speed);
            // Apply gravity capture velocity and newest SOI.
            player.velocity = player.velocity.applyMatrix3(Amat).applyMatrix3(Bmat).addScaledVector(PlanetPrograde, Speed);
            currentSOI = player.current_planet = newPlanet;
        }
    
        // Look up planet information.
        let surfaceHeight = player.current_planet.surface;
        let surfaceGravity = player.current_planet.surfaceGravity;
    
        // Calculate and set up direction (forward)
        const planetWorldPos = new THREE.Vector3(0, 0, 1);
        currentSOI.body.getWorldPosition(planetWorldPos);
        const altDirection = player.handle.localToWorld(new THREE.Vector3(0, 1, 0))
            .sub(worldPos)
            .normalize();
        player.handle.up.set(altDirection.x, altDirection.y, altDirection.z);
    
        // Look at the ground
        player.handle.lookAt(planetWorldPos);

        // Caculate ground
        let playerSize = 0.4 / 2;
        let height = playerSize + surfaceHeight;
        
        // Caculate Gravity
        let heightScaled = playerHeight / surfaceHeight;
        let gravity = surfaceGravity / (heightScaled * heightScaled);

        // Detet and update player grounded attribute.
        player.onGround = playerHeight <= (height + 0.0001);

        // Move player
        let Y = 50 * ((Controls.Keypad.w ? 1 : 0) - (Controls.Keypad.s ? 1 : 0));
        let X = 50 * ((Controls.Keypad.a ? 1 : 0) - (Controls.Keypad.d ? 1 : 0));
        let Z = (Controls.Keypad.space ? (player.onGround ? -10 : 0) : gravity);
        let acceleration = new THREE.Vector3(X, Y, Z );

        // Transform to local coordinates
        let normalMatrix = new THREE.Matrix3().getNormalMatrix(player.handle.matrix);

        if (Controls.Keypad.space) {
            if (!player.onGround) {
                const thrustDirection = player.handle.position.clone().normalize();
                player.velocity.addScaledVector(thrustDirection, 1);
            }
        }
        acceleration.applyMatrix3(normalMatrix);
       
        // Move the player
        player.velocity.addScaledVector(acceleration, delta);
        player.handle.position.addScaledVector(acceleration, 0.5 * delta * delta);
        player.handle.position.addScaledVector(player.velocity, delta);
        playerHeight = player.handle.position.length();
    
        // Caculate atmosphere
        let friction = 0;
        friction = friction + 5 / Math.pow(1 + (playerHeight - height) / height, 2);
    
        // Reset friction if it becomes too extreme/corrupted.
        if (isNaN(friction)) friction = 0;
    
        // Ground collision
        if (playerHeight <= height) {
            player.handle.position.clampLength(height, 100000);
            
            friction += 300;
    
            const speed = player.velocity.length();
            const direction = player.handle.position.clone().normalize();
            player.velocity.addScaledVector(direction, -player.velocity.dot(direction) / speed);
        }

        // Apply friction
        let speedFactor = friction * delta;
        if (speedFactor > 1) speedFactor = 1;
        player.velocity.multiplyScalar(1 - speedFactor);

        // Testing
        player.aim.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / delta);

        // Apply first person looking to the player rotation.
        player.mesh.quaternion.copy(player.aim);
    });

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