const BABYLON = require('babylonjs')
require('babylonjs-loaders')

document.documentElement.style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = '0'

var canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = '100%'
document.body.appendChild(canvas)

var engine = new BABYLON.Engine(canvas, true);

var scene = new BABYLON.Scene(engine);

var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2 + Math.PI / 6, Math.PI / 2 - Math.PI / 12, 10, new BABYLON.Vector3(0, 0, 0), scene);
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, false);
console.log(camera.position)

var hdrTexture = new BABYLON.HDRCubeTexture('/assets/vatican_road_2k.hdr', scene, 512);
// var hdrTexture = new BABYLON.HDRCubeTexture("/assets/OpenfootageNET_Staatsbridge_HDRI_low.hdr", scene, 512);
var hdrSkybox = scene.createDefaultSkybox(hdrTexture, true);

var dir = 'assets/FlightHelmet/gltf/'
var file = 'FlightHelmet.gltf'
BABYLON.SceneLoader.Append(dir, file, scene, function (newScene) {
});

engine.runRenderLoop(function() {
  scene.render();
});

window.addEventListener('resize', function() {
  engine.resize();
});
