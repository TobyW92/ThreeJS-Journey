import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/addons/objects/Sky.js'
import { Timer } from 'three/addons/misc/Timer.js'
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const floorAlpha = textureLoader.load('./floor/alpha.jpg')
const floorDisp = textureLoader.load('./floor/coast_sand_rocks_02_1k/disp.jpg')
const floorARM = textureLoader.load('./floor/coast_sand_rocks_02_1k/arm.jpg')
const floorNor = textureLoader.load('./floor/coast_sand_rocks_02_1k/nor.jpg')
const floorDiff = textureLoader.load('./floor/coast_sand_rocks_02_1k/diff.jpg')

floorDiff.colorSpace = THREE.SRGBColorSpace
floorDiff.repeat.set(8, 8)
floorDiff.wrapS = THREE.RepeatWrapping
floorDiff.wrapT = THREE.RepeatWrapping

floorDisp.repeat.set(8, 8)
floorDisp.wrapS = THREE.RepeatWrapping
floorDisp.wrapT = THREE.RepeatWrapping

floorARM.repeat.set(8, 8)
floorARM.wrapS = THREE.RepeatWrapping
floorARM.wrapT = THREE.RepeatWrapping

floorNor.repeat.set(8, 8)
floorNor.wrapS = THREE.RepeatWrapping
floorNor.wrapT = THREE.RepeatWrapping

const wallARM = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg')
const wallDiff = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
const wallNor = textureLoader.load('./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg')

wallDiff.colorSpace = THREE.SRGBColorSpace

const roofARM = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg')
const roofDiff = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg')
const roofNor = textureLoader.load('./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg')

roofDiff.colorSpace = THREE.SRGBColorSpace
roofDiff.repeat.set(3, 1)
roofARM.repeat.set(3, 1)
roofNor.repeat.set(3, 1)
roofDiff.wrapS = THREE.RepeatWrapping
roofARM.wrapS = THREE.RepeatWrapping
roofNor.wrapS = THREE.RepeatWrapping

const bushARM = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg')
const bushDiff = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg')
const bushNor = textureLoader.load('./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg')

bushDiff.colorSpace = THREE.SRGBColorSpace
bushDiff.repeat.set(2, 1)
bushARM.repeat.set(2, 1)
bushNor.repeat.set(2, 1)
bushDiff.wrapS = THREE.RepeatWrapping
bushARM.wrapS = THREE.RepeatWrapping
bushNor.wrapS = THREE.RepeatWrapping

const graveARM = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg')
const graveDiff = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg')
const graveNor = textureLoader.load('./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg')

graveDiff.colorSpace = THREE.SRGBColorSpace
graveDiff.repeat.set(0.3, 0.4)
graveARM.repeat.set(0.3, 0.4)
graveNor.repeat.set(0.3, 0.4)

const doorAlpha = textureLoader.load('./door/alpha.jpg')
const doorDiff = textureLoader.load('./door/color.jpg')
const doorNor = textureLoader.load('./door/normal.jpg')
const doorAO = textureLoader.load('./door/ambientOcclusion.jpg')
const doorMetal= textureLoader.load('./door/metalness.jpg')
const doorRough = textureLoader.load('./door/roughness.jpg')
const doorDisp = textureLoader.load('./door/height.jpg')

doorDiff.colorSpace = THREE.SRGBColorSpace


/**
 * House
 */
const houseMeasurements = {
    height: 2.5,
    width: 4,
    depth: 4,
    roof: {
        radius: 3.5,
        height: 1.5,
        segments: 4
    },
    door: {
        height: 2.2,
        width: 2.2
    }
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: floorAlpha,
        map: floorDiff,
        aoMap: floorARM,
        roughnessMap: floorARM,
        metalnessMap: floorARM,
        normalMap: floorNor,
        displacementMap: floorDisp,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
)

// gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Floor Displacement Bias')
// gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Floor Displacement Scale')

// Rotation takes radians. To convert degrees to radians the formula deg * (PI / 180) is used.
// floor.rotation.x = - 90 * (Math.PI / 180)
// This yields the same result with less code. A full 360 deg rotation in radians is 2 PI, so 0.5 is equal to 90 deg.
floor.rotation.x = - Math.PI * 0.5 // Same as 90 deg
scene.add(floor)

// House Container
const house = new THREE.Group()
scene.add(house)

// House Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseMeasurements.width, houseMeasurements.height, houseMeasurements.depth),
    new THREE.MeshStandardMaterial({
        map: wallDiff,
        aoMap: wallARM,
        roughnessMap: wallARM,
        metalnessMap: wallARM,
        normalMap: wallNor,
    })
)
walls.position.y = houseMeasurements.height / 2;
house.add(walls)

