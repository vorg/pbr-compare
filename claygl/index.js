
document.documentElement.style.height = '100%'
const clay = require('claygl')
const ClayAdvancedRenderer = require('./claygl-advanced-renderer')

document.body.style.height = '100%'
document.body.style.margin = '0'

var canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = '100%'
canvas.id = 'viewport'
document.body.appendChild(canvas)

const panoramaUrl = '../assets/Pisa/pisa.hdr'
var app = clay.application.create('#viewport', {

    // Auto render should be disabled when using ClayAdvancedRenderer
    autoRender: false,

    init: function (app) {
        // Create camera
        this._camera = app.createCamera([0.482, 0.258, 0.836], [0, 0, 0]);
        this._camera.fov = 0.8 / Math.PI * 180
        this._camera.updateProjectionMatrix()

        this._advancedRenderer = new ClayAdvancedRenderer(app.renderer, app.scene, app.timeline, {
          shadow: true,
          temporalSuperSampling: {
            enable: true
          },
          postEffect: {
            enable: true,
            bloom: {
              enable: false
            },
            screenSpaceAmbientOcclusion: {
              temporalFilter: true,
              enable: true,
              intensity: 1,
              radius: 0.5
            },
            FXAA: {
              enable: true
            }
          }
        });

        // Create light
        // app.createDirectionalLight([-1, -1, -1]);

        // Use orbit control
        this._control = new clay.plugin.OrbitControl({
            // The target or orbit control. Usually is a camera.
            target: this._camera,
            // The HTMLDomElement where we need to addEventListener.
            domElement: app.container
        });

        this._control.on('update', function () {
           this._advancedRenderer.render();
        }, this);

        app.createAmbientCubemapLight(panoramaUrl, 1, 1, 0)//0.009125);

        var cubemap = new clay.TextureCube();
        app.loadTexture(panoramaUrl, {
            flipY: false,
            exposure: 0
        }).then(function (panoramaTexture) {
            // Convert panorama to a cubemap
            clay.util.texture.panoramaToCubeMap(app.renderer, panoramaTexture, cubemap);

            var skybox = new clay.plugin.Skybox({
                // Attach skybox to the scene.
                scene: app.scene,
                // Use the cubemap as environment
                environmentMap: cubemap
            });
        }).catch((e) => console.log(e));

        var xAxis = app.createCube({ color: 'red' });
        // looks like cube is -1, 1, not 0.5, 0.5 so we scale by 2 not 4
        xAxis.scale.x = 0.4 / 2
        xAxis.scale.y = 0.003 / 2
        xAxis.scale.z = 0.003 / 2
        xAxis.position.x = 0.2;

        var yAxis = app.createCube({ color: 'green' });
        yAxis.scale.x = 0.003 / 2
        yAxis.scale.y = 0.4 / 2
        yAxis.scale.z = 0.003 / 2
        yAxis.position.y = 0.2;

        var zAxis = app.createCube({ color: 'blue' });
        zAxis.scale.x = 0.003 / 2
        zAxis.scale.y = 0.003 / 2
        zAxis.scale.z = 0.4 / 2
        zAxis.position.z = 0.2;

        this._advancedRenderer.render();

        // Load model. return a load promise to make sure the look will be start after model loaded.
        return app.loadModel('../assets/FlightHelmet/glTF/FlightHelmet.gltf').then(function (scene) {
          // scene.meshes.forEach((m) => m.material.set('environmentMap', cubemap))
        }).catch((e) => console.log(e))
    },

    loop: function (app) {
        // Control status must be updated each frame.
        this._control.update(app.frameTime);
    }
});
