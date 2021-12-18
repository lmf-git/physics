import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene;

// const lilOne = createSphere(0.5, { x: 0, y: 3, z: 0 }, 2);
// const lilOneTwo = createSphere(0.5, { x: 3, y: 3, z: 3 }, 1);
// const bigOne = createSphere(5, { x: 30, y: 0, z: 0 }, 0);


const lilOne = new THREE.Mesh(
  new THREE.SphereGeometry(.5, 20, 20),
  new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00 })
);
const lilOneTwo = new THREE.Mesh(
  new THREE.SphereGeometry(.75, 20, 20),
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



player.position.set(5, 0, 0);
lilOne.position.set(15, 5, 10)
lilOneTwo.position.set(5, 10, 20)
bigOne.position.set(15, 20, 5)
scene.add(lilOne, lilOneTwo, bigOne);

lilOne.add(player);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 30, 30);
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });

var Keypad = { w: false, a: false, s: false, d: false, space: false }

const update = () => {
  controls.update();

  renderer.render(scene, camera);

    const direction = player.position.clone().normalize();
    direction.multiplyScalar(10);

    let Y = ((Keypad.w ? 1 : 0) - (Keypad.s ? 1 : 0));
    let X = ((Keypad.a ? 1 : 0) - (Keypad.d ? 1 : 0));
    let Z = (Keypad.space ? -10 : 0) + 1;

    player.translateY(Y * 0.1);
    player.translateZ(Z * 0.1);
    player.translateX(X * 0.1);

    //player.position.set(direction.x, direction.y, direction.z);
    //player.velocity.multiply(Friction);
    //player.velocity.addScaledVector(direction, gravity * delta);
    //player.position.addScaledVector(player.velocity, delta);
    player.lookAt(lilOne.position);
    player.position.clampLength(1, 100000);


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
        Keypad.true = false;
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
// Movement around the planet
// Fake gravity
// Get in spaceship (cube)
// Get into orbit
// Escape orbit, enter different SOI*


// * SOI = Sphere of influence






console.log(lilOne.position);
console.log(lilOneTwo.position);
console.log(bigOne.position);