import * as THREE from 'https://cdn.skypack.dev/three@0.126.1'
import { OrbitControls } from 'https://unpkg.com/three@0.117.0/examples/jsm/controls/OrbitControls.js'
import * as gui from "https://cdn.skypack.dev/dat.gui@0.7.7"


/*import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js'*/

/*Canvas*/
const canvasA = document.querySelector('.webGl')

/*Texture Loader*/
const textureLoader = new THREE.TextureLoader()
/*Texture*/

/*Sphere Texture*/
textureLoader.crossOrigin = ''
const colorSphereTextureMetalR = textureLoader.load('https://res.cloudinary.com/codiography/image/upload/v1617082584/earth/col_lmnd6s.png')
textureLoader.crossOrigin = ''

const alphaSphereTextureMetalR = textureLoader.load('https://res.cloudinary.com/codiography/image/upload/v1617082584/earth/opa_gczxzy.png')
textureLoader.crossOrigin = ''

const heightSphereTextureMetalR = textureLoader.load('https://res.cloudinary.com/codiography/image/upload/v1617082583/earth/he_tirr8t.png')


/*Cloud Texture*/
textureLoader.crossOrigin = ''

const colorCloudTexture = textureLoader.load('https://res.cloudinary.com/codiography/image/upload/v1617082585/earth/clods_nzvaad.png')


/*Client Viewport*/
const size = {
    width: window.innerWidth,
    height: window.innerHeight,
}

console.log(size.height)

/*Debugger*/
const debugMode = new gui.GUI()
debugMode.closed = true

/*Scene*/
const scene = new THREE.Scene()

/*Objects*/

/*Sphere Material*/ 
const sphereMaterial = new THREE.MeshPhongMaterial()
sphereMaterial.map = colorSphereTextureMetalR
sphereMaterial.aoMap = alphaSphereTextureMetalR
sphereMaterial.aoMapIntensity = .01
sphereMaterial.specularMap = alphaSphereTextureMetalR
sphereMaterial.bumpMap = heightSphereTextureMetalR
sphereMaterial.bumpScale = .05
sphereMaterial.metalness = 0
sphereMaterial.roughness = .3362
sphereMaterial.shininess = 500



/*Debug
debugMode.add(sphereMaterial, 'aoMapIntensity', -10, 10, .1).name('Sphere Intensity')

debugMode.add(sphereMaterial, 'metalness', 0, 1, .001).name('Sphere Metalness')
debugMode.add(sphereMaterial, 'roughness', 0, 1, .001).name('Sphere Roughness')
debugMode.add(sphereMaterial, 'bumpScale', -10, 10, .001).name('Sphere Bump')*/
debugMode.add(sphereMaterial, 'shininess', -100, 10000, .10).name('Sphere Shininess')

/*Sphere*/
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    sphereMaterial
)

/*Sphere Uv2*/
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
)

/*Clouds Material*/
const cloudMaterial = new THREE.MeshPhongMaterial()

cloudMaterial.map = colorCloudTexture
cloudMaterial.transparent = true

/*Cloud*/

const cloud = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.503, 64, 64),
    cloudMaterial
)

/*Object Scene Add*/
scene.add(sphere, cloud)

/*Camera*/
const camera = new THREE.PerspectiveCamera(75, size.width / size.height)
camera.position.z = .84
debugMode.add(camera.position, 'z', -10, 10, .01).name('Zoom')
scene.add(camera)

/*Light*/
const ambientLight = new THREE.AmbientLight(0x99ddff, 0.5)
const pointLight = new THREE.PointLight(0xffffb3)
pointLight.position.x = 75
pointLight.position.y = 25
pointLight.position.z = 100
scene.add(ambientLight, pointLight)

debugMode.add(pointLight.position, 'x', -100, 100, 0.1).name('LightX')
debugMode.add(pointLight.position, 'y', -100, 100, 0.1).name('LightY')
debugMode.add(pointLight.position, 'z', -100, 100, 0.1).name('LightZ')
/*Screen Resize*/
window.addEventListener('resize', () =>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    
    /*/Update Aspect Ratio*/
    camera.aspect = size.width / size.height

    /*Update Projection Matrix*/
    camera.updateProjectionMatrix()

    /*Update Renderer*/
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

/*Renderer*/
const renderer = new THREE.WebGLRenderer({
    canvas: canvasA
})
renderer.setSize(size.width, size.height)



/*Pixel Ratio*/
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/*Control*/
const controls = new OrbitControls(camera, canvasA)
controls.enableDamping = true

/*Time*/
let startTime = Date.now()

/*Clock*/
const clock = new THREE.Clock()

/*Animation*/
const aniA = () =>
{
    const elapsedTime = clock.getElapsedTime()

    /*Time*/
    const currentTime = Date.now()
    const deltaTime = currentTime - startTime
    startTime = currentTime

    /*Update Object*/
    sphere.rotation.y += deltaTime * 0.00003
    cloud.rotation.y += deltaTime * 0.00005

    /*Control Update*/
    controls.update()
    /*render*/
    renderer.render(scene, camera)
    window.requestAnimationFrame(aniA)
}
aniA()