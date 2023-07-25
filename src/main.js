import './style.css'
import * as THREE from 'three'
import vertexGradient from './shaders/vertex.glsl'
import fragmentGradient from './shaders/fragment.glsl'
import Stats from 'stats.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexGrain from './shaders/grain/vertex.glsl'
import fragmentGrain from './shaders/grain/fragment.glsl'

/**
 * Performances
 */
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)


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
 * Colors 
 */
let colors = [
  '#bababa', 
  '#c54787',
  '#414060',
  '#414572',
  '#d47fa6'
]

// Convert to threejs colors 
colors = colors.map((color) => new THREE.Color(color))
console.log(colors)

/**
 * Scene 
 */
const scene = new THREE.Scene()

/**
 * Objects
 */
const gradient = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 70, 70),
  new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.5 }, 
      uColor: { value: colors }
    },
    vertexShader: vertexGradient, 
    fragmentShader: fragmentGradient, 
    wireframe: false, 
    side: THREE.DoubleSide
  })
)
console.log(gradient)
scene.add(gradient)


/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0,0,0.2)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/** 
 * Post Processing
 */
const effectComposer = new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

let counter = 100

const GrainShader = {
  uniforms:{
    tDiffuse: { value: null },
    uAmount: { value: counter }
  }, 
  vertexShader: vertexGrain,
  fragmentShader: fragmentGrain,
}
const grainShader = new ShaderPass(GrainShader)
effectComposer.addPass(grainShader)


/**
 * Animations
 */

const clock = new THREE.Clock

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  stats.begin()

  // Update uTime 
  gradient.material.uniforms.uTime.value = elapsedTime * 0.005

  // Update Renderer 
  // renderer.render(scene, camera)
  effectComposer.render()


  // Call tick on all frames
  window.requestAnimationFrame(tick)

  stats.end()
}

tick()