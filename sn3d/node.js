import * as THREE from '../three/build/three.module.js';
import { nodeData } from './default_data.js';

/**
 * Node
 * 
 * @parameters = {
 *   textureUrl: String,
 *   color: color,
 *   position { x, y ,z }
 *   geometry: { radius, widthSegments, heightSegments }
 * }
 */
export default class Node {
    constructor(parameters, user) {
        for (const [key, value] of Object.entries(parameters)) {
            Object.defineProperty(this, key, { value: value, writable: true, configurable: true, enumerable: true });
        }

        const material = new THREE.MeshPhongMaterial( { color: nodeData.color, side: THREE.DoubleSide } );
        
        const geometry = new THREE.SphereGeometry(nodeData.geometry.radius, 32, 16 );
        this.object = new THREE.Mesh(geometry, material);
    }    

    setColor(color){
        debugger
        this.object.material.color = color;
    }
}