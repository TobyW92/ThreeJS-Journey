import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const flagTexture = textureLoader.load('./textures/flag-french.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 320, 320)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

// Material
// const material = new THREE.MeshBasicMaterial()
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    uniforms: {
        uTime: {
            value: 0
        },
        uFrequency: {
            value: new THREE.Vector2(10, 5)
        },
        uColor: {
            value: new THREE.Color('orange')
        },
        uTexture: {
            value: flagTexture
        }
    }
})

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('freqX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('freqY')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // console.log(elapsedTime)
    material.uniforms.uTime.value = elapsedTime

    // material.uniforms.uFrequency.value.x = (Math.sin(elapsedTime) - 0.5) * 10
    // material.uniforms.uFrequency.value.y = (Math.sin(elapsedTime) - 0.5) * 5
    // material.uniforms.uFrequency.value.x = deltaTime * 10
    // material.uniforms.uFrequency.value.y = deltaTime * 5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()