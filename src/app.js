import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as CANNON from 'cannon-es';


// https://ai-gallery.vercel.app

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('#canvas')

// Scene
const scene = new THREE.Scene()

/**
 * Physics
 */
const world = new CANNON.World()

world.gravity.set(0, -9.82, 0)

world.broadphase = new CANNON.SAPBroadphase(world)

world.allowSleep = true

const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
  friction: 0.1,
  restitution: 0.7,
})

world.defaultContactMaterial = defaultContactMaterial

const floorShape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.01))

const floorBody = new CANNON.Body()

floorBody.addShape(floorShape)

floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

world.addBody(floorBody)

/**
 * Utils
 */
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)

const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4
})

const objectsToUpdate = []

const createSphere = (radius, position) => {
  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)

  mesh.castShadow = true
  mesh.position.copy(position)

  mesh.scale.set(radius, radius, radius)

  scene.add(mesh)

  const shape = new CANNON.Sphere(radius)

  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
  })

  body.position.copy(position)

  world.addBody(body)

  objectsToUpdate.push({ mesh, body })
}

createSphere(0.5, { x: 0, y: 3, z: 0 })

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4
  }),
)

floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5

scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const update = () => {
  const elapsedTime = clock.getElapsedTime()

  const deltaTime = elapsedTime - oldElapsedTime

  oldElapsedTime = elapsedTime

  world.step(1 / 60, deltaTime, 3)

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion)
  }

  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(update)
}

update()
