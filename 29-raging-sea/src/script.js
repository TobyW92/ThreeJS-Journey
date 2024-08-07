import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterFragShader from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(15, 15, 1024, 1024)

// Material
const debugObject = {}
debugObject.depthColor = '#186691'
debugObject.surfaceColor = '#9bd8ff'

const waterMaterial = new THREE.ShaderMaterial({
    fragmentShader: waterFragShader,
    vertexShader: waterVertexShader,
    uniforms: {
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },
        uTime: { value: 0 },
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 },
        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallWavesIterations: { value: 4.0 }

    }
})

// Debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('Big Wave Elevation')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('Big Wave Frequency X')
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('Big Wave Frequency Y')
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(10).step(0.001).name('Big Wave Speed')

gui.addColor(debugObject, 'depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value = new THREE.Color(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value = new THREE.Color(debugObject.surfaceColor)
})

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('Color Offset')
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(5).step(0.001).name('Color Multiplier')

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(0.5).step(0.001).name('Small Wave Elevation')
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('Small Wave Frequency')
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(4).step(0.001).name('Small Wave Speed')
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(15).step(1).name('Small Wave Iterations')

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

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
camera.position.set(1, 1, 1)
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update Water
    if (waterMaterial.uniforms.uTime) {
        waterMaterial.uniforms.uTime.value = elapsedTime
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()