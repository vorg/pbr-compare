# PBR Compare

Testing different PBR implementations for glTF in WebGL with HDR Envmaps and IBL.

![](screenshot.jpg)

## Running code

1. First copy `/assets` folder to respective liblary folder eg `/clay/assets`.

2. Compiling
```
cd library_name
npm i
browserify index.js -o bundle.js
```

3. Open repo/index.html or library_name/index.html

## Live demo

[http://vorg.github.io/pbr-compare/index.html](http://vorg.github.io/pbr-compare/index.html)

## Notes

### [ClayGL](http://claygl.xyz)

- I'm using [Advanced Renderer](https://github.com/pissang/claygl-advanced-renderer) for SSAO.
- [ ] There is inconsitency with environment map orientation [#5](https://github.com/vorg/pbr-compare/issues/5)

### [PEX](http://pex.gl)

- [ ] There is inconsitency with environment map orientation
- [ ] There is inconsitency with environment map orientation [#5](https://github.com/vorg/pbr-compare/issues/5)

### [THREE](http://threejs.org)

- [ ] I'm using HDR Cubemap instead of Equirect HDR Panorama [#3](https://github.com/vorg/pbr-compare/issues/3)
- [ ] I'm using LDR Cubemap for Skybox and HDR cubemap for reflections [#4](https://github.com/vorg/pbr-compare/issues/4)

### [BabylonJS](http://babylonjs.com)

- No issues here

### TODO: [Playcanvas](http://playcanvas.com)

- [ ] [Playcanvas GLTF Loader](https://github.com/playcanvas/playcanvas-gltf)


## Credits

**Flight Helmet**
Donated by Microsoft for glTF testing
Created by [Patrick Ryan](https://www.linkedin.com/in/patrickcryan)

**Vatican Road by HDRI Heaven**
https://hdrihaven.com/hdri/?c=outdoor&h=vatican_road

