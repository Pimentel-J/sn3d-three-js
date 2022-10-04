import * as THREE from '../three/build/three.module.js';

/**
 * Lights
 * 
 * @parameters = {
 *  ambientLight: { visible: Boolean, color: Color, intensity: Number },
 *  directionalLight: { visible: Boolean, color: Color, intensity: Number, position: Vector3 },
 *  spotLight: { visible: Boolean, color: Color, intensity: Number, distance: Number, angle: Number, penumbra: Number, position: Vector3 },
 *  flashLight: { visible: Boolean, color: Color, intensity: Number, distance: Number, angle: Number, penumbra: Number }
 * }
 */
export default class Lights {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Create a group of objects
        this.object = new THREE.Group();

        // Create the ambient light
        this.object.ambientLight = new THREE.AmbientLight(this.ambientLight.color, this.ambientLight.intensity);
        this.object.ambientLight.visible = this.ambientLight.visible;
        this.object.add(this.object.ambientLight);

        // Create the directional light and turn on shadows for this light
        this.object.directionalLight = new THREE.DirectionalLight(this.directionalLight.color, this.directionalLight.intensity);
        this.object.directionalLight.position.set(this.directionalLight.position.x, this.directionalLight.position.y, this.directionalLight.position.z);
        this.object.directionalLight.castShadow = true;

        // Set up shadow properties for this light
        this.object.directionalLight.shadow.mapSize.width = 512;
        this.object.directionalLight.shadow.mapSize.height = 512;
        this.object.directionalLight.shadow.camera.left = -10.0;
        this.object.directionalLight.shadow.camera.right = 10.0;
        this.object.directionalLight.shadow.camera.top = 10.0;
        this.object.directionalLight.shadow.camera.bottom = -10.0;
        this.object.directionalLight.shadow.camera.near = 5.0;
        this.object.directionalLight.shadow.camera.far = 15.0;
        this.object.directionalLight.visible = this.directionalLight.visible;
        this.object.add(this.object.directionalLight);

        // Create the spotlight and turn on shadows for this light
        this.object.spotLight = new THREE.SpotLight(this.spotLight.color, this.spotLight.intensity, this.spotLight.distance, this.spotLight.angle, this.spotLight.penumbra);
        this.object.spotLight.position.set(this.spotLight.position.x, this.spotLight.position.y, this.spotLight.position.z);
        this.object.spotLight.castShadow = true;

        // Set up shadow properties for this light
        this.object.spotLight.shadow.mapSize.width = 512;
        this.object.spotLight.shadow.mapSize.height = 512;
        this.object.spotLight.shadow.camera.near = 5.0;
        this.object.spotLight.shadow.camera.far = 15.0;
        this.object.spotLight.shadow.camera.focus = 1.0;
        this.object.spotLight.visible = this.spotLight.visible;
        this.object.add(this.object.spotLight);

        // Create the 2nd spotlight and turn on shadows for this light
        this.object.spotLight2 = new THREE.SpotLight(this.spotLight2.color, this.spotLight2.intensity, this.spotLight2.distance, this.spotLight2.angle, this.spotLight2.penumbra);
        this.object.spotLight2.position.set(this.spotLight2.position.x, this.spotLight2.position.y, this.spotLight2.position.z);
        this.object.spotLight2.castShadow = true;

        // Set up shadow properties for this light
        this.object.spotLight2.shadow.mapSize.width = 512;
        this.object.spotLight2.shadow.mapSize.height = 512;
        this.object.spotLight2.shadow.camera.near = 5.0;
        this.object.spotLight2.shadow.camera.far = 15.0;
        this.object.spotLight2.shadow.camera.focus = 1.0;
        this.object.spotLight2.visible = this.spotLight2.visible;
        this.object.add(this.object.spotLight2);

        // Create a camera's spotlight (to point at the camera's target)
        this.object.cameraSpotLight = new THREE.SpotLight(this.cameraSpotLight.color, this.cameraSpotLight.intensity, this.cameraSpotLight.distance, this.cameraSpotLight.angle, this.cameraSpotLight.penumbra);
        
        // Set up shadow properties for this light
        this.object.cameraSpotLight.castShadow = true;
        this.object.cameraSpotLight.shadow.mapSize.width = 512;
        this.object.cameraSpotLight.shadow.mapSize.height = 512;
        this.object.cameraSpotLight.shadow.camera.near = 5.0;
        this.object.cameraSpotLight.shadow.camera.far = 15.0;
        this.object.cameraSpotLight.shadow.camera.focus = 1.0;
        this.object.cameraSpotLight.visible = this.cameraSpotLight.visible;
        this.object.add(this.object.cameraSpotLight);

        // Create the flashlight and turn on shadows for this light
        this.object.flashLight = new THREE.SpotLight(this.flashLight.color, this.flashLight.intensity, this.flashLight.distance, this.flashLight.angle, this.flashLight.penumbra);
        this.object.flashLight.castShadow = true;

        // Set up shadow properties for this light
        this.object.flashLight.shadow.mapSize.width = 512;
        this.object.flashLight.shadow.mapSize.height = 512;
        this.object.flashLight.shadow.camera.near = 0.01;
        this.object.flashLight.shadow.camera.far = 10.0;
        this.object.flashLight.shadow.camera.focus = 1.0;
        this.object.flashLight.visible = this.flashLight.visible;

        // Create a point light (lamp)
        this.object.pointLight = new THREE.PointLight(0xffffff, 1.0);
        this.object.pointLight.visible = false;
        // this.object.add(this.object.pointLight);

    }
}