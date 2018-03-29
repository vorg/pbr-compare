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
var EquirectangularToCubemap = require('three.equirectangular-to-cubemap')
window.THREE = THREE
require('./loaders/HDRCubeTextureLoader')
require('./loaders/RGBELoader')
require('./pmrem/PMREMGenerator')
require('./pmrem/PMREMCubeUVPacker')

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

var genCubeUrls = function (prefix, postfix) {
  return [
    prefix + 'px' + postfix, prefix + 'nx' + postfix,
    prefix + 'py' + postfix, prefix + 'ny' + postfix,
    prefix + 'pz' + postfix, prefix + 'nz' + postfix
  ]
}

var cubemapUrl = '../assets/Pisa/three/'
var hdrUrls = genCubeUrls(cubemapUrl, '.hdr')
var hdrCubeRenderTarget = null

new THREE.HDRCubeTextureLoader().load(THREE.UnsignedByteType, hdrUrls, function (hdrCubeMap) {
  var pmremGenerator = new THREE.PMREMGenerator(hdrCubeMap)
  pmremGenerator.update(renderer)
  var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods)
  pmremCubeUVPacker.update(renderer)
  var envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture
  loadGLTF(hdrCubeMap, envMap)
})

/*
var textureLoader = new THREE.TextureLoader()
textureLoader.load('../assets/vatican_road_2k.jpg', function (res) {
  var equiToCube = new EquirectangularToCubemap(renderer)
  var envMap = equiToCube.convert(res, 1024)
	// envMap = getEnvMap()
*
*/


function loadGLTF (cubeMap, envMap) {
	var loader = new GLTFLoader()
	loader.load('../assets/FlightHelmet/glTF/FlightHelmet.gltf', function (data) {
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

		var cubeShader = THREE.ShaderLib[ "cube" ];
		var cubeMaterial = new THREE.ShaderMaterial( {
			fragmentShader: cubeShader.fragmentShader,
			vertexShader: cubeShader.vertexShader,
			uniforms: cubeShader.uniforms,
			depthWrite: false,
			side: THREE.BackSide
		} );
		// cubeMap.format = cubeMap.images[0].format
		// cubeMap.type = cubeMap.images[0].type
    // console.log(cubeMap)
		// cubeMaterial.uniforms[ "tCube" ].value = cubeMap;
		// cubeMesh = new THREE.Mesh( new THREE.BoxBufferGeometry( 100, 100, 100 ), cubeMaterial );
		// scene.add( cubeMesh );

		// var geometry = new THREE.SphereBufferGeometry( 400.0, 48, 24 );
		// sphereMaterial = new THREE.MeshLambertMaterial( { envMap: cubeMap } );
		// sphereMesh = new THREE.Mesh( geometry, sphereMaterial );
		// scene.add( sphereMesh );
    //
    scene.background = new THREE.CubeTextureLoader()
					.setPath( cubemapUrl )
					.load( [ 'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png' ] );

    // cubeMap.encoding = THREE.LinearEncoding
			// scene.background = getEnvMap()
			// var ambient = new THREE.AmbientLight(0xFFFFFF)
			// scene.add(ambient)

    scene.add(object)
  })
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