// House Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(houseMeasurements.roof.radius, houseMeasurements.roof.height, houseMeasurements.roof.segments),
    new THREE.MeshStandardMaterial({
        map: roofDiff,
        aoMap: roofARM,
        roughnessMap: roofARM,
        metalnessMap: roofARM,
        normalMap: roofNor,
    })
)
roof.position.y = houseMeasurements.height + (houseMeasurements.roof.height / 2)
roof.rotation.y = Math.PI * 0.25 // Same as 45 deg
house.add(roof)

// House Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(houseMeasurements.door.width, houseMeasurements.door.height, 100, 100),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: doorAlpha,
        map: doorDiff,
        aoMap: doorAO,
        roughnessMap: doorRough,
        metalnessMap: doorMetal,
        normalMap: doorNor,
        displacementMap: doorDisp,
        displacementScale: 0.15,
        displacementBias: -0.04
    })
)
door.position.y = houseMeasurements.door.height / 2
door.position.z = houseMeasurements.depth / 2 + .01
house.add(door)

// gui.add(door.material, 'displacementBias').min(-1).max(1).step(0.001).name('Door Displacement Bias')
// gui.add(door.material, 'displacementScale').min(0).max(1).step(0.001).name('Door Displacement Scale')

// Bushes
const bushGemoetry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushDiff,
    aoMap: bushARM,
    roughnessMap: bushARM,
    metalnessMap: bushARM,
    normalMap: bushNor,
})

const bush1 = new THREE.Mesh(bushGemoetry, bushMaterial)
bush1.scale.setScalar(0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = - 0.75

const bush2 = new THREE.Mesh(bushGemoetry, bushMaterial)
bush2.scale.setScalar(0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = - 0.75

const bush3 = new THREE.Mesh(bushGemoetry, bushMaterial)
bush3.scale.setScalar(0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = - 0.75

const bush4 = new THREE.Mesh(bushGemoetry, bushMaterial)
bush4.scale.setScalar(0.15)
bush4.position.set(-1, 0.15, 2.6)
house.add(bush1, bush2, bush3, bush4)
bush4.rotation.x = - 0.75

// Graves
const graveGemoetry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveDiff,
    aoMap: graveARM,
    roughnessMap: graveARM,
    metalnessMap: graveARM,
    normalMap: graveNor,
})

const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
    const grave = new THREE.Mesh(graveGemoetry, graveMaterial)

    // Get a random angle between 0 and 360 degrees - PI * 2 = full rotation in radians
    const angle = Math.random() * Math.PI * 2

    // Radius to place is minimum of 3, with a random factor to include 3-7 range
    const radius = 3 + Math.random() * 4

    // Cos and sin are mathemathical functions for x and y cordinate of a circle
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    // Add random factor for height, up to half height so not floating
    const y = Math.random() * 0.4

    // Add a random rotation amount so they are less uniform looking, sinking in ground, etc
    // Math random is between 0 and 1, so by subtracting 0.5 we can get a number -0.5 to 0.5, so we have both forward and backward tilts.
    // Multiply by 0.4 to reduce intensity
    const rotation = {
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 0.4,
        z: (Math.random() - 0.5) * 0.4
    }

    grave.position.set(x, y, z)
    grave.rotation.set(rotation.x, rotation.y, rotation.z)

    graves.add(grave)
}


/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door Light
const doorLight = new THREE.PointLight('#ff7d46', 5)
doorLight.position.set(0, 2.2, 2.5)
house.add(doorLight)

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#8800ff', 6)
const ghost2 = new THREE.PointLight('#ff0088', 6)
const ghost3 = new THREE.PointLight('#ff0000', 6)
scene.add(ghost1, ghost2, ghost3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true
door.receiveShadow = true

for (const grave of graves.children) {
    grave.castShadow = true
    grave.receiveShadow = true
}

// Shadow Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = - 8
directionalLight.shadow.camera.left = - 8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.setScalar(100)
scene.add(sky)
sky.material.uniforms['turbidity'].value = 10
sky.material.uniforms['rayleigh'].value = 3
sky.material.uniforms['mieCoefficient'].value = 0.1
sky.material.uniforms['mieDirectionalG'].value = 0.95
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95)

/**
 * Fog
 */
scene.fog = new THREE.FogExp2('#02343f', 0.1)


/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Ghost
    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x  = Math.cos(ghost1Angle) * 4
    ghost1.position.z  = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)
    const ghost2Angle = - elapsedTime * 0.38
    ghost2.position.x  = Math.cos(ghost2Angle) * 5
    ghost2.position.z  = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)
    const ghost3Angle = elapsedTime * 0.23
    ghost3.position.x  = Math.cos(ghost3Angle) * 7
    ghost3.position.z  = Math.sin(ghost3Angle) * 7
    ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()