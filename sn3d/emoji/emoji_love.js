import * as THREE from '../../three/build/three.module.js';
import { GLTFLoader } from '../../three/examples/jsm/loaders/GLTFLoader.js';

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  eyeHeight: Number,
 *  scale: Vector3,
 *  walkingSpeed: Number,
 *  initialDirection: Number,
 *  turningSpeed: Number,
 *  runningFactor: Number,
 *  keyCodes: { fixedView: String, firstPersonView: String, thirdPersonView: String, topView: String, viewMode: String, userInterface: String, miniMap: String, help: String, statistics: String, ambientLight: String, directionalLight: String, spotLight: String, flashLight: String, run: String, left: String, right: String, backward: String, forward: String, jump: String, yes: String, no: String, wave: String, punch: String, thumbsUp: String }
 * }
 */

export default class EmojiLove{
    constructor(parameters) {
        function onLoad(player, description) {
            player.object = description.scene;
            player.animations = description.animations;

            // Turn on shadows for this object
            player.setShadow(player.object);

            // Get the object's axis-aligned bounding box (AABB) in 3D space
            const box = new THREE.Box3();
            box.setFromObject(player.object); // This function may result in a larger box than strictly necessary: https://threejs.org/docs/#api/en/math/Box3.setFromObject

            // Compute the object size
            player.size = new THREE.Vector3();
            box.getSize(player.size);

            // Adjust the object's oversized dimensions (hard-coded; see previous comments)
            player.radius = 1.5 * player.scale.x; // Should be: player.radius = Math.sqrt(player.size.x * player.scale.x * player.size.x * player.scale.x + player.size.z * player.scale.z * player.size.z * player.scale.z);

            // Set the object's eye height
            player.eyeHeight *= player.size.y * player.scale.y;

            player.object.scale.set(player.scale.x, player.scale.y, player.scale.z);
            player.loaded = true;
        }

        function onProgress(url, xhr) {
            console.log('Resource "' + url + '" ' + (100.0 * xhr.loaded / xhr.total).toFixed(0) + '% loaded.');
        }

        function onError(url, error) {
            console.error('Error loading resource ' + url + ' (' + error + ').');
        }
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }
        this.initialDirection = THREE.MathUtils.degToRad(this.initialDirection);
        this.keyStates = { fixedView: false, firstPersonView: false, thirdPersonView: false, topView: false, viewMode: false, miniMap: false, statistics: false, userInterface: false, help: false, run: false, left: false, right: false, backward: false, forward: false, jump: false, yes: false, no: false, wave: false, punch: false, thumbsUp: false };
        this.loaded = false;

        // Create a resource .gltf or .glb file loader
        const loader = new GLTFLoader();

        // Load a model description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => onLoad(this, description),

            // onProgress callback
            xhr => onProgress(this.url, xhr),

            // onError callback
            error => onError(this.url, error)
        );
    }

    setShadow(object) {
        object.traverseVisible(function (child) { // Modifying the scene graph inside the callback is discouraged: https://threejs.org/docs/index.html?q=object3d#api/en/core/Object3D.traverseVisible
            if (child.material) {
                child.castShadow = true;
                child.receiveShadow = false;
            }
        });
    }
}