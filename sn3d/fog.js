import * as THREE from '../three/build/three.module.js';

/**
 * Fog
 * 
 * @parameters = {
 *  enabled: Boolean,
 *  color: Color,
 *  near: Number,
 *  far: Number
 * }
 */

export default class Fog {
    constructor(parameters) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        // Create the fog
        this.object = new THREE.Fog(this.color, this.near, this.far);
    }
}