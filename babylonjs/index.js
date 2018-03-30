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

var panoramaUrl = '../assets/Pisa/pisa.hdr'
var hdrTexture = new BABYLON.HDRCubeTexture(panoramaUrl, scene, 512);
// var hdrTexture = new BABYLON.HDRCubeTexture("/assets/OpenfootageNET_Staatsbridge_HDRI_low.hdr", scene, 512);
var hdrSkybox = scene.createDefaultSkybox(hdrTexture, true);

var dir = '../assets/FlightHelmet/glTF/'
var file = 'FlightHelmet.gltf'
BABYLON.SceneLoader.Append(dir, file, scene, function (newScene) {
});

var xAxis = BABYLON.MeshBuilder.CreateBox("xAxis", {height: 0.03, width: 4, depth: 0.03}, scene);
xAxis.material = new BABYLON.StandardMaterial("myMaterial", scene);
xAxis.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
xAxis.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
xAxis.position = new BABYLON.Vector3(2, 0, 0)

var yAxis = BABYLON.MeshBuilder.CreateBox("yAxis", {height: 4, width: 0.03, depth: 0.03}, scene);
yAxis.material = new BABYLON.StandardMaterial("myMaterial", scene);
yAxis.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
yAxis.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
yAxis.position = new BABYLON.Vector3(0, 2, 0)

var zAxis = BABYLON.MeshBuilder.CreateBox("yAxis", {height: 0.03, width: 0.03, depth: 4}, scene);
zAxis.material = new BABYLON.StandardMaterial("myMaterial", scene);
zAxis.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
zAxis.material.emissiveColor = new BABYLON.Color3(0, 0, 1);
zAxis.position = new BABYLON.Vector3(0, 0, 2)

// var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

engine.runRenderLoop(function() {
  scene.render();
});

window.addEventListener('resize', function() {
  engine.resize();
});
