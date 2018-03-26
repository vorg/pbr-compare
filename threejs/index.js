var style = document.createElement('style')
style.innerHTML = `
body { margin: 0; }
canvas { width: 100%; height: 100% }
`
document.head.appendChild(style)

var container = document.createElement('div')
container.id = 'container'
document.body.appendChild(container)

var THREE = require('three')
var OrbitControls = require('three-orbit-controls')(THREE)
var GLTFLoader = require('three-gltf-loader')
var EquirectangularToCubemap = require( 'three.equirectangular-to-cubemap' )

var renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.gammaOutput = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
container.appendChild(renderer.domElement)

var scene = new THREE.Scene()
scene.background = new THREE.Color(0x222222)
var camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.001, 100)
var orbitControls = new OrbitControls(camera, renderer.domElement)
camera.position.set(4.82, 2.588, 8.36)
orbitControls.update()

var textureLoader = new THREE.TextureLoader()
textureLoader.load( 'assets/vatican_road_2k.jpg', function( res ) {
	var equiToCube = new EquirectangularToCubemap( renderer )
	var envMap = equiToCube.convert( res, 1024 )
	// envMap = getEnvMap()
	var loader = new GLTFLoader()
	loader.load('assets/FlightHelmet/gltf/FlightHelmet.gltf', function (data) {
			var gltf = data
			var object = gltf.scene

			object.traverse(function (node) {
				if (node.isMesh) node.castShadow = true
			})
			object.traverse(function (node) {
				if (node.material && (node.material.isMeshStandardMaterial ||
					(node.material.isShaderMaterial && node.material.envMap !== undefined))) {
					node.material.envMap = envMap
					node.material.needsUpdate = true
				}
			})

			scene.background = envMap
			// scene.background = getEnvMap()
			// var ambient = new THREE.AmbientLight(0xFFFFFF)
			// scene.add(ambient)

			scene.add(object)
		})

})

function getEnvMap() {
	var path = 'assets/Park2/'
	var format = '.jpg'
	var urls = [
		path + 'posx' + format, path + 'negx' + format,
		path + 'posy' + format, path + 'negy' + format,
		path + 'posz' + format, path + 'negz' + format
	]
	var envMap = new THREE.CubeTextureLoader().load( urls )
	envMap.format = THREE.RGBFormat
	return envMap
}


function onWindowResize () {
  camera.aspect = container.offsetWidth / container.offsetHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  orbitControls.update()
  renderer.render(scene, camera)
}

animate()
