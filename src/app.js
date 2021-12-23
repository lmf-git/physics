import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene;




const lilOne = new THREE.Mesh(
  new THREE.SphereGeometry(1, 20, 20),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
);
const lilOneTwo = new THREE.Mesh(
  new THREE.SphereGeometry(1, 20, 20),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
);
const bigOne = new THREE.Mesh(
  new THREE.SphereGeometry(5, 20, 20),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
);

const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, 0.4),
    new THREE.MeshBasicMaterial({  color: 0xffff00 })
);



//todo precaculate soi sise
const solarSystem = {
    name: "sun",
    body: bigOne,
    surface: 5,
    SOISise: 1000,
    surfaceGravity: 300,
    children: [
        {
            name: "lilOne",
            body: lilOne,
            surface: 1,
            SOISise: 10,
            surfaceGravity: 1000,
            children: []
        },
        {
            name: "lilOneTwo",
            body: lilOneTwo,
            surface: 1,
            SOISise: 10,
            surfaceGravity: 1000,
            children: []
        }
    ]
};

var depthQueue = [solarSystem];
var currentItem = solarSystem.children[1];


player.position.set(5, 0, 0);
lilOne.position.set(15, 5, 10)
lilOneTwo.position.set(5, 10, 20)
bigOne.position.set(15, 20, 5)
scene.add(lilOne, lilOneTwo, bigOne);

lilOneTwo.add(player);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 30, 30);
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });

var velocity = new THREE.Vector3(0, 0, 0);
var Keypad = { w: false, a: false, s: false, d: false, space: false }

const update = () => {
    controls.update();

    renderer.render(scene, camera);

    let currentPlanet = currentItem;

    let SoiLimit = currentItem.SOISise;

    //get player data
    var worldPos = new THREE.Vector3(0, 0, 1);
    player.getWorldPosition(worldPos);
    let playerHeight = player.position.length();

    //check soi
    let newPlanet = null;
    if (playerHeight > SoiLimit) {
        newPlanet = depthQueue.pop();
    } else {
        const matches = currentPlanet.children.filter(item => {
            let distance2 = item.body.position.distanceToSquared(worldPos);
            return distance2 < item.SOISise * item.SOISise;
        });
        if (matches[0]) {
            newPlanet = matches[0];
            depthQueue.push(currentPlanet);
        }
        
    }

    //change planet if needed
    if (newPlanet) { //leaving the soi

        const newitem = newPlanet;
        const oldbody = currentPlanet.body;
        const newbody = newitem.body;
        newbody.attach(player);

        // Transform velocity to new cordinate frame
        let Amat = new THREE.Matrix3().getNormalMatrix(oldbody.matrixWorld).invert();
        let Bmat = new THREE.Matrix3().getNormalMatrix(newbody.matrixWorld);
        velocity = velocity.applyMatrix3(Amat).applyMatrix3(Bmat);

        currentPlanet = currentItem = newitem;
    } else {
        //check the children here
    }

    // look up planet infomation
    let surfaceHeight = currentItem.surface;
    let surfaceGravity = currentItem.surfaceGravity;
    const planetbody = currentPlanet.body;

    let direction = player.position.clone().normalize();

    //caculate and set up direction(forward)


    const altDirection = player.localToWorld(new THREE.Vector3(0, 1, 0)).sub(worldPos).normalize();
    player.up.set(altDirection.x, altDirection.y, altDirection.z);

    // Look at the ground
    player.lookAt(planetbody.position);

    let Altatude

    let delta = 0.01;

    //Caculate ground
    let playerSize = 0.4 / 2;
    let height = playerSize + surfaceHeight;
    

    //Caculate Gravity
    let heightScaled = playerHeight / surfaceHeight;
    let gravity = surfaceGravity / (heightScaled * heightScaled);

    // Move player
    let Y = 50 *((Keypad.w ? 1 : 0) - (Keypad.s ? 1 : 0));
    let X = 50 * ((Keypad.a ? 1 : 0) - (Keypad.d ? 1 : 0));
    let Z = (Keypad.space ? -10 : gravity);
    let acceleration = new THREE.Vector3(X, Y, Z );

    // Transform to local cordinates
    let normalMatrix = new THREE.Matrix3().getNormalMatrix(player.matrixWorld);
    acceleration.applyMatrix3(normalMatrix);
   
    // Move the player
    velocity.addScaledVector(acceleration, delta);
    player.position.addScaledVector(velocity, delta);


    // Caculate Atmosphere
    let friction = 0;
    friction = friction + 5 / Math.pow(1 + (playerHeight - height) / height, 2);

    if (isNaN(friction)) 
        friction = 0;

    friction = 0;

    // Ground collision
    if (playerHeight < height) {
        player.position.clampLength(height, 100000);
        friction = friction + 100;
        let speed = velocity.length();
       
        velocity.addScaledVector(direction, -velocity.dot(direction) / speed);
    }


  
    // Apply friction.
    velocity.multiplyScalar(1 - friction * delta);

   

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


document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, false);

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {
        Keypad.w = true;
    } else if (keyCode == 83) {
        Keypad.s = true;
    } else if (keyCode == 65) {
        Keypad.a = true;
    } else if (keyCode == 68) {
        Keypad.d = true;
    } else if (keyCode == 32) {
        Keypad.space = true;
    }
    return false;
};


function onDocumentKeyUp(event) {
    var keyCode = event.which;

    if (keyCode == 87) {
        Keypad.w = false;
    } else if (keyCode == 83) {
        Keypad.s = false;
    } else if (keyCode == 65) {
        Keypad.a = false;
    } else if (keyCode == 68) {
        Keypad.d = false;
    } else if (keyCode == 32) {
        Keypad.space = false;
    }
    return false;
};


/** NEXT STEPS */
// Movement around the planet - done
// Fake gravity - done
// real gravity - done
// Get into orbit - done
// Get in spaceship (cube)
// Escape orbit, enter different SOI*


// * SOI = Sphere of influence

console.log(lilOne.position);
console.log(lilOneTwo.position);
console.log(bigOne.position);