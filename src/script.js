import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js'
import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * 
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Galaxy
const parameters = {}
parameters.cardY = 0
parameters.cardX = 0
parameters.cardZ = 0
parameters.cardYRotate = 0
parameters.cardXRotate = 0
parameters.cardZRotate = 0


let geometry = null;
let material = null;
let points = null;
const firstCardGroup = new THREE.Group()


/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loadingManager: loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loadingManager: loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loadingManager: loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loadingManager: loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)


const generateCard = () => {
    if(points !== null){
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    const loader = new THREE.TextureLoader();

    const cardGeometry = new THREE.BoxGeometry(15, 20, 1)
    let card1Materials
    let card2Materials
    
    const imageTexture = textureLoader.load('/textures/christmas-front.jpg')
    const internalImageTexture1 = textureLoader.load('textures/internal1.jpg')
    const internalImageTexture2 = textureLoader.load('textures/internal2.jpg')
    
    card1Materials = [
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({map: imageTexture}),
        new THREE.MeshBasicMaterial({map: internalImageTexture1}),
    ]
    
    card2Materials = [
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({color: '#d9ccbd'}),
        new THREE.MeshBasicMaterial({map: internalImageTexture2}),
        new THREE.MeshBasicMaterial({color: '#d9ccbd'})
    ]
    
    
    const cardFirst = new THREE.Mesh(cardGeometry, card1Materials)
    const cardSecond = new THREE.Mesh(cardGeometry, card2Materials)
    firstCardGroup.add(cardFirst)
    
    scene.add(firstCardGroup)
    scene.add(cardSecond)
    cardSecond.position.x = 0
    cardFirst.position.x = cardGeometry.parameters.width * 0.5
    firstCardGroup.position.x = -cardGeometry.parameters.width / 2
}

    generateCard()
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
camera.position.x = 0
camera.position.y = 8
camera.position.z = 20
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
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let time = Date.now()

const firstCardOriginRotation = firstCardGroup.rotation.y
console.log(firstCardOriginRotation)
const tick = () =>
{
    // Update controls
    controls.update()

    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime
    
    
    if(firstCardGroup.rotation.y >= -2.9){
        firstCardGroup.rotation.y -= 0.007
    }
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

}

tick()