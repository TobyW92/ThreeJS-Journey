import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { mix } from 'three/examples/jsm/nodes/Nodes.js'
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
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer
let animations = []
let survey;
let walk;
let run;
const ship = new THREE.Group()
scene.add(ship)

const textureLoader = new THREE.TextureLoader()
const newColor = textureLoader.load('./models/ssgltf/textures/StarSparrow_Material_baseColor2.png')

gltfLoader.load(
    // './models/Fox/glTF/Fox.gltf',
    './models/ssgltf/scene.gltf',
    (gltf) => {
        console.log(gltf)
        mixer = new THREE.AnimationMixer(gltf.scene)
        // console.log(mixer)
        for (const animation of gltf.animations) {
            animations.push(animation)
        }
        gltf.scene.traverse((e) => {
            if (e.type == 'Mesh') {
                console.log(e.material.map)
                // e.material.color.set('#00ff00')
                // e.material.map.source = newColor.source

            }
            // console.log(newColor)
            // console.log(e)
        })
        survey = mixer.clipAction(animations[0])
        // walk = mixer.clipAction(animations[1])
        // run = mixer.clipAction(animations[2])
        console.log(newColor)
        survey.play()
        survey.loop = THREE.LoopPingPong

        // gltf.scene.scale.setScalar(0.025)
        ship.add(gltf.scene)
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log('error')
        console.log(error)
    }
)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

let z = 0;


const changeShipColor = () => {
    ship.traverse((e) => {
        if (e.type == 'Mesh') {
            // e.material.map = newColor
            e.material.map.source = newColor.source
            e.material.map.needsUpdate = true
        }
    })
}


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update Mixer
    if (mixer != null) {

        if (z == 0) {
            setTimeout(changeShipColor, 2000)
            z++
        }

        mixer.update(deltaTime)
    }
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()