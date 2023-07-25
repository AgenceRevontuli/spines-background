import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


/**
 * Canvas
 */
const canvas = document.querySelector('canvas#canvas')

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Update sizes to screen resizes 
window.addEventListener('resize', () => {
  // Update sizes 
  sizes.width = innerWidth
  sizes.height = innerHeight
  // Update Camera 
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Update Render 
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Scene 
 */
const scene = new THREE.Scene()

/**
 * Objects
 */
const box = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(box)


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

/**
 * Controls 
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animations
 */

const clock = new THREE.Clock

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update Renderer 
  renderer.render(scene, camera)

  // Call tick on all frames
  window.requestAnimationFrame(tick)
}

tick()