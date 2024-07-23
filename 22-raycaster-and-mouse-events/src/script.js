import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import GUI from 'lil-gui'

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)
object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

/**
 * Models
 */
const gltfLoader = new GLTFLoader()
let model = null

gltfLoader.load('./models/Duck/glTF-Binary/Duck.glb', (gltf) => {
    model = gltf.scene
    model.position.y = -1.2
    scene.add(model)
})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 2.1)
directionalLight.position.set(1, 2, 3)
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
camera.position.z = 3
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
 * Cursor
 */
let cursor = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX / sizes.width * 2 - 1
    cursor.y = - (e.clientY / sizes.height * 2 - 1)
})

window.addEventListener('click', (e) => {
    if (currentIntersect) {
        currentIntersect.object.material.color.set('#00ff00')
        // console.log(currentIntersect)
    }
    console.log('clicked')
})

let currentIntersect = null
let modelIntersects = null

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    //Raycaster
    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0)
    // rayDirection.normalize()
    // raycaster.set(rayOrigin, rayDirection)
    raycaster.setFromCamera(cursor, camera)

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest)


    // Mouse enter & leave
    if (intersects.length) {
        if (currentIntersect === null) {
            console.log('mouse enter')
        }
        currentIntersect = intersects[0]
    } else {
        if (currentIntersect) {
            console.log('mouse leave')
        }
        currentIntersect = null
    }

    if (model) {
        modelIntersects = raycaster.intersectObject(model)
        console.log(modelIntersects)
        if (modelIntersects.length) {
            model.scale.setScalar(1.2)
        } else {
            model.scale.setScalar(1)
        }
    }
    // modelIntersects = raycaster.intersectObject(model)

    // for (const object of objectsToTest) {
    //     if (object !== currentIntersect) {
    //         object.material.color.set('#ff0000')
    //     }
        
    // }

    // for (const intersect of intersects) {
    //     intersect.object.material.color.set('#0000ff')
    // }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()