import * as THREE from '../three/build/three.module.js';
import { GUI } from '../three/examples/jsm/libs/dat.gui.module.js';

/**
 * User Interface
 * @param scene
 * @param renderer
 * @param lights
 * @param fog
 * @param object
 */
export default class UserInteraction {
    constructor(scene, renderer, lights, fog, object) {

        function colorCallback(object, color) {
            object.color.set(color);
        }

        function shadowsCallback(enabled) {
            scene.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
                if (child.material) {
                    child.material.needsUpdate = true;
                }
            });
        }

        /*
        function createEmoteCallback(animations, name) {
            callbacks[name] = function () {
                animations.fadeToAction(name, 0.2);
            };
            emotesFolder.add(callbacks, name);
        }
        */

        // Create the graphical user interface
        this.gui = new GUI({ hideable: false });

        // Create the lights folder
        const lightsFolder = this.gui.addFolder('Lights');

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder('Ambient light');
        const ambientLight = lights.object.ambientLight;
        const ambientColor = { color: '#' + new THREE.Color(ambientLight.color).getHexString() };
        ambientLightFolder.add(ambientLight, 'visible').listen();
        ambientLightFolder.addColor(ambientColor, 'color').onChange(color => colorCallback(ambientLight, color));
        ambientLightFolder.add(ambientLight, 'intensity', 0.0, 1.0, 0.01);

        // Create the directional light folder
        const directionalLightFolder = lightsFolder.addFolder('Directional light');
        const directionalLight = lights.object.directionalLight;
        const directionalColor = { color: '#' + new THREE.Color(directionalLight.color).getHexString() };
        directionalLightFolder.add(directionalLight, 'visible').listen();
        directionalLightFolder.addColor(directionalColor, 'color').onChange(color => colorCallback(directionalLight, color));
        directionalLightFolder.add(directionalLight, 'intensity', 0.0, 1.0, 0.01);
        directionalLightFolder.add(directionalLight.position, 'x', -10.0, 10.0, 0.01);
        directionalLightFolder.add(directionalLight.position, 'y', 0.0, 20.0, 0.01);
        directionalLightFolder.add(directionalLight.position, 'z', -10.0, 10.0, 0.01);

        // Create the camera's spotlight folder
        const cameraSpotLightFolder = lightsFolder.addFolder('Camera\'s Spotlight');
        const cameraSpotLight = lights.object.cameraSpotLight;
        const spotColor = { color: '#' + new THREE.Color(cameraSpotLight.color).getHexString() };
        cameraSpotLightFolder.add(cameraSpotLight, 'visible').listen();
        cameraSpotLightFolder.addColor(spotColor, 'color').onChange(color => colorCallback(spotLight, color));
        cameraSpotLightFolder.add(cameraSpotLight, 'intensity', 0.0, 1.0, 0.01);
        cameraSpotLightFolder.add(cameraSpotLight, 'distance', 0.0, 20.0, 0.01);
        cameraSpotLightFolder.add(cameraSpotLight, 'angle', 0.0, Math.PI / 2.0, 0.01);
        cameraSpotLightFolder.add(cameraSpotLight, 'penumbra', 0.0, 1.0, 0.01);
        cameraSpotLightFolder.add(cameraSpotLight.position, 'x', -10.0, 10.0, 0.01);
        cameraSpotLightFolder.add(cameraSpotLight.position, 'y', 0.0, 20.0, 0.01);
        cameraSpotLightFolder.add(cameraSpotLight.position, 'z', -10.0, 10.0, 0.01);

        // Create the spotlight folder
        const spotLightFolder = lightsFolder.addFolder('Spotlight');
        const spotLight = lights.object.spotLight;
        spotLightFolder.add(spotLight, 'visible').listen();
        spotLightFolder.addColor(spotColor, 'color').onChange(color => colorCallback(spotLight, color));
        spotLightFolder.add(spotLight, 'intensity', 0.0, 1.0, 0.01);
        spotLightFolder.add(spotLight, 'distance', 0.0, 20.0, 0.01);
        spotLightFolder.add(spotLight, 'angle', 0.0, Math.PI / 2.0, 0.01);
        spotLightFolder.add(spotLight, 'penumbra', 0.0, 1.0, 0.01);
        spotLightFolder.add(spotLight.position, 'x', -10.0, 10.0, 0.01);
        spotLightFolder.add(spotLight.position, 'y', 0.0, 20.0, 0.01);
        spotLightFolder.add(spotLight.position, 'z', -10.0, 10.0, 0.01);

        // Create the 2nd spotlight folder
        const spotLightFolder2 = lightsFolder.addFolder('2nd Spotlight');
        const spotLight2 = lights.object.spotLight2;
        spotLightFolder2.add(spotLight2, 'visible').listen();
        spotLightFolder2.addColor(spotColor, 'color').onChange(color => colorCallback(spotLight2, color));
        spotLightFolder2.add(spotLight2, 'intensity', 0.0, 1.0, 0.01);
        spotLightFolder2.add(spotLight2, 'distance', 0.0, 20.0, 0.01);
        spotLightFolder2.add(spotLight2, 'angle', 0.0, Math.PI / 2.0, 0.01);
        spotLightFolder2.add(spotLight2, 'penumbra', 0.0, 1.0, 0.01);
        spotLightFolder2.add(spotLight2.position, 'x', -10.0, 10.0, 0.01);
        spotLightFolder2.add(spotLight2.position, 'y', 0.0, 20.0, 0.01);
        spotLightFolder2.add(spotLight2.position, 'z', -10.0, 10.0, 0.01);

        // Create the flashlight folder
        const flashLightFolder = lightsFolder.addFolder('Flashlight');
        const flashLight = lights.object.flashLight;
        const flashColor = { color: '#' + new THREE.Color(flashLight.color).getHexString() };
        flashLightFolder.add(flashLight, 'visible').listen();
        flashLightFolder.addColor(flashColor, 'color').onChange(color => colorCallback(flashLight, color));
        flashLightFolder.add(flashLight, 'intensity', 0.0, 1.0, 0.01);
        flashLightFolder.add(flashLight, 'distance', 0.0, 20.0, 0.01);
        flashLightFolder.add(flashLight, 'angle', 0.0, Math.PI / 2.0, 0.01);
        flashLightFolder.add(flashLight, 'penumbra', 0.0, 1.0, 0.01);

        // Create the shadows folder
        const shadowsFolder = this.gui.addFolder('Shadows');
        shadowsFolder.add(renderer.shadowMap, 'enabled').onChange(enabled => shadowsCallback(enabled));

        // Create the fog folder
        const fogFolder = this.gui.addFolder('Fog');
        const fogColor = { color: '#' + new THREE.Color(fog.color).getHexString() };
        fogFolder.add(fog, 'enabled').listen();
        fogFolder.addColor(fogColor, 'color').onChange(color => colorCallback(fog.object, color));
        fogFolder.add(fog.object, 'near', 0.01, 1.0, 0.01);
        fogFolder.add(fog.object, 'far', 1.01, 20.0, 0.01);

        // Create the character folder
        const characterFolder = this.gui.addFolder('Character');

        // Create the emotes folder and add emotes
        const emotesFolder = characterFolder.addFolder('Emotes');
        const callbacks = [];
       /*
       for (let i = 0; i < animations.emotes.length; i++) {
            createEmoteCallback(animations, animations.emotes[i]);
        }
        */

        // Create the expressions folder and add expressions
        const expressionsFolder = characterFolder.addFolder('Expressions');
        const face = object.getObjectByName('Head_4');
        /*
        const expressions = Object.keys(face.morphTargetDictionary);
        for (let i = 0; i < expressions.length; i++) {
            expressionsFolder.add(face.morphTargetInfluences, i, 0.0, 1.0, 0.01).name(expressions[i]);
        }
        */
    }

    setVisibility(visible) {
        if (visible) {
            this.gui.show();
        }
        else {
            this.gui.hide();
        }
    }
}