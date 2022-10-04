import * as THREE from '../three/build/three.module.js';
import { skyboxTexturesData } from './default_data.js';

/**
 * Skybox
 * 
 * @parameters = {
 *  textureUrl: String,
 *  size: Vector2
 * }
 */
export default class Skybox {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        let texture;
        let materialArray = [];
        // Available templates: divine (earth/heaven), milkyWay
        // let skyboxTemplate = skyboxTexturesData.divine;
        let skyboxTemplate = skyboxTexturesData.milkyWay;

        // Textures order: ft bk up dn rt lf
        for (let k = 0; k < 6; k++) {
            texture = new THREE.TextureLoader().load(skyboxTexturesData.path + skyboxTemplate[k] + 
                skyboxTexturesData.format);

            materialArray.push(new THREE.MeshBasicMaterial({ map: texture }));

            materialArray[k].side = THREE.BackSide;
        }

        let skyboxGeo = new THREE.BoxGeometry(200, 200, 200);
        this.object = new THREE.Mesh(skyboxGeo, materialArray);
    }
}